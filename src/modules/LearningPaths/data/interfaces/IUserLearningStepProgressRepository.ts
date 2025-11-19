import type { UserLearningStepProgress } from "@/generated/prisma/client";

export interface IUserLearningStepProgressRepository {
    markAsCompleted(userXPId: string, stepId: string): Promise<UserLearningStepProgress>;
    findCompletedStepIdsByUserAndPath(
        userXPId: string,
        learningPathId: string,
    ): Promise<string[]>;
}
