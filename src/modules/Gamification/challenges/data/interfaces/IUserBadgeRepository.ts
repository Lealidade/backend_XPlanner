import type { UserBadge } from "@/generated/prisma/client";

export interface IUserBadgeRepository {
    findByUserXPAndBadge(
        userXPId: string,
        badgeId: string,
    ): Promise<UserBadge | null>;

    create(
        userXPId: string,
        badgeId: string,
        awardedAt?: Date,
    ): Promise<UserBadge>;
}
