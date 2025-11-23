import type { UserChallengeProgress } from "@/generated/prisma/client";

export interface CreateUserChallengeProgressInput {
    userXPId: string;
    challengeId: string;
    startDate: Date;
    endDate: Date;
    currentProgress: number;
    isCompleted: boolean;
    completedAt?: Date | null;
}

export interface UpdateUserChallengeProgressInput {
    currentProgress?: number;
    isCompleted?: boolean;
    endDate?: Date;          // opcional
    completedAt?: Date | null;
}

export interface IUserChallengeProgressRepository {
    findByUserXPAndChallenge(
        userXPId: string,
        challengeId: string,
    ): Promise<UserChallengeProgress | null>;

    listByUserXP(userXPId: string): Promise<UserChallengeProgress[]>;

    create(
        data: CreateUserChallengeProgressInput,
    ): Promise<UserChallengeProgress>;

    update(
        id: string,
        data: UpdateUserChallengeProgressInput,
    ): Promise<UserChallengeProgress>;
}
