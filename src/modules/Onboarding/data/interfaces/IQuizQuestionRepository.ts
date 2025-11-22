// import type { Prisma } from "@/generated/prisma/client";

// export type QuizQuestionWithOptions = Prisma.QuizQuestionGetPayload<{
//     include: { options: true };
// }>;

// export interface IQuizQuestionRepository {
//     findActiveWithOptions(): Promise<QuizQuestionWithOptions[]>;
// }

// src/modules/Onboarding/data/interfaces/IQuizQuestionRepository.ts
import type { Prisma } from "@/generated/prisma/client";

export type QuizQuestionWithOptions = Prisma.QuizQuestionGetPayload<{
    include: { options: true };
}>;

export interface IQuizQuestionRepository {
    findActiveWithOptions(): Promise<QuizQuestionWithOptions[]>;
}
