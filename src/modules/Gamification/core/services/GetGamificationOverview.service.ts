import { inject, injectable } from "tsyringe";
import { prisma } from "@/database/prismaClient";
import type { UserXP } from "@/generated/prisma/client";

import type { IUserGoalRepository } from "@/modules/Gamification/goals/data/interfaces/IUserGoalRepository";
import type { IUserLearningStepProgressRepository } from "@/modules/LearningPaths/data/interfaces/IUserLearningStepProgressRepository";

import type { GamificationOverviewDTO } from "../data/dtos/GamificationOverviewDTO";

interface IRequest {
    userXPId: string;
}

@injectable()
export class GetGamificationOverviewService {
    constructor(
        @inject("UserGoalRepository")
        private userGoalRepository: IUserGoalRepository,

        @inject("UserLearningStepProgressRepository")
        private userLearningStepProgressRepository: IUserLearningStepProgressRepository,
    ) { }

    /**
     * Regra simples de level baseada em XP..
     */
    private calculateLevelFromXp(xpPoints: number): number {
        if (xpPoints <= 0) return 1;

        // Exemplo: 0–99 => lvl 1, 100–199 => lvl 2, ...
        return Math.floor(xpPoints / 100) + 1;
    }

    public async execute({ userXPId }: IRequest): Promise<GamificationOverviewDTO> {
        const userXP = await prisma.userXP.findUnique({
            where: { id: userXPId },
        });

        if (!userXP) {
            throw new Error("USER_XP_NOT_FOUND");
        }

        const [userGoals, stepsProgress] = await Promise.all([
            this.userGoalRepository.listByUserXPId(userXPId),
            this.userLearningStepProgressRepository.listByUserXP(userXPId),
        ]);

        const activeGoals = userGoals.filter((g) => g.isActive).length;
        const completedGoals = userGoals.filter((g) => !!g.completedAt).length;

        const totalCompletedSteps = stepsProgress.filter(
            (s) => !!s.completedAt,
        ).length;

        const typedUserXP = userXP as UserXP;

        const xpPoints = (typedUserXP as any).xpPoints ?? 0;
        const xpCoins = (typedUserXP as any).xpCoins ?? 0;

        const level = this.calculateLevelFromXp(xpPoints);

        const overview: GamificationOverviewDTO = {
            userXP: {
                xpPoints,
                xpCoins,
                level,
            },
            goals: {
                activeGoals,
                completedGoals,
            },
            learning: {
                totalCompletedSteps,
            },
        };

        return overview;
    }
}
