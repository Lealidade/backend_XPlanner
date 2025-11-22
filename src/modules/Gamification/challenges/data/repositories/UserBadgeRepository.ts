import { prisma } from "@/database/prismaClient";
import type { UserBadge } from "@/generated/prisma/client";
import type { IUserBadgeRepository } from "../interfaces/IUserBadgeRepository";

export class UserBadgeRepository implements IUserBadgeRepository {
    async findByUserXPAndBadge(
        userXPId: string,
        badgeId: string,
    ): Promise<UserBadge | null> {
        return prisma.userBadge.findFirst({
            where: { userXPId, badgeId },
        });
    }

    async create(
        userXPId: string,
        badgeId: string,
        awardedAt: Date = new Date(),
    ): Promise<UserBadge> {
        return prisma.userBadge.create({
            data: {
                userXPId,
                badgeId,
                awardedAt,
            },
        });
    }
}
