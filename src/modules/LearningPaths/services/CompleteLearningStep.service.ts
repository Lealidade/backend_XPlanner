// import { injectable } from "tsyringe";
// import { prisma } from "@/database/prismaClient";
// import type {
//     LearningStep,
//     QuizContent,
//     UserLearningStepProgress,
// } from "@/generated/prisma/client";
// import { UserXPGamificationService } from "@/modules/Gamification/core/services/UserXPGamification.service";

// interface IRequest {
//     userXPId: string;
//     learningStepId: string;
// }

// type LearningStepWithQuiz = LearningStep & { quizContent: QuizContent | null };

// @injectable()
// export class CompleteLearningStepService {
//     constructor(
//         private userXPGamification: UserXPGamificationService,
//     ) { }

//     private getRewards(step: LearningStepWithQuiz): {
//         xpPoints: number;
//         xpCoins: number;
//     } {
//         // QUIZ: usa as recompensas do QuizContent
//         if (step.type === "QUIZ") {
//             const quiz = step.quizContent;
//             if (!quiz) {
//                 // fallback seguro
//                 return { xpPoints: 30, xpCoins: 0 };
//             }

//             return {
//                 xpPoints: quiz.xpPointsReward,
//                 xpCoins: quiz.xpCoinsReward ?? 0,
//             };
//         }

//         // Outros tipos: recompensa fixa
//         return {
//             xpPoints: 20,
//             xpCoins: 0,
//         };
//     }

//     public async execute({
//         userXPId,
//         learningStepId,
//     }: IRequest): Promise<{
//         progress: UserLearningStepProgress;
//         rewards: { xpPoints: number; xpCoins: number };
//     }> {
//         // 1) Busca o step com o QuizContent (se tiver)
//         const step = await prisma.learningStep.findUnique({
//             where: { id: learningStepId },
//             include: { quizContent: true },
//         });

//         if (!step) {
//             throw new Error("LEARNING_STEP_NOT_FOUND");
//         }

//         const stepWithQuiz = step as LearningStepWithQuiz;

//         // 2) Verifica se o usuário já concluiu esse passo (idempotente)
//         const existing = await prisma.userLearningStepProgress.findFirst({
//             where: {
//                 userXPId,
//                 learningStepId,
//             },
//         });

//         if (existing) {
//             // já estava concluído → não dá XP de novo
//             return {
//                 progress: existing,
//                 rewards: { xpPoints: 0, xpCoins: 0 },
//             };
//         }

//         // 3) Calcula recompensas
//         const rewards = this.getRewards(stepWithQuiz);

//         // 4) Cria o registro de progresso do step
//         const progress = await prisma.userLearningStepProgress.create({
//             data: {
//                 userXPId,
//                 learningStepId,
//                 completedAt: new Date(),
//             },
//         });

//         // 5) Aplica XP/coins no UserXP
//         if (rewards.xpPoints > 0 || rewards.xpCoins > 0) {
//             await this.userXPGamification.addXpAndCoins({
//                 userXPId,
//                 xpPoints: rewards.xpPoints,
//                 xpCoins: rewards.xpCoins,
//             });
//         }

//         return { progress, rewards };
//     }
// }

// src/modules/LearningPaths/services/CompleteLearningStep.service.ts
import { inject, injectable } from "tsyringe";
import { prisma } from "@/database/prismaClient";
import type {
    LearningStep,
    QuizContent,
    UserLearningStepProgress,
} from "@/generated/prisma/client";
import { UserXPGamificationService } from "@/modules/Gamification/core/services/UserXPGamification.service";

interface IRequest {
    userXPId: string;
    learningStepId: string;
}

type LearningStepWithQuiz = LearningStep & { quizContent: QuizContent | null };

@injectable() // 👈 ESSENCIAL pro tsyringe conhecer o TypeInfo da classe
export class CompleteLearningStepService {
    constructor(
        @inject("UserXPGamificationService")
        private userXPGamification: UserXPGamificationService,
    ) { }

    private getRewards(step: LearningStepWithQuiz): {
        xpPoints: number;
        xpCoins: number;
    } {
        if (step.type === "QUIZ") {
            const quiz = step.quizContent;
            if (!quiz) {
                return { xpPoints: 30, xpCoins: 0 };
            }

            return {
                xpPoints: quiz.xpPointsReward,
                xpCoins: quiz.xpCoinsReward ?? 0,
            };
        }

        // ARTICLE / VIDEO / TOOL / OTHER
        return {
            xpPoints: 20,
            xpCoins: 0,
        };
    }

    public async execute({
        userXPId,
        learningStepId,
    }: IRequest): Promise<{
        progress: UserLearningStepProgress;
        rewards: { xpPoints: number; xpCoins: number };
    }> {
        const step = await prisma.learningStep.findUnique({
            where: { id: learningStepId },
            include: { quizContent: true },
        });

        if (!step) {
            throw new Error("LEARNING_STEP_NOT_FOUND");
        }

        const stepWithQuiz = step as LearningStepWithQuiz;

        const existing = await prisma.userLearningStepProgress.findFirst({
            where: {
                userXPId,
                learningStepId,
            },
        });

        if (existing) {
            return {
                progress: existing,
                rewards: { xpPoints: 0, xpCoins: 0 },
            };
        }

        const rewards = this.getRewards(stepWithQuiz);

        const progress = await prisma.userLearningStepProgress.create({
            data: {
                userXPId,
                learningStepId,
                completedAt: new Date(),
            },
        });

        if (rewards.xpPoints > 0 || rewards.xpCoins > 0) {
            await this.userXPGamification.addXpAndCoins({
                userXPId,
                xpPoints: rewards.xpPoints,
                xpCoins: rewards.xpCoins,
            });
        }

        return { progress, rewards };
    }
}
