import { prisma } from "@/database/prismaClient";
import {
    IQuizOptionRepository,
    QuizOptionWithQuestion,
} from "../interfaces/IQuizOptionRepository";

export class QuizOptionRepository implements IQuizOptionRepository {
    async findManyWithQuestionByIds(
        optionIds: string[],
    ): Promise<QuizOptionWithQuestion[]> {
        if (optionIds.length === 0) return [];

        return prisma.quizOption.findMany({
            where: {
                id: { in: optionIds },
            },
            include: {
                question: true,
            },
        });
    }
}
