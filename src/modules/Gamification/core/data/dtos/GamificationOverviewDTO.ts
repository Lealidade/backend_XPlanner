// src/modules/Gamification/core/data/dtos/GamificationOverviewDTO.ts

export interface GamificationOverviewDTO {
    userXP: {
        xpPoints: number;
        xpCoins: number;
        level: number;
    };

    goals: {
        activeGoals: number;
        completedGoals: number;
    };

    learning: {
        totalCompletedSteps: number;
    };
}
