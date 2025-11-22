import type { Goal } from "@/generated/prisma/client";

export interface IGoalRepository {
    listAll(): Promise<Goal[]>;
    findById(id: string): Promise<Goal | null>;
}
