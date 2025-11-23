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