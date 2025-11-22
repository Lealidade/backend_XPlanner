// src/modules/Gamification/services/ApplyGamificationReward.service.ts
import { injectable } from "tsyringe";
import type { UserXP } from "@/generated/prisma/client";
import { prisma } from "@/database/prismaClient";

interface IApplyGamificationRewardRequest {
    userXPId: string;
    xpPointsDelta?: number;   // quanto de XP vamos adicionar (pode ser negativo)
    xpCoinsDelta?: number;    // quanto de “coins” vamos adicionar (pode ser negativo)
    incrementStreak?: boolean; // se true, incrementa o dayStreak em 1 (bem simplificado)
}

interface LevelInfo {
    level: string;
    xpToNextLevel: number; // quanto falta pra chegar no próximo nível
}

@injectable()
export class ApplyGamificationRewardService {
    /**
     * Regrinha simples de nível:
     *  - 0   –  499  => Money Rookie
     *  - 500 – 1499 => Money Explorer
     *  - 1500– 2999 => Money Master
     *  - 3000+      => Money Legend
     */
    private calculateLevel(totalXp: number): LevelInfo {
        if (totalXp < 500) {
            return {
                level: "Money Rookie",
                xpToNextLevel: 500 - totalXp,
            };
        }

        if (totalXp < 1500) {
            return {
                level: "Money Explorer",
                xpToNextLevel: 1500 - totalXp,
            };
        }

        if (totalXp < 3000) {
            return {
                level: "Money Master",
                xpToNextLevel: 3000 - totalXp,
            };
        }

        // último nível (pode deixar 0 para "maxado")
        return {
            level: "Money Legend",
            xpToNextLevel: 0,
        };
    }

    public async execute({
        userXPId,
        xpPointsDelta = 0,
        xpCoinsDelta = 0,
        incrementStreak = false,
    }: IApplyGamificationRewardRequest): Promise<UserXP> {
        const userXP = await prisma.userXP.findUnique({
            where: { id: userXPId },
        });

        if (!userXP) {
            throw new Error("USERXP_NOT_FOUND");
        }

        // Garante que não fica negativo
        const newTotalXp = Math.max(0, userXP.totalXp + xpPointsDelta);
        const newCoins = Math.max(0, userXP.xpCoinsBalance + xpCoinsDelta);

        const newStreak = incrementStreak
            ? userXP.dayStreak + 1
            : userXP.dayStreak;

        const { level, xpToNextLevel } = this.calculateLevel(newTotalXp);

        const updatedUserXP = await prisma.userXP.update({
            where: { id: userXPId },
            data: {
                totalXp: newTotalXp,
                xpCoinsBalance: newCoins,
                dayStreak: newStreak,
                currentLevel: level,
                xpToNextLevel,
            },
        });

        return updatedUserXP;
    }
}
