import { inject, injectable } from "tsyringe";
import type { IUserGoalRepository } from "../data/interfaces/IUserGoalRepository";
import { UserXPGamificationService } from "../../core/services/UserXPGamification.service";

interface IRequest {
    userXPId: string;
    userGoalId: string;
    currentAmount: number;
}

import type { UserGoalWithTemplate } from "../data/interfaces/IUserGoalRepository";

@injectable()
export class UpdateUserGoalProgressService {
    constructor(
        @inject("UserGoalRepository")
        private userGoalRepository: IUserGoalRepository,

        @inject("UserXPGamificationService")
        private userXPGamification: UserXPGamificationService,
    ) { }

    public async execute({
        userXPId,
        userGoalId,
        currentAmount,
    }: IRequest): Promise<UserGoalWithTemplate> {
        const userGoal = await this.userGoalRepository.findByIdAndUserXPId(
            userGoalId,
            userXPId,
        );

        if (!userGoal) {
            throw new Error("USER_GOAL_NOT_FOUND");
        }

        const clampedAmount = Math.max(0, currentAmount);

        const progressPercent =
            userGoal.targetAmount > 0
                ? Math.min(
                    100,
                    Math.round((clampedAmount / userGoal.targetAmount) * 100),
                )
                : 0;

        const isCompleted = progressPercent >= 100;

        const updated = await this.userGoalRepository.updateProgress({
            id: userGoal.id,
            userXPId,
            currentAmount: clampedAmount,
            progressPercent,
            isCompleted,
            completedAt: isCompleted ? new Date() : null,
        });

        const wasAlreadyCompleted = !!userGoal.completedAt;

        if (isCompleted && !wasAlreadyCompleted) {
            const xpFromTemplate = updated.goal?.xpPointsRewardOnCompletion ?? 0;
            const coinsFromTemplate = updated.goal?.xpCoinsRewardOnCompletion ?? 0;
            const coinsFromUserGoal = updated.xpCoinsRewardOnCompletion ?? 0;

            const totalCoins = coinsFromTemplate + coinsFromUserGoal;

            await this.userXPGamification.addXpAndCoins({
                userXPId,
                xpPoints: xpFromTemplate,
                xpCoins: totalCoins,
            });
        }

        return updated;
    }
}
