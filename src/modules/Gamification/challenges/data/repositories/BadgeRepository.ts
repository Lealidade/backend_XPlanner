import { prisma } from "@/database/prismaClient";
import type { Badge } from "@/generated/prisma/client";
import type { IBadgeRepository } from "../interfaces/IBadgeRepository";

export class BadgeRepository implements IBadgeRepository {
    async findById(id: string): Promise<Badge | null> {
        return prisma.badge.findUnique({
            where: { id },
        });
    }

    async listAll(): Promise<Badge[]> {
        return prisma.badge.findMany();
    }
}
