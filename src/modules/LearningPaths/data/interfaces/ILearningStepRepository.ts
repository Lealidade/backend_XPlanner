import type { Prisma } from "@/generated/prisma/client";

export type LearningStepWithPathAndSteps = Prisma.LearningStepGetPayload<{
    include: { learningPath: { include: { steps: true } } };
}>;

export interface ILearningStepRepository {
    findByIdWithPathAndSteps(
        id: string,
    ): Promise<LearningStepWithPathAndSteps | null>;
}
