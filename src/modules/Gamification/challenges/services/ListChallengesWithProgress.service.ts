import { inject, injectable } from "tsyringe";
import type {
    Challenge,
    UserChallengeProgress,
} from "@/generated/prisma/client";
import type { IChallengeRepository } from "../data/interfaces/IChallengeRepository";
import type { IUserChallengeProgressRepository } from "../data/interfaces/IUserChallengeProgressRepository";

interface IRequest {
    userXPId: string;
}

export interface ChallengeWithProgress {
    challenge: Challenge;
    progress: UserChallengeProgress | null;
    progressPercent: number;
}

@injectable()
export class ListChallengesWithProgressService {
    constructor(
        @inject("ChallengeRepository")
        private challengeRepository: IChallengeRepository,

        @inject("UserChallengeProgressRepository")
        private progressRepository: IUserChallengeProgressRepository,
    ) { }

    public async execute({
        userXPId,
    }: IRequest): Promise<ChallengeWithProgress[]> {
        const [challenges, progresses] = await Promise.all([
            this.challengeRepository.findAll(),
            this.progressRepository.listByUserXP(userXPId),
        ]);

        const progressByChallengeId = new Map<string, UserChallengeProgress>();
        for (const p of progresses) {
            progressByChallengeId.set(p.challengeId, p);
        }

        return challenges.map((challenge) => {
            const progress = progressByChallengeId.get(challenge.id) ?? null;

            const target =
                challenge.durationDays && challenge.durationDays > 0
                    ? challenge.durationDays
                    : 1;

            const current = progress ? progress.currentProgress : 0;

            const progressPercent = progress
                ? Math.min(100, Math.round((current / target) * 100))
                : 0;

            return {
                challenge,
                progress,
                progressPercent,
            };
        });
    }
}
