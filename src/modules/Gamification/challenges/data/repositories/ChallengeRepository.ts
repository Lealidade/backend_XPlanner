import { prisma } from "@/database/prismaClient";
import type { Challenge } from "@/generated/prisma/client";
import type { IChallengeRepository } from "../interfaces/IChallengeRepository";

export class ChallengeRepository implements IChallengeRepository {
    async findAll(): Promise<Challenge[]> {
        return prisma.challenge.findMany({
            orderBy: { title: "asc" },
        });
    }

    async findById(id: string): Promise<Challenge | null> {
        return prisma.challenge.findUnique({
            where: { id },
        });
    }
}
