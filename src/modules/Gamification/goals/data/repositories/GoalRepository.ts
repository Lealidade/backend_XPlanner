import { prisma } from "@/database/prismaClient";
import type { Goal } from "@/generated/prisma/client";
import type { IGoalRepository } from "../interfaces/IGoalRepository";

export class GoalRepository implements IGoalRepository {
    async listAll(): Promise<Goal[]> {
        return prisma.goal.findMany();
    }

    async findById(id: string): Promise<Goal | null> {
        return prisma.goal.findUnique({ where: { id } });
    }
}
