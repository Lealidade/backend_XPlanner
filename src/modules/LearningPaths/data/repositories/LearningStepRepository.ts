import { prisma } from "@/database/prismaClient";
import {
    ILearningStepRepository,
    LearningStepWithPathAndSteps,
} from "../interfaces/ILearningStepRepository";

export class LearningStepRepository implements ILearningStepRepository {
    async findByIdWithPathAndSteps(
        id: string,
    ): Promise<LearningStepWithPathAndSteps | null> {
        return prisma.learningStep.findUnique({
            where: { id },
            include: {
                learningPath: {
                    include: { steps: true },
                },
            },
        });
    }
}
