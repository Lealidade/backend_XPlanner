import type { UserGoal, Goal } from "@/generated/prisma/client";

export type UserGoalWithTemplate = UserGoal & { goal: Goal | null };

export interface CreateUserGoalDTO {
    userXPId: string;
    goalId?: string | null;
    customTitle: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date;              // opção A: obrigatório
    recommendedMonthlyDeposit: number;
    progressPercent: number;
    isActive: boolean;
}

export interface IUserGoalRepository {
    listByUserXPId(userXPId: string): Promise<UserGoalWithTemplate[]>;
    findByIdAndUserXPId(
        id: string,
        userXPId: string,
    ): Promise<UserGoalWithTemplate | null>;

    create(data: CreateUserGoalDTO): Promise<UserGoalWithTemplate>;

    updateProgress(params: {
        id: string;
        userXPId: string;
        currentAmount: number;
        progressPercent: number;
        isCompleted: boolean;
        completedAt?: Date | null;
    }): Promise<UserGoalWithTemplate>;
}
