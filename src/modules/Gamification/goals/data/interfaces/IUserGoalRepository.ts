// // import type { UserGoal } from "@/generated/prisma/client";

// export interface IUserGoalRepository {
//     listByUserXPId(userXPId: string): Promise<UserGoal[]>;
//     findByIdAndUserXPId(id: string, userXPId: string): Promise<UserGoal | null>;

//     create(params: {
//         userXPId: string;
//         goalId?: string;
//         customTitle: string;
//         targetAmount: number;
//         targetDate: Date;
//         recommendedMonthlyDeposit: number;
//         xpCoinsRewardOnCompletion?: number;
//     }): Promise<UserGoal>;

//     updateProgress(params: {
//         id: string;
//         userXPId: string;
//         currentAmount: number;
//         progressPercent: number;
//         isCompleted: boolean;
//         completedAt?: Date | null;
//     }): Promise<UserGoal>;
// }

// import type { UserGoal } from "@/generated/prisma/client";

// export interface CreateUserGoalDTO {
//     userXPId: string;
//     goalId?: string | null;
//     customTitle: string;
//     targetAmount: number;
//     currentAmount: number;
//     targetDate?: Date | null;
//     recommendedMonthlyDeposit?: number | null;
//     progressPercent: number;
//     isActive: boolean;
// }

// export interface IUserGoalRepository {
//     create(data: CreateUserGoalDTO): Promise<UserGoal>;
// }

// import type { UserGoal } from "@/generated/prisma/client";

// export interface CreateUserGoalDTO {
//     userXPId: string;
//     goalId?: string | null;
//     customTitle: string;
//     targetAmount: number;
//     currentAmount: number;
//     targetDate: Date | null;
//     recommendedMonthlyDeposit?: number | null; // pode ser undefined/null no DTO
//     progressPercent: number;
//     isActive: boolean;
// }

// export interface CreateUserGoalDTO {
//     userXPId: string;
//     goalId?: string | null;
//     customTitle: string;
//     targetAmount: number;
//     currentAmount: number;
//     targetDate: Date;                  // <- sem null
//     recommendedMonthlyDeposit: number; // <- sem ?, sem null
//     progressPercent: number;
//     isActive: boolean;
// }

// export interface CreateUserGoalDTO {
//     userXPId: string;
//     goalId?: string | null;
//     customTitle: string;
//     targetAmount: number;
//     currentAmount: number;
//     targetDate: Date;                  // <- obrigatório, sem null
//     recommendedMonthlyDeposit: number; // <- obrigatório, sem null
//     progressPercent: number;
//     isActive: boolean;
// }


// export interface IUserGoalRepository {
//     listByUserXPId(userXPId: string): Promise<UserGoal[]>;
//     findByIdAndUserXPId(id: string, userXPId: string): Promise<UserGoal | null>;
//     create(data: CreateUserGoalDTO): Promise<UserGoal>;
//     updateProgress(params: {
//         id: string;
//         userXPId: string;
//         currentAmount: number;
//         progressPercent: number;
//         isCompleted: boolean;
//         completedAt?: Date | null;
//     }): Promise<UserGoal>;
// }

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
