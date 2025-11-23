// src/modules/Gamification/services/UserXPGamification.service.ts
import { injectable } from "tsyringe";
import { prisma } from "@/database/prismaClient";
import type { UserXP } from "@/generated/prisma/client";

type LevelInfo = {
    level: string;
    xpToNextLevel: number;
};

@injectable()
export class UserXPGamificationService {
    // regra simples de níveis
    private getLevelInfo(totalXp: number): LevelInfo {
        if (totalXp >= 1000) {
            return { level: "XP Master", xpToNextLevel: 0 };
        }
        if (totalXp >= 600) {
            return { level: "Investing Ninja", xpToNextLevel: 1000 - totalXp };
        }
        if (totalXp >= 300) {
            return { level: "Savings Pro", xpToNextLevel: 600 - totalXp };
        }
        if (totalXp >= 100) {
            return { level: "Budget Explorer", xpToNextLevel: 300 - totalXp };
        }

        // default / início
        return { level: "Money Rookie", xpToNextLevel: 100 - totalXp };
    }

    /**
     * Soma XP e coins ao UserXP e recalcula nível/xpToNextLevel
     */
    public async addXpAndCoins(params: {
        userXPId: string;
        xpPoints: number;
        xpCoins?: number;
    }): Promise<UserXP> {
        const { userXPId, xpPoints, xpCoins = 0 } = params;

        const userXP = await prisma.userXP.findUnique({
            where: { id: userXPId },
        });

        if (!userXP) {
            throw new Error("USER_XP_NOT_FOUND");
        }

        const safeXp = Math.max(0, xpPoints);
        const safeCoins = Math.max(0, xpCoins);

        const newTotalXp = userXP.totalXp + safeXp;
        const newCoinsBalance = userXP.xpCoinsBalance + safeCoins;

        const { level, xpToNextLevel } = this.getLevelInfo(newTotalXp);

        return prisma.userXP.update({
            where: { id: userXPId },
            data: {
                totalXp: newTotalXp,
                xpCoinsBalance: newCoinsBalance,
                currentLevel: level,
                xpToNextLevel,
            },
        });
    }
}
