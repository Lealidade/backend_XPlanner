import { prisma } from "@/database/prismaClient";
import {
    ILearningPathRepository,
    LearningPathWithSteps,
} from "../interfaces/ILearningPathRepository";

export class LearningPathRepository implements ILearningPathRepository {
    async findAllActiveWithSteps(): Promise<LearningPathWithSteps[]> {
        return prisma.learningPath.findMany({
            where: { isActive: true },
            orderBy: [{ order: "asc" }, { title: "asc" }],
            include: {
                steps: {
                    orderBy: { order: "asc" },
                },
            },
        });
    }

    async findByIdWithSteps(id: string): Promise<LearningPathWithSteps | null> {
        return prisma.learningPath.findUnique({
            where: { id },
            include: {
                steps: {
                    orderBy: { order: "asc" },
                },
            },
        });
    }
}
