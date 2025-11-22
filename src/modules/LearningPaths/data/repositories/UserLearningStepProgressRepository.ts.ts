// import { prisma } from "@/database/prismaClient";
// import {
//     IUserLearningStepProgressRepository,
// } from "../interfaces/IUserLearningStepProgressRepository";

// export class UserLearningStepProgressRepository
//     implements IUserLearningStepProgressRepository {
//     async markAsCompleted(userXPId: string, stepId: string) {
//         const now = new Date();

//         return prisma.userLearningStepProgress.upsert({
//             where: {
//                 userXPId_learningStepId: {
//                     userXPId,
//                     learningStepId: stepId,
//                 },
//             },
//             update: { completedAt: now },
//             create: {
//                 userXPId,
//                 learningStepId: stepId,
//                 completedAt: now,
//             },
//         });
//     }

//     async findCompletedStepIdsByUserAndPath(
//         userXPId: string,
//         learningPathId: string,
//     ): Promise<string[]> {
//         const rows = await prisma.userLearningStepProgress.findMany({
//             where: {
//                 userXPId,
//                 learningStep: {
//                     learningPathId,
//                 },
//             },
//             select: { learningStepId: true },
//         });

//         return rows.map((r) => r.learningStepId);
//     }
// }

// import { prisma } from "@/database/prismaClient";
// import type { UserLearningStepProgress } from "@/generated/prisma/client";
// import {
//     IUserLearningStepProgressRepository,
// } from "../interfaces/IUserLearningStepProgressRepository";

// export class UserLearningStepProgressRepository
//     implements IUserLearningStepProgressRepository {

//     async markAsCompleted(
//         userXPId: string,
//         stepId: string,
//     ): Promise<UserLearningStepProgress> {
//         const now = new Date();

//         return prisma.userLearningStepProgress.upsert({
//             where: {
//                 userXPId_learningStepId: {
//                     userXPId,
//                     learningStepId: stepId,
//                 },
//             },
//             update: { completedAt: now },
//             create: {
//                 userXPId,
//                 learningStepId: stepId,
//                 completedAt: now,
//             },
//         });
//     }

//     async findCompletedStepIdsByUserAndPath(
//         userXPId: string,
//         learningPathId: string,
//     ): Promise<string[]> {
//         const rows = await prisma.userLearningStepProgress.findMany({
//             where: {
//                 userXPId,
//                 learningStep: {
//                     learningPathId,
//                 },
//             },
//             select: { learningStepId: true },
//         });

//         return rows.map((r) => r.learningStepId);
//     }

//     // 👇 NOVO – usado na Gamification Overview para contar total de passos concluídos
//     async listByUserXP(userXPId: string): Promise<UserLearningStepProgress[]> {
//         return prisma.userLearningStepProgress.findMany({
//             where: { userXPId },
//         });
//     }
// }

import { prisma } from "@/database/prismaClient";
import type { UserLearningStepProgress } from "@/generated/prisma/client";
import {
    IUserLearningStepProgressRepository,
} from "../interfaces/IUserLearningStepProgressRepository";

export class UserLearningStepProgressRepository
    implements IUserLearningStepProgressRepository {

    async markAsCompleted(userXPId: string, stepId: string) {
        const now = new Date();

        return prisma.userLearningStepProgress.upsert({
            where: {
                userXPId_learningStepId: {
                    userXPId,
                    learningStepId: stepId,
                },
            },
            update: { completedAt: now },
            create: {
                userXPId,
                learningStepId: stepId,
                completedAt: now,
            },
        });
    }

    async findCompletedStepIdsByUserAndPath(
        userXPId: string,
        learningPathId: string,
    ): Promise<string[]> {
        const rows = await prisma.userLearningStepProgress.findMany({
            where: {
                userXPId,
                learningStep: {
                    learningPathId,
                },
            },
            select: { learningStepId: true },
        });

        return rows.map((r) => r.learningStepId);
    }

    async listByUserXP(userXPId: string): Promise<UserLearningStepProgress[]> {
        return prisma.userLearningStepProgress.findMany({
            where: { userXPId },
        });
    }
}
