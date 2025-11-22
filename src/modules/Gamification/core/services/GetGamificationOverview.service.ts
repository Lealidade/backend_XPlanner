// src/modules/Gamification/core/services/GetGamificationOverview.service.ts
import { inject, injectable } from "tsyringe";

import type { UserXP } from "@/generated/prisma/client";

import type { IFinancialProfileRepository } from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";
import type { IUserLearningStepProgressRepository } from "@/modules/LearningPaths/data/interfaces/IUserLearningStepProgressRepository";
import type { IUserGoalRepository } from "@/modules/Gamification/goals/data/interfaces/IUserGoalRepository";
import type { IUserChallengeProgressRepository } from "@/modules/Gamification/challenges/data/interfaces/IUserChallengeProgressRepository";
import type { IChallengeRepository } from "@/modules/Gamification/challenges/data/interfaces/IChallengeRepository";

interface IRequest {
    userXP: UserXP;
}

interface IGamificationOverviewResponse {
    user: {
        id: string;
        username: string | null;
        avatarUrl: string | null;
        totalXp: number;
        currentLevel: string;
        xpToNextLevel: number;
        xpCoinsBalance: number;
        dayStreak: number;
    };
    financialProfile: {
        hasProfile: boolean;
        overallScore: number | null;
        desenrolaScore: number | null;
        organizaScore: number | null;
        reservaScore: number | null;
        investeScore: number | null;
        hasCompletedOnboarding: boolean;
    };
    learning: {
        completedStepsCount: number;
    };
    goals: {
        activeGoalsCount: number;
        completedGoalsCount: number;
    };
    challenges: {
        availableChallengesCount: number;
        activeChallengesCount: number;
        completedChallengesCount: number;
    };
}

@injectable()
export class GetGamificationOverviewService {
    constructor(
        @inject("FinancialProfileRepository")
        private financialProfileRepository: IFinancialProfileRepository,

        @inject("UserLearningStepProgressRepository")
        private userLearningStepProgressRepository: IUserLearningStepProgressRepository,

        @inject("UserGoalRepository")
        private userGoalRepository: IUserGoalRepository,

        @inject("UserChallengeProgressRepository")
        private userChallengeProgressRepository: IUserChallengeProgressRepository,

        @inject("ChallengeRepository")
        private challengeRepository: IChallengeRepository,
    ) { }

    // public async execute({ userXP }: IRequest): Promise<IGamificationOverviewResponse> {
    //     // 1) Perfil financeiro (pode não existir ainda)
    //     const profile = await this.financialProfileRepository.findByUserXPId(userXP.id);

    //     // 2) Learning – quantos steps já foram concluídos em qualquer trilha
    //     const userSteps =
    //         await this.userLearningStepProgressRepository.listByUserXP(userXP.id);
    //     const completedStepsCount = userSteps.length;

    //     // 3) Goals – metas personalizadas do usuário
    //     const userGoals = await this.userGoalRepository.listByUserXP(userXP.id);
    //     const activeGoalsCount = userGoals.filter((g) => g.isActive).length;
    //     const completedGoalsCount = userGoals.filter((g) => !!g.completedAt).length;

    //     // 4) Challenges – progresso em desafios
    //     const allChallenges = await this.challengeRepository.listAll();
    //     const progresses =
    //         await this.userChallengeProgressRepository.listByUserXP(userXP.id);

    //     const completedChallengesCount = progresses.filter((p) => p.isCompleted).length;
    //     const activeChallengesCount = progresses.filter((p) => !p.isCompleted).length;

    //     return {
    //         user: {
    //             id: userXP.id,
    //             username: userXP.username ?? null,
    //             avatarUrl: userXP.avatarUrl ?? null,
    //             totalXp: userXP.totalXp,
    //             currentLevel: userXP.currentLevel,
    //             xpToNextLevel: userXP.xpToNextLevel,
    //             xpCoinsBalance: userXP.xpCoinsBalance,
    //             dayStreak: userXP.dayStreak,
    //         },
    //         financialProfile: {
    //             hasProfile: !!profile,
    //             overallScore: profile?.overallScore ?? null,
    //             desenrolaScore: profile?.desenrolaScore ?? null,
    //             organizaScore: profile?.organizaScore ?? null,
    //             reservaScore: profile?.reservaScore ?? null,
    //             investeScore: profile?.investeScore ?? null,
    //             hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
    //         },
    //         learning: {
    //             completedStepsCount,
    //         },
    //         goals: {
    //             activeGoalsCount,
    //             completedGoalsCount,
    //         },
    //         challenges: {
    //             availableChallengesCount: allChallenges.length,
    //             activeChallengesCount,
    //             completedChallengesCount,
    //         },
    //     };
    // }

    public async execute({ userXP }: IRequest): Promise<IGamificationOverviewResponse> {
        // 1) Perfil financeiro (pode não existir ainda)
        const profile = await this.financialProfileRepository.findByUserXPId(userXP.id);

        // 2) Learning – quantos steps já foram concluídos em qualquer trilha
        const userSteps =
            await this.userLearningStepProgressRepository.listByUserXP(userXP.id);
        const completedStepsCount = userSteps.length;

        // 3) Goals – metas personalizadas do usuário
        const userGoals = await this.userGoalRepository.listByUserXPId(userXP.id);
        const activeGoalsCount = userGoals.filter((g) => g.isActive).length;
        const completedGoalsCount = userGoals.filter((g) => !!g.completedAt).length;

        // 4) Challenges – progresso em desafios
        const allChallenges = await this.challengeRepository.findAll();
        const progresses =
            await this.userChallengeProgressRepository.listByUserXP(userXP.id);

        const completedChallengesCount = progresses.filter((p) => p.isCompleted).length;
        const activeChallengesCount = progresses.filter((p) => !p.isCompleted).length;

        return {
            user: {
                id: userXP.id,
                username: userXP.username ?? null,
                avatarUrl: userXP.avatarUrl ?? null,
                totalXp: userXP.totalXp,
                currentLevel: userXP.currentLevel,
                xpToNextLevel: userXP.xpToNextLevel,
                xpCoinsBalance: userXP.xpCoinsBalance,
                dayStreak: userXP.dayStreak,
            },
            financialProfile: {
                hasProfile: !!profile,
                overallScore: profile?.overallScore ?? null,
                desenrolaScore: profile?.desenrolaScore ?? null,
                organizaScore: profile?.organizaScore ?? null,
                reservaScore: profile?.reservaScore ?? null,
                investeScore: profile?.investeScore ?? null,
                hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
            },
            learning: {
                completedStepsCount,
            },
            goals: {
                activeGoalsCount,
                completedGoalsCount,
            },
            challenges: {
                availableChallengesCount: allChallenges.length,
                activeChallengesCount,
                completedChallengesCount,
            },
        };
    }

}
