import type { Prisma } from "@/generated/prisma/client";

export type QuizOptionWithQuestion = Prisma.QuizOptionGetPayload<{
    include: { question: true };
}>;

export interface IQuizOptionRepository {
    findManyWithQuestionByIds(optionIds: string[]): Promise<QuizOptionWithQuestion[]>;
}
