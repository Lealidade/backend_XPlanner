import { inject, injectable } from "tsyringe";
import type {
    UserGoal,
    FinancialProfile,
    FinancialDimension,
} from "@/generated/prisma/client";

import type { IUserGoalRepository } from "../data/interfaces/IUserGoalRepository";
import type { IGoalRepository } from "../data/interfaces/IGoalRepository";
import type {
    IFinancialProfileRepository,
} from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";

interface IRequest {
    userXPId: string;
    templateId?: string;
    customTitle: string;
    targetAmount: number;
    currentAmount?: number;
    targetDate: string; // obrigatório
}

// score neutro
const BASE_DIMENSION_SCORE = 500;

// penalidade ao criar uma meta em cada dimensão
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
export class CreateUserGoalService {
    constructor(
        @inject("UserGoalRepository")
        private userGoalRepository: IUserGoalRepository,

        @inject("GoalRepository")
        private goalRepository: IGoalRepository,

        @inject("FinancialProfileRepository")
        private financialProfileRepository: IFinancialProfileRepository,
    ) { }

    private calculateRecommendedMonthlyDeposit(
        targetAmount: number,
        currentAmount: number,
        targetDate: Date,
    ): number {
        const now = new Date();
        if (targetDate <= now) return 0;

        const diffMs = targetDate.getTime() - now.getTime();
        const months = diffMs / (1000 * 60 * 60 * 24 * 30); // aproximação

        if (months <= 0) return 0;

        const remaining = Math.max(0, targetAmount - currentAmount);
        return Math.ceil(remaining / months);
    }

    private async applyGoalCreationImpactOnProfile(
        userXPId: string,
        dimension: FinancialDimension,
    ): Promise<FinancialProfile> {
        const existing: FinancialProfile | null =
            await this.financialProfileRepository.findByUserXPId(userXPId);

        // scores atuais (ou neutros, se ainda não existir perfil)
        let desenrolaScore = existing?.desenrolaScore ?? BASE_DIMENSION_SCORE;
        let organizaScore = existing?.organizaScore ?? BASE_DIMENSION_SCORE;
        let reservaScore = existing?.reservaScore ?? BASE_DIMENSION_SCORE;
        let investeScore = existing?.investeScore ?? BASE_DIMENSION_SCORE;

        const penalty = CREATION_PENALTY[dimension] ?? 0;

        switch (dimension) {
            case "DESENROLA":
                desenrolaScore = clampScore(desenrolaScore - penalty);
                break;
            case "ORGANIZA":
                organizaScore = clampScore(organizaScore - penalty);
                break;
            case "RESERVA":
                reservaScore = clampScore(reservaScore - penalty);
                break;
            case "INVESTE":
                investeScore = clampScore(investeScore - penalty);
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

        const updatedProfile =
            await this.financialProfileRepository.upsertByUserXPId(userXPId, {
                overallScore,
                desenrolaScore,
                organizaScore,
                reservaScore,
                investeScore,
                hasCompletedOnboarding,
                lastScoreChange,
            });

        return updatedProfile;
    }

    public async execute({
        userXPId,
        templateId,
        customTitle,
        targetAmount,
        currentAmount = 0,
        targetDate,
    }: IRequest): Promise<UserGoal> {
        if (!targetDate) {
            throw new Error("TARGET_DATE_REQUIRED");
        }

        const parsedTargetDate = new Date(targetDate);
        if (Number.isNaN(parsedTargetDate.getTime())) {
            throw new Error("INVALID_TARGET_DATE");
        }

        // se vier templateId, buscamos o template para saber a dimensão
        let goalDimension: FinancialDimension | null = null;

        if (templateId) {
            const template = await this.goalRepository.findById(templateId);

            if (!template) {
                throw new Error("GOAL_TEMPLATE_NOT_FOUND");
            }

            goalDimension = template.dimension;
        }

        const recommendedMonthlyDeposit =
            this.calculateRecommendedMonthlyDeposit(
                targetAmount,
                currentAmount,
                parsedTargetDate,
            );

        const progressPercent =
            targetAmount > 0
                ? Math.min(
                    100,
                    Math.round((currentAmount / targetAmount) * 100),
                )
                : 0;

        // cria a meta do usuário
        const userGoal = await this.userGoalRepository.create({
            userXPId,
            goalId: templateId ?? null,
            customTitle,
            targetAmount,
            currentAmount,
            targetDate: parsedTargetDate,
            recommendedMonthlyDeposit,
            progressPercent,
            isActive: true,
        });

        // aplica impacto no perfil financeiro se soubermos a dimensão
        if (goalDimension) {
            await this.applyGoalCreationImpactOnProfile(userXPId, goalDimension);
        }

        return userGoal;
    }
}
