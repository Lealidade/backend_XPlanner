import { prisma } from "@/database/prismaClient";
import {
    IQuizQuestionRepository,
    QuizQuestionWithOptions,
} from "../interfaces/IQuizQuestionRepository";

export class QuizQuestionRepository implements IQuizQuestionRepository {
    async findActiveWithOptions(): Promise<QuizQuestionWithOptions[]> {
        return prisma.quizQuestion.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: {
                options: {
                    orderBy: { label: "asc" },
                },
            },
        });
    }
}
