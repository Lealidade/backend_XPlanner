// import { prisma } from "@/database/prismaClient";
// import type { UserGoal } from "@/generated/prisma/client";
// import type { CreateUserGoalDTO, IUserGoalRepository } from "../interfaces/IUserGoalRepository";

// export class UserGoalRepository implements IUserGoalRepository {
//     async listByUserXPId(userXPId: string): Promise<UserGoal[]> {
//         return prisma.userGoal.findMany({
//             where: { userXPId },
//             orderBy: { createdAt: "desc" },
//             include: { goal: true },
//         });
//     }

//     async findByIdAndUserXPId(
//         id: string,
//         userXPId: string,
//     ): Promise<UserGoal | null> {
//         return prisma.userGoal.findFirst({
//             where: { id, userXPId },
//             include: { goal: true },
//         });
//     }

//     // async create(params: {
//     //     userXPId: string;
//     //     goalId?: string;
//     //     customTitle: string;
//     //     targetAmount: number;
//     //     targetDate: Date;
//     //     recommendedMonthlyDeposit: number;
//     //     xpCoinsRewardOnCompletion?: number;
//     // }): Promise<UserGoal> {
//     //     const {
//     //         userXPId,
//     //         goalId,
//     //         customTitle,
//     //         targetAmount,
//     //         targetDate,
//     //         recommendedMonthlyDeposit,
//     //         xpCoinsRewardOnCompletion = 0,
//     //     } = params;

//     //     return prisma.userGoal.create({
//     //         data: {
//     //             userXPId,
//     //             goalId: goalId ?? null,
//     //             customTitle,
//     //             targetAmount,
//     //             currentAmount: 0,
//     //             targetDate,
//     //             recommendedMonthlyDeposit,
//     //             progressPercent: 0,
//     //             xpCoinsRewardOnCompletion,
//     //         },
//     //         include: { goal: true },
//     //     });
//     // }

//     async create(data: CreateUserGoalDTO): Promise<UserGoal> {
//         return prisma.userGoal.create({
//             data: {
//                 userXPId: data.userXPId,
//                 goalId: data.goalId ?? null,
//                 customTitle: data.customTitle,
//                 targetAmount: data.targetAmount,
//                 currentAmount: data.currentAmount,
//                 targetDate: data.targetDate ?? null,
//                 recommendedMonthlyDeposit: data.recommendedMonthlyDeposit ?? null,
//                 progressPercent: data.progressPercent,
//                 isActive: data.isActive,
//             },
//         });
//     }

//     async updateProgress(params: {
//         id: string;
//         userXPId: string;
//         currentAmount: number;
//         progressPercent: number;
//         isCompleted: boolean;
//         completedAt?: Date | null;
//     }): Promise<UserGoal> {
//         const { id, userXPId, currentAmount, progressPercent, isCompleted, completedAt } = params;

//         return prisma.userGoal.update({
//             where: { id },
//             data: {
//                 userXPId,
//                 currentAmount,
//                 progressPercent,
//                 isActive: !isCompleted,
//                 completedAt: isCompleted ? (completedAt ?? new Date()) : null,
//             },
//             include: { goal: true },
//         });
//     }
// }

// src/modules/Gamification/goals/data/repositories/UserGoalRepository.ts
// import { prisma } from "@/database/prismaClient";
// import type { UserGoal } from "@/generated/prisma/client";
// import type {
//     CreateUserGoalDTO,
//     IUserGoalRepository,
// } from "../interfaces/IUserGoalRepository";

// export class UserGoalRepository implements IUserGoalRepository {
//     async listByUserXPId(userXPId: string): Promise<UserGoal[]> {
//         return prisma.userGoal.findMany({
//             where: { userXPId },
//             orderBy: { createdAt: "desc" },
//             include: { goal: true },
//         });
//     }

//     async findByIdAndUserXPId(
//         id: string,
//         userXPId: string,
//     ): Promise<UserGoal | null> {
//         return prisma.userGoal.findFirst({
//             where: { id, userXPId },
//             include: { goal: true },
//         });
//     }

//     // async create(data: CreateUserGoalDTO): Promise<UserGoal> {
//     //     return prisma.userGoal.create({
//     //         data: {
//     //             userXPId: data.userXPId,
//     //             goalId: data.goalId ?? null,
//     //             customTitle: data.customTitle,
//     //             targetAmount: data.targetAmount,
//     //             currentAmount: data.currentAmount,
//     //             targetDate: data.targetDate ?? null,
//     //             // 👇 aqui o ajuste do erro de tipo
//     //             recommendedMonthlyDeposit: data.recommendedMonthlyDeposit ?? 0,
//     //             progressPercent: data.progressPercent,
//     //             isActive: data.isActive,
//     //         },
//     //         include: { goal: true },
//     //     });
//     // }

//     // async create(data: CreateUserGoalDTO): Promise<UserGoal> {
//     //     return prisma.userGoal.create({
//     //         data: {
//     //             userXPId: data.userXPId,
//     //             goalId: data.goalId ?? null,
//     //             customTitle: data.customTitle,
//     //             targetAmount: data.targetAmount,
//     //             currentAmount: data.currentAmount,
//     //             targetDate: data.targetDate, // <- direto
//     //             recommendedMonthlyDeposit: data.recommendedMonthlyDeposit,
//     //             progressPercent: data.progressPercent,
//     //             isActive: data.isActive,
//     //         },
//     //         include: { goal: true },
//     //     });
//     // }

//     async create(data: CreateUserGoalDTO): Promise<UserGoal> {
//         return prisma.userGoal.create({
//             data: {
//                 userXPId: data.userXPId,
//                 goalId: data.goalId ?? null,
//                 customTitle: data.customTitle,
//                 targetAmount: data.targetAmount,
//                 currentAmount: data.currentAmount,
//                 targetDate: data.targetDate, // <- sem "?? null"
//                 recommendedMonthlyDeposit: data.recommendedMonthlyDeposit, // <- já é number
//                 progressPercent: data.progressPercent,
//                 isActive: data.isActive,
//             },
//             include: { goal: true },
//         });
//     }

//     async updateProgress(params: {
//         id: string;
//         userXPId: string;
//         currentAmount: number;
//         progressPercent: number;
//         isCompleted: boolean;
//         completedAt?: Date | null;
//     }): Promise<UserGoal> {
//         const {
//             id,
//             userXPId,
//             currentAmount,
//             progressPercent,
//             isCompleted,
//             completedAt,
//         } = params;

//         return prisma.userGoal.update({
//             where: { id },
//             data: {
//                 userXPId,
//                 currentAmount,
//                 progressPercent,
//                 isActive: !isCompleted,
//                 completedAt: isCompleted
//                     ? completedAt ?? new Date()
//                     : null,
//             },
//             include: { goal: true },
//         });
//     }
// }

import { prisma } from "@/database/prismaClient";

import type {
    CreateUserGoalDTO,
    IUserGoalRepository,
    UserGoalWithTemplate,
} from "../interfaces/IUserGoalRepository";



export class UserGoalRepository implements IUserGoalRepository {
    async listByUserXPId(userXPId: string): Promise<UserGoalWithTemplate[]> {
        return prisma.userGoal.findMany({
            where: { userXPId },
            orderBy: { createdAt: "desc" },
            include: { goal: true },
        });
    }

    async findByIdAndUserXPId(
        id: string,
        userXPId: string,
    ): Promise<UserGoalWithTemplate | null> {
        return prisma.userGoal.findFirst({
            where: { id, userXPId },
            include: { goal: true },
        });
    }

    async create(data: CreateUserGoalDTO): Promise<UserGoalWithTemplate> {
        return prisma.userGoal.create({
            data: {
                userXPId: data.userXPId,
                goalId: data.goalId ?? null,
                customTitle: data.customTitle,
                targetAmount: data.targetAmount,
                currentAmount: data.currentAmount,
                targetDate: data.targetDate,
                recommendedMonthlyDeposit: data.recommendedMonthlyDeposit,
                progressPercent: data.progressPercent,
                isActive: data.isActive,
            },
            include: { goal: true },
        });
    }

    async updateProgress(params: {
        id: string;
        userXPId: string;
        currentAmount: number;
        progressPercent: number;
        isCompleted: boolean;
        completedAt?: Date | null;
    }): Promise<UserGoalWithTemplate> {
        const { id, userXPId, currentAmount, progressPercent, isCompleted, completedAt } = params;

        return prisma.userGoal.update({
            where: { id },
            data: {
                userXPId,
                currentAmount,
                progressPercent,
                isActive: !isCompleted,
                completedAt: isCompleted ? (completedAt ?? new Date()) : null,
            },
            include: { goal: true },
        });
    }
}