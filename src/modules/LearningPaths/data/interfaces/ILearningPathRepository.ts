import type { Prisma } from "@/generated/prisma/client";

export type LearningPathWithSteps = Prisma.LearningPathGetPayload<{
    include: { steps: true };
}>;

export interface ILearningPathRepository {
    findAllActiveWithSteps(): Promise<LearningPathWithSteps[]>;
    findByIdWithSteps(id: string): Promise<LearningPathWithSteps | null>;
}
