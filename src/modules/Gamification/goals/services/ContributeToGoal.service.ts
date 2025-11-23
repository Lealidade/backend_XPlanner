import { inject, injectable } from "tsyringe";
import {
    CashFlowOperation,
    type CashFlow,
    type FinancialProfile,
    type FinancialDimension,
} from "@/generated/prisma/client";

import type {
    IUserGoalRepository,
    UserGoalWithTemplate,
} from "../data/interfaces/IUserGoalRepository";

import type {
    IFinancialProfileRepository,
} from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";

import { CreateCashFlowService } from "@/modules/CashFlow/services/CreateCashFlow.service";
import { UserXPGamificationService } from "@/modules/Gamification/core/services/UserXPGamification.service";

interface IRequest {
    userXPId: string;
    userGoalId: string;
    amount: number;
    date?: Date;
    label?: string;
    category?: string;
    recipient?: string | null;
}

interface IResponse {
    goal: UserGoalWithTemplate;
    cashFlow: CashFlow;
    profile: FinancialProfile | null;
}

// score neutro
const BASE_DIMENSION_SCORE = 500;

// mesma penalidade usada na criação da meta
const CREATION_PENALTY: Record<FinancialDimension, number> = {
    DESENROLA: 40,
    ORGANIZA: 20,
    RESERVA: 0,
    INVESTE: 0,
};

function clampScore(value: number): number {
    return Math.max(0, Math.min(1000, value));
}

@injectable()
export class ContributeToGoalService {
    constructor(
        @inject("UserGoalRepository")
        private userGoalRepository: IUserGoalRepository,

        @inject("FinancialProfileRepository")
        private financialProfileRepository: IFinancialProfileRepository,

        @inject(CreateCashFlowService)
        private createCashFlowService: CreateCashFlowService,

        @inject("UserXPGamificationService")
        private userXPGamification: UserXPGamificationService,
    ) { }

    /**
     * Aplica o impacto de um avanço de progresso (progressDelta 0–1)
     * na dimensão correspondente do FinancialProfile.
     *
     * Ideia:
     *  - na criação, tiramos -P pontos da dimensão
     *  - conforme o progresso vai de 0% a 100%, devolvemos +P * progressDelta
     *  - no final, o efeito líquido da meta é ~0 (e a recompensa vem em XP/coins)
     */
    private async applyGoalProgressImpactOnProfile(
        userXPId: string,
        dimension: FinancialDimension,
        progressDelta: number,
    ): Promise<FinancialProfile> {
        if (progressDelta <= 0) {
            const existing =
                await this.financialProfileRepository.findByUserXPId(userXPId);

            if (existing) return existing;

            // Se ainda não existir perfil (caso extremo), cria neutro
            const neutralOverall = BASE_DIMENSION_SCORE;
            return this.financialProfileRepository.upsertByUserXPId(userXPId, {
                overallScore: neutralOverall,
                desenrolaScore: BASE_DIMENSION_SCORE,
                organizaScore: BASE_DIMENSION_SCORE,
                reservaScore: BASE_DIMENSION_SCORE,
                investeScore: BASE_DIMENSION_SCORE,
                hasCompletedOnboarding: false,
                lastScoreChange: 0,
            });
        }

        const existing =
            await this.financialProfileRepository.findByUserXPId(userXPId);

        let desenrolaScore = existing?.desenrolaScore ?? BASE_DIMENSION_SCORE;
        let organizaScore = existing?.organizaScore ?? BASE_DIMENSION_SCORE;
        let reservaScore = existing?.reservaScore ?? BASE_DIMENSION_SCORE;
        let investeScore = existing?.investeScore ?? BASE_DIMENSION_SCORE;

        const penalty = CREATION_PENALTY[dimension] ?? 0;
        const scoreDelta = penalty * progressDelta;

        switch (dimension) {
            case "DESENROLA":
                desenrolaScore = clampScore(desenrolaScore + scoreDelta);
                break;
            case "ORGANIZA":
                organizaScore = clampScore(organizaScore + scoreDelta);
                break;
            case "RESERVA":
                reservaScore = clampScore(reservaScore + scoreDelta);
                break;
            case "INVESTE":
                investeScore = clampScore(investeScore + scoreDelta);
                break;
        }

        const previousOverall = existing?.overallScore ?? BASE_DIMENSION_SCORE;

        const overallScore = Math.round(
            (desenrolaScore +
                organizaScore +
                reservaScore +
                investeScore) /
            4,
        );

        const lastScoreChange = overallScore - previousOverall;

        const hasCompletedOnboarding =
            existing?.hasCompletedOnboarding ?? false;

        const updated =
            await this.financialProfileRepository.upsertByUserXPId(userXPId, {
                overallScore,
                desenrolaScore,
                organizaScore,
                reservaScore,
                investeScore,
                hasCompletedOnboarding,
                lastScoreChange,
            });

        return updated;
    }

    public async execute({
        userXPId,
        userGoalId,
        amount,
        date,
        label,
        category,
        recipient,
    }: IRequest): Promise<IResponse> {
        if (amount <= 0) {
            throw new Error("INVALID_AMOUNT");
        }

        const userGoal = await this.userGoalRepository.findByIdAndUserXPId(
            userGoalId,
            userXPId,
        );

        if (!userGoal) {
            throw new Error("USER_GOAL_NOT_FOUND");
        }

        const targetAmount = userGoal.targetAmount;
        if (targetAmount <= 0) {
            throw new Error("INVALID_TARGET_AMOUNT");
        }

        const wasAlreadyCompleted = !!userGoal.completedAt;
        const previousCurrentAmount = userGoal.currentAmount;

        const previousProgress =
            targetAmount > 0
                ? Math.min(1, previousCurrentAmount / targetAmount)
                : 0;

        const remaining = Math.max(0, targetAmount - previousCurrentAmount);

        if (remaining <= 0) {
            // já atingiu ou passou a meta
            throw new Error("GOAL_ALREADY_COMPLETED");
        }

        const effectiveAmount = Math.min(amount, remaining);

        const newCurrentAmount = previousCurrentAmount + effectiveAmount;

        const newProgressRaw =
            targetAmount > 0 ? newCurrentAmount / targetAmount : 0;
        const newProgress = Math.min(1, newProgressRaw);

        const progressPercent =
            targetAmount > 0
                ? Math.min(
                    100,
                    Math.round((newCurrentAmount / targetAmount) * 100),
                )
                : 0;

        const isCompleted = newCurrentAmount >= targetAmount;

        // 1) Atualizar progresso da meta
        const updatedGoal = await this.userGoalRepository.updateProgress({
            id: userGoal.id,
            userXPId,
            currentAmount: newCurrentAmount,
            progressPercent,
            isCompleted,
            completedAt: isCompleted ? new Date() : null,
        });

        // 2) Criar CashFlow vinculado
        const effectiveDate = date ?? new Date();

        const defaultLabel =
            label ??
            `Contribuição para meta: ${updatedGoal.customTitle || "Meta financeira"}`;

        const defaultCategory =
            category ??
            (updatedGoal.goal?.dimension
                ? `META_${updatedGoal.goal.dimension.toLowerCase()}`
                : "GOAL_CONTRIBUTION");

        const cashFlow = await this.createCashFlowService.execute({
            userXPId,
            date: effectiveDate,
            label: defaultLabel,
            category: defaultCategory,
            operation: CashFlowOperation.EXPENSE,
            amount: effectiveAmount,
            userGoalId: updatedGoal.id,
            recipient: recipient ?? null,
        });

        // 3) Recalcular FinancialProfile conforme progresso
        let profile: FinancialProfile | null = null;

        const dimension = updatedGoal.goal?.dimension ?? null;

        if (dimension) {
            const progressDelta = newProgress - previousProgress;
            profile = await this.applyGoalProgressImpactOnProfile(
                userXPId,
                dimension,
                progressDelta,
            );
        } else {
            profile =
                (await this.financialProfileRepository.findByUserXPId(
                    userXPId,
                )) ?? null;
        }

        // 4) Gamificação (XP/coins) se a meta foi concluída agora
        if (isCompleted && !wasAlreadyCompleted) {
            const xpFromTemplate =
                updatedGoal.goal?.xpPointsRewardOnCompletion ?? 0;
            const coinsFromTemplate =
                updatedGoal.goal?.xpCoinsRewardOnCompletion ?? 0;
            const coinsFromUserGoal =
                updatedGoal.xpCoinsRewardOnCompletion ?? 0;

            const totalCoins = coinsFromTemplate + coinsFromUserGoal;

            await this.userXPGamification.addXpAndCoins({
                userXPId,
                xpPoints: xpFromTemplate,
                xpCoins: totalCoins,
            });
        }

        return {
            goal: updatedGoal,
            cashFlow,
            profile,
        };
    }
}
