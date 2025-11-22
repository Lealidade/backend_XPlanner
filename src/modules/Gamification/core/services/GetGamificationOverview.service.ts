// // // src/modules/Gamification/core/services/GetGamificationOverview.service.ts
// // import { inject, injectable } from "tsyringe";

// // import type { UserXP } from "@/generated/prisma/client";

// // import type { IFinancialProfileRepository } from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";
// // import type { IUserLearningStepProgressRepository } from "@/modules/LearningPaths/data/interfaces/IUserLearningStepProgressRepository";
// // import type { IUserGoalRepository } from "@/modules/Gamification/goals/data/interfaces/IUserGoalRepository";
// // import type { IUserChallengeProgressRepository } from "@/modules/Gamification/challenges/data/interfaces/IUserChallengeProgressRepository";
// // import type { IChallengeRepository } from "@/modules/Gamification/challenges/data/interfaces/IChallengeRepository";

// // interface IRequest {
// //     userXP: UserXP;
// // }

// // interface IGamificationOverviewResponse {
// //     user: {
// //         id: string;
// //         username: string | null;
// //         avatarUrl: string | null;
// //         totalXp: number;
// //         currentLevel: string;
// //         xpToNextLevel: number;
// //         xpCoinsBalance: number;
// //         dayStreak: number;
// //     };
// //     financialProfile: {
// //         hasProfile: boolean;
// //         overallScore: number | null;
// //         desenrolaScore: number | null;
// //         organizaScore: number | null;
// //         reservaScore: number | null;
// //         investeScore: number | null;
// //         hasCompletedOnboarding: boolean;
// //     };
// //     learning: {
// //         completedStepsCount: number;
// //     };
// //     goals: {
// //         activeGoalsCount: number;
// //         completedGoalsCount: number;
// //     };
// //     challenges: {
// //         availableChallengesCount: number;
// //         activeChallengesCount: number;
// //         completedChallengesCount: number;
// //     };
// // }

// // @injectable()
// // export class GetGamificationOverviewService {
// //     constructor(
// //         @inject("FinancialProfileRepository")
// //         private financialProfileRepository: IFinancialProfileRepository,

// //         @inject("UserLearningStepProgressRepository")
// //         private userLearningStepProgressRepository: IUserLearningStepProgressRepository,

// //         @inject("UserGoalRepository")
// //         private userGoalRepository: IUserGoalRepository,

// //         @inject("UserChallengeProgressRepository")
// //         private userChallengeProgressRepository: IUserChallengeProgressRepository,

// //         @inject("ChallengeRepository")
// //         private challengeRepository: IChallengeRepository,
// //     ) { }

// //     // public async execute({ userXP }: IRequest): Promise<IGamificationOverviewResponse> {
// //     //     // 1) Perfil financeiro (pode não existir ainda)
// //     //     const profile = await this.financialProfileRepository.findByUserXPId(userXP.id);

// //     //     // 2) Learning – quantos steps já foram concluídos em qualquer trilha
// //     //     const userSteps =
// //     //         await this.userLearningStepProgressRepository.listByUserXP(userXP.id);
// //     //     const completedStepsCount = userSteps.length;

// //     //     // 3) Goals – metas personalizadas do usuário
// //     //     const userGoals = await this.userGoalRepository.listByUserXP(userXP.id);
// //     //     const activeGoalsCount = userGoals.filter((g) => g.isActive).length;
// //     //     const completedGoalsCount = userGoals.filter((g) => !!g.completedAt).length;

// //     //     // 4) Challenges – progresso em desafios
// //     //     const allChallenges = await this.challengeRepository.listAll();
// //     //     const progresses =
// //     //         await this.userChallengeProgressRepository.listByUserXP(userXP.id);

// //     //     const completedChallengesCount = progresses.filter((p) => p.isCompleted).length;
// //     //     const activeChallengesCount = progresses.filter((p) => !p.isCompleted).length;

// //     //     return {
// //     //         user: {
// //     //             id: userXP.id,
// //     //             username: userXP.username ?? null,
// //     //             avatarUrl: userXP.avatarUrl ?? null,
// //     //             totalXp: userXP.totalXp,
// //     //             currentLevel: userXP.currentLevel,
// //     //             xpToNextLevel: userXP.xpToNextLevel,
// //     //             xpCoinsBalance: userXP.xpCoinsBalance,
// //     //             dayStreak: userXP.dayStreak,
// //     //         },
// //     //         financialProfile: {
// //     //             hasProfile: !!profile,
// //     //             overallScore: profile?.overallScore ?? null,
// //     //             desenrolaScore: profile?.desenrolaScore ?? null,
// //     //             organizaScore: profile?.organizaScore ?? null,
// //     //             reservaScore: profile?.reservaScore ?? null,
// //     //             investeScore: profile?.investeScore ?? null,
// //     //             hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
// //     //         },
// //     //         learning: {
// //     //             completedStepsCount,
// //     //         },
// //     //         goals: {
// //     //             activeGoalsCount,
// //     //             completedGoalsCount,
// //     //         },
// //     //         challenges: {
// //     //             availableChallengesCount: allChallenges.length,
// //     //             activeChallengesCount,
// //     //             completedChallengesCount,
// //     //         },
// //     //     };
// //     // }

// //     public async execute({ userXP }: IRequest): Promise<IGamificationOverviewResponse> {
// //         // 1) Perfil financeiro (pode não existir ainda)
// //         const profile = await this.financialProfileRepository.findByUserXPId(userXP.id);

// //         // 2) Learning – quantos steps já foram concluídos em qualquer trilha
// //         const userSteps =
// //             await this.userLearningStepProgressRepository.listByUserXP(userXP.id);
// //         const completedStepsCount = userSteps.length;

// //         // 3) Goals – metas personalizadas do usuário
// //         const userGoals = await this.userGoalRepository.listByUserXPId(userXP.id);
// //         const activeGoalsCount = userGoals.filter((g) => g.isActive).length;
// //         const completedGoalsCount = userGoals.filter((g) => !!g.completedAt).length;

// //         // 4) Challenges – progresso em desafios
// //         const allChallenges = await this.challengeRepository.findAll();
// //         const progresses =
// //             await this.userChallengeProgressRepository.listByUserXP(userXP.id);

// //         const completedChallengesCount = progresses.filter((p) => p.isCompleted).length;
// //         const activeChallengesCount = progresses.filter((p) => !p.isCompleted).length;

// //         return {
// //             user: {
// //                 id: userXP.id,
// //                 username: userXP.username ?? null,
// //                 avatarUrl: userXP.avatarUrl ?? null,
// //                 totalXp: userXP.totalXp,
// //                 currentLevel: userXP.currentLevel,
// //                 xpToNextLevel: userXP.xpToNextLevel,
// //                 xpCoinsBalance: userXP.xpCoinsBalance,
// //                 dayStreak: userXP.dayStreak,
// //             },
// //             financialProfile: {
// //                 hasProfile: !!profile,
// //                 overallScore: profile?.overallScore ?? null,
// //                 desenrolaScore: profile?.desenrolaScore ?? null,
// //                 organizaScore: profile?.organizaScore ?? null,
// //                 reservaScore: profile?.reservaScore ?? null,
// //                 investeScore: profile?.investeScore ?? null,
// //                 hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
// //             },
// //             learning: {
// //                 completedStepsCount,
// //             },
// //             goals: {
// //                 activeGoalsCount,
// //                 completedGoalsCount,
// //             },
// //             challenges: {
// //                 availableChallengesCount: allChallenges.length,
// //                 activeChallengesCount,
// //                 completedChallengesCount,
// //             },
// //         };
// //     }

// // }

// // src/modules/Gamification/core/services/GetGamificationOverview.service.ts
// import { inject, injectable } from "tsyringe";

// import type {
//     UserXP,
//     FinancialProfile,
// } from "@/generated/prisma/client";

// import type { IFinancialProfileRepository } from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";
// import type { IUserLearningStepProgressRepository } from "@/modules/LearningPaths/data/interfaces/IUserLearningStepProgressRepository";
// import type { IUserGoalRepository } from "@/modules/Gamification/goals/data/interfaces/IUserGoalRepository";
// import type { IUserChallengeProgressRepository } from "@/modules/Gamification/challenges/data/interfaces/IUserChallengeProgressRepository";
// import type { IChallengeRepository } from "@/modules/Gamification/challenges/data/interfaces/IChallengeRepository";

// interface IRequest {
//     userXP: UserXP;
// }

// interface IGamificationOverviewResponse {
//     user: {
//         id: string;
//         username: string | null;
//         avatarUrl: string | null;
//         totalXp: number;
//         currentLevel: string;
//         xpToNextLevel: number;
//         xpCoinsBalance: number;
//         dayStreak: number;
//     };
//     financialProfile: {
//         hasProfile: boolean;
//         overallScore: number;
//         desenrolaScore: number;
//         organizaScore: number;
//         reservaScore: number;
//         investeScore: number;
//         hasCompletedOnboarding: boolean;
//     };
//     learning: {
//         completedStepsCount: number;
//     };
//     goals: {
//         activeGoalsCount: number;
//         completedGoalsCount: number;
//     };
//     challenges: {
//         availableChallengesCount: number;
//         activeChallengesCount: number;
//         completedChallengesCount: number;
//     };
// }

// type DimensionKey = "DESENROLA" | "ORGANIZA" | "RESERVA" | "INVESTE";

// @injectable()
// export class GetGamificationOverviewService {
//     constructor(
//         @inject("FinancialProfileRepository")
//         private financialProfileRepository: IFinancialProfileRepository,

//         @inject("UserLearningStepProgressRepository")
//         private userLearningStepProgressRepository: IUserLearningStepProgressRepository,

//         @inject("UserGoalRepository")
//         private userGoalRepository: IUserGoalRepository,

//         @inject("UserChallengeProgressRepository")
//         private userChallengeProgressRepository: IUserChallengeProgressRepository,

//         @inject("ChallengeRepository")
//         private challengeRepository: IChallengeRepository,
//     ) { }

//     public async execute({ userXP }: IRequest): Promise<IGamificationOverviewResponse> {
//         // 1) Perfil financeiro base (do quiz)
//         const profile = await this.financialProfileRepository.findByUserXPId(
//             userXP.id,
//         );

//         // 2) Learning – quantos steps concluídos
//         const userSteps =
//             await this.userLearningStepProgressRepository.listByUserXP(userXP.id);
//         const completedStepsCount = userSteps.length;

//         // 3) Goals – metas do usuário (importante: incluir o Goal, com dimension)
//         const userGoals = await this.userGoalRepository.listByUserXPId(userXP.id);
//         const activeGoalsCount = userGoals.filter((g: any) => g.isActive).length;
//         const completedGoalsCount = userGoals.filter(
//             (g: any) => !!g.completedAt,
//         ).length;

//         // 4) Challenges – progresso em desafios
//         const allChallenges = await this.challengeRepository.findAll();
//         const progresses =
//             await this.userChallengeProgressRepository.listByUserXP(userXP.id);

//         const completedChallengesCount = progresses.filter(
//             (p) => p.isCompleted,
//         ).length;
//         const activeChallengesCount = progresses.filter(
//             (p) => !p.isCompleted,
//         ).length;

//         // 5) Score dinâmico movido por metas
//         const dynamicScores = this.computeDynamicScoresFromGoals(
//             profile,
//             userGoals as any[],
//         );

//         return {
//             user: {
//                 id: userXP.id,
//                 username: userXP.username ?? null,
//                 avatarUrl: userXP.avatarUrl ?? null,
//                 totalXp: userXP.totalXp,
//                 currentLevel: userXP.currentLevel,
//                 xpToNextLevel: userXP.xpToNextLevel,
//                 xpCoinsBalance: userXP.xpCoinsBalance,
//                 dayStreak: userXP.dayStreak,
//             },
//             financialProfile: {
//                 hasProfile: !!profile,
//                 overallScore: dynamicScores.overallScore,
//                 desenrolaScore: dynamicScores.desenrolaScore,
//                 organizaScore: dynamicScores.organizaScore,
//                 reservaScore: dynamicScores.reservaScore,
//                 investeScore: dynamicScores.investeScore,
//                 hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
//             },
//             learning: {
//                 completedStepsCount,
//             },
//             goals: {
//                 activeGoalsCount,
//                 completedGoalsCount,
//             },
//             challenges: {
//                 availableChallengesCount: allChallenges.length,
//                 activeChallengesCount,
//                 completedChallengesCount,
//             },
//         };
//     }

//     /**
//      * Combina:
//      *  - score base do FinancialProfile (quiz de diagnóstico)
//      *  - deltas calculados a partir das metas do usuário (UserGoal + Goal.dimension)
//      */
//     private computeDynamicScoresFromGoals(
//         profile: FinancialProfile | null,
//         userGoals: any[],
//     ): {
//         desenrolaScore: number;
//         organizaScore: number;
//         reservaScore: number;
//         investeScore: number;
//         overallScore: number;
//     } {
//         const base = {
//             DESENROLA: profile?.desenrolaScore ?? 0,
//             ORGANIZA: profile?.organizaScore ?? 0,
//             RESERVA: profile?.reservaScore ?? 0,
//             INVESTE: profile?.investeScore ?? 0,
//         };

//         const grouped: Record<DimensionKey, any[]> = {
//             DESENROLA: [],
//             ORGANIZA: [],
//             RESERVA: [],
//             INVESTE: [],
//         };

//         for (const g of userGoals) {
//             const dim = g.goal?.dimension as DimensionKey | undefined;
//             if (!dim) continue;
//             grouped[dim].push(g);
//         }

//         const desenrolaDelta = this.computeDeltaForDimension(grouped.DESENROLA, {
//             maxPerGoal: 40,
//             maxTotal: 120,
//             allowNegative: true,
//         });

//         const organizaDelta = this.computeDeltaForDimension(grouped.ORGANIZA, {
//             maxPerGoal: 25,
//             maxTotal: 80,
//             allowNegative: false,
//         });

//         const reservaDelta = this.computeDeltaForDimension(grouped.RESERVA, {
//             maxPerGoal: 40,
//             maxTotal: 120,
//             allowNegative: true,
//         });

//         const investeDelta = this.computeDeltaForDimension(grouped.INVESTE, {
//             maxPerGoal: 35,
//             maxTotal: 100,
//             allowNegative: false,
//         });

//         const desenrolaScore = clamp(base.DESENROLA + desenrolaDelta, 0, 1000);
//         const organizaScore = clamp(base.ORGANIZA + organizaDelta, 0, 1000);
//         const reservaScore = clamp(base.RESERVA + reservaDelta, 0, 1000);
//         const investeScore = clamp(base.INVESTE + investeDelta, 0, 1000);

//         const overallScore = Math.round(
//             (desenrolaScore + organizaScore + reservaScore + investeScore) / 4,
//         );

//         return {
//             desenrolaScore,
//             organizaScore,
//             reservaScore,
//             investeScore,
//             overallScore,
//         };
//     }

//     /**
//      * Regra simples por dimensão:
//      *  - calcula progresso da meta: currentAmount / targetAmount
//      *  - dá um bônus proporcional até maxPerGoal por meta
//      *  - se allowNegative: metas 0% dão uma penalidade leve
//      *  - limita o impacto total a [-maxTotal, +maxTotal]
//      */
//     private computeDeltaForDimension(
//         goals: any[],
//         opts: { maxPerGoal: number; maxTotal: number; allowNegative: boolean },
//     ): number {
//         if (!goals.length) return 0;

//         let total = 0;

//         for (const g of goals) {
//             const target = Math.max(g.targetAmount ?? 0, 1);
//             const progress = clamp((g.currentAmount ?? 0) / target, 0, 1);

//             // base: 0..maxPerGoal
//             let delta = progress * opts.maxPerGoal;

//             // se permitir negativo, meta que existe mas está em 0% dá uma leve penalidade
//             if (opts.allowNegative && progress === 0) {
//                 delta -= opts.maxPerGoal * 0.3; // -30% do máximo
//             }

//             total += delta;
//         }

//         if (total > opts.maxTotal) total = opts.maxTotal;
//         if (opts.allowNegative && total < -opts.maxTotal) {
//             total = -opts.maxTotal;
//         }

//         return total;
//     }
// }

// function clamp(value: number, min: number, max: number): number {
//     return Math.min(max, Math.max(min, value));
// }

// src/modules/Gamification/core/services/GetGamificationOverview.service.ts
import { inject, injectable } from "tsyringe";
import { prisma } from "@/database/prismaClient";
import type { UserXP } from "@/generated/prisma/client";

import type { IUserGoalRepository } from "@/modules/Gamification/goals/data/interfaces/IUserGoalRepository";
import type { IUserLearningStepProgressRepository } from "@/modules/LearningPaths/data/interfaces/IUserLearningStepProgressRepository";

import type { GamificationOverviewDTO } from "../data/dtos/GamificationOverviewDTO";

interface IRequest {
    userXPId: string;
}

@injectable()
export class GetGamificationOverviewService {
    constructor(
        @inject("UserGoalRepository")
        private userGoalRepository: IUserGoalRepository,

        @inject("UserLearningStepProgressRepository")
        private userLearningStepProgressRepository: IUserLearningStepProgressRepository,
    ) { }

    /**
     * Regra simples de level baseada em XP.
     * Ajusta como quiser depois (exponencial, tiers, etc).
     */
    private calculateLevelFromXp(xpPoints: number): number {
        if (xpPoints <= 0) return 1;

        // Exemplo: 0–99 => lvl 1, 100–199 => lvl 2, ...
        return Math.floor(xpPoints / 100) + 1;
    }

    public async execute({ userXPId }: IRequest): Promise<GamificationOverviewDTO> {
        const userXP = await prisma.userXP.findUnique({
            where: { id: userXPId },
        });

        if (!userXP) {
            throw new Error("USER_XP_NOT_FOUND");
        }

        const [userGoals, stepsProgress] = await Promise.all([
            this.userGoalRepository.listByUserXPId(userXPId),
            this.userLearningStepProgressRepository.listByUserXP(userXPId),
        ]);

        const activeGoals = userGoals.filter((g) => g.isActive).length;
        const completedGoals = userGoals.filter((g) => !!g.completedAt).length;

        const totalCompletedSteps = stepsProgress.filter(
            (s) => !!s.completedAt,
        ).length;

        const typedUserXP = userXP as UserXP;

        const xpPoints = (typedUserXP as any).xpPoints ?? 0;
        const xpCoins = (typedUserXP as any).xpCoins ?? 0;

        const level = this.calculateLevelFromXp(xpPoints);

        const overview: GamificationOverviewDTO = {
            userXP: {
                xpPoints,
                xpCoins,
                level,
            },
            goals: {
                activeGoals,
                completedGoals,
            },
            learning: {
                totalCompletedSteps,
            },
        };

        return overview;
    }
}
