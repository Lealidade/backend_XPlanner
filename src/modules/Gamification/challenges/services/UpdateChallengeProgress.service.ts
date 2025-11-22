import { inject, injectable } from "tsyringe";
import type { UserChallengeProgress, Badge } from "@/generated/prisma/client";

import type { IChallengeRepository } from "../data/interfaces/IChallengeRepository";
import type {
    IUserChallengeProgressRepository,
} from "../data/interfaces/IUserChallengeProgressRepository";
import type { IBadgeRepository } from "../data/interfaces/IBadgeRepository";
import type { IUserBadgeRepository } from "../data/interfaces/IUserBadgeRepository";
import { UserXPGamificationService } from "@/modules/Gamification/core/services/UserXPGamification.service";

interface IRequest {
    userXPId: string;
    challengeId: string;
    currentProgress: number;
    isCompleted?: boolean;
}

interface IResponse {
    progress: UserChallengeProgress;
    rewards?: {
        xpPoints: number;
        xpCoins: number;
    };
    badgeAwarded?: Badge | null;
}

@injectable()
export class UpdateChallengeProgressService {
    constructor(
        @inject("ChallengeRepository")
        private challengeRepository: IChallengeRepository,

        @inject("UserChallengeProgressRepository")
        private progressRepository: IUserChallengeProgressRepository,

        @inject("BadgeRepository")
        private badgeRepository: IBadgeRepository,

        @inject("UserBadgeRepository")
        private userBadgeRepository: IUserBadgeRepository,

        @inject("UserXPGamificationService")
        private userXPGamification: UserXPGamificationService,
    ) { }

    public async execute({
        userXPId,
        challengeId,
        currentProgress,
        isCompleted,
    }: IRequest): Promise<IResponse> {
        const challenge = await this.challengeRepository.findById(challengeId);
        if (!challenge) {
            throw new Error("CHALLENGE_NOT_FOUND");
        }

        let progress = await this.progressRepository.findByUserXPAndChallenge(
            userXPId,
            challengeId,
        );

        const now = new Date();

        // // se ainda não existe progresso, cria
        // if (!progress) {
        //     const endDate =
        //         challenge.durationDays > 0
        //             ? new Date(
        //                 now.getTime() + challenge.durationDays * 24 * 60 * 60 * 1000,
        //             )
        //             : undefined;

        //     progress = await this.progressRepository.create({
        //         userXPId,
        //         challengeId,
        //         startDate: now,
        //         endDate,
        //         currentProgress,
        //         isCompleted: false,
        //         completedAt: null,
        //     });
        // }

        // se ainda não existe progresso, cria
        if (!progress) {
            const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

            // sempre gera uma Date, mesmo se durationDays for 0
            const endDate: Date = new Date(
                now.getTime() + challenge.durationDays * MILLISECONDS_PER_DAY,
            );

            progress = await this.progressRepository.create({
                userXPId,
                challengeId,
                startDate: now,
                endDate,              // agora é só Date, sem undefined
                currentProgress,
                isCompleted: false,
                completedAt: null,
            });
        }

        const wasCompletedBefore = progress.isCompleted;

        // se não vier explicitamente, decide pelo currentProgress x durationDays
        let finalIsCompleted =
            typeof isCompleted === "boolean" ? isCompleted : wasCompletedBefore;

        if (!finalIsCompleted && challenge.durationDays > 0) {
            if (currentProgress >= challenge.durationDays) {
                finalIsCompleted = true;
            }
        }

        let completedAt: Date | null = progress.completedAt;
        if (finalIsCompleted && !wasCompletedBefore) {
            completedAt = now;
        }
        if (!finalIsCompleted) {
            completedAt = null;
        }

        const updated = await this.progressRepository.update(progress.id, {
            currentProgress,
            isCompleted: finalIsCompleted,
            completedAt,
        });

        let rewards: IResponse["rewards"];
        let badgeAwarded: Badge | null | undefined;

        // só dá recompensa quando virou completado agora
        if (finalIsCompleted && !wasCompletedBefore) {
            const xpPoints = challenge.xpPointsReward ?? 0;
            const xpCoins = challenge.xpCoinsReward ?? 0;

            if (xpPoints > 0 || xpCoins > 0) {
                await this.userXPGamification.addXpAndCoins({
                    userXPId,
                    xpPoints,
                    xpCoins,
                });

                rewards = { xpPoints, xpCoins };
            }

            if (challenge.badgeId) {
                const alreadyHasBadge =
                    await this.userBadgeRepository.findByUserXPAndBadge(
                        userXPId,
                        challenge.badgeId,
                    );

                if (!alreadyHasBadge) {
                    badgeAwarded = await this.badgeRepository.findById(
                        challenge.badgeId,
                    );

                    await this.userBadgeRepository.create(userXPId, challenge.badgeId);
                }
            }
        }

        return {
            progress: updated,
            rewards,
            badgeAwarded,
        };
    }
}
