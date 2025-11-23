import type { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";

import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";

import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";

import { ListChallengesWithProgressService } from "@/modules/Gamification/challenges/services/ListChallengesWithProgress.service";
import { UpdateChallengeProgressService } from "@/modules/Gamification/challenges/services/UpdateChallengeProgress.service";

import {
    updateChallengeProgressBodySchema,
    type UpdateChallengeProgressBody,
} from "../validators/updateChallengeProgress.schema";

export class ChallengesController {
    private async getSessionUserXP(request: FastifyRequest) {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            throw new Error("UNAUTHORIZED");
        }

        const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);

        const userXP = await getOrCreateUserXP.execute({
            userId: session.user.id,
            defaultUsername: session.user.email?.split("@")[0],
        });

        return { session, userXP };
    }

    // GET /gamification/challenges
    public async listWithProgress(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            const service = container.resolve(ListChallengesWithProgressService);

            const challenges = await service.execute({
                userXPId: userXP.id,   // 👈 agora bate com IRequest
            });

            return reply.send({ challenges });
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }

            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // PATCH /gamification/challenges/:challengeId/progress
    public async updateProgress(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            const challengeId = (request.params as any).challengeId as string;

            let body: UpdateChallengeProgressBody;
            try {
                body = updateChallengeProgressBodySchema.parse(request.body);
            } catch (err: any) {
                return reply.status(400).send({
                    message: "Validation error",
                    errors: err.errors ?? err,
                });
            }

            const service = container.resolve(UpdateChallengeProgressService);

            const result = await service.execute({
                userXPId: userXP.id,
                challengeId,
                currentProgress: body.currentProgress,
                isCompleted: body.isCompleted,
            });

            // result deve ser { progress, rewards?, badgeAwarded? }
            return reply.send(result);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }

            if (err.message === "CHALLENGE_NOT_FOUND") {
                return reply.status(404).send({ error: err.message });
            }

            return reply.status(500).send({ error: "internal_error" });
        }
    }
}
