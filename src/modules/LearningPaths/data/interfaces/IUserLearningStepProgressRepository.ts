// import type { UserLearningStepProgress } from "@/generated/prisma/client";

// export interface IUserLearningStepProgressRepository {
//     markAsCompleted(userXPId: string, stepId: string): Promise<UserLearningStepProgress>;
//     findCompletedStepIdsByUserAndPath(
//         userXPId: string,
//         learningPathId: string,
//     ): Promise<string[]>;
// }

// import type { UserLearningStepProgress } from "@/generated/prisma/client";

// export interface IUserLearningStepProgressRepository {
//     // já existia
//     markAsCompleted(
//         userXPId: string,
//         stepId: string,
//     ): Promise<UserLearningStepProgress>;

//     // já existia
//     findCompletedStepIdsByUserAndPath(
//         userXPId: string,
//         learningPathId: string,
//     ): Promise<string[]>;

//     // 👇 NOVO – usado na Gamification Overview
//     listByUserXP(userXPId: string): Promise<UserLearningStepProgress[]>;
// }

import type { UserLearningStepProgress } from "@/generated/prisma/client";

export interface IUserLearningStepProgressRepository {
    markAsCompleted(userXPId: string, stepId: string): Promise<UserLearningStepProgress>;

    findCompletedStepIdsByUserAndPath(
        userXPId: string,
        learningPathId: string,
    ): Promise<string[]>;

    /** Lista todos os passos concluídos (ou não) de qualquer trilha para esse UserXP */
    listByUserXP(userXPId: string): Promise<UserLearningStepProgress[]>;
}
