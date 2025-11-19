import type { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";
import { container } from "tsyringe";

import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
import { GetRecommendedLearningPathsService } from "@/modules/LearningPaths/services/GetRecommendedLearningPaths.service";
import { GetLearningPathByIdService } from "@/modules/LearningPaths/services/GetLearningPathById.service";
import { MarkLearningStepCompletedService } from "../../services/MarkLearningStepCompleted.service";
import { GetLearningPathProgressService } from "../../services/GetLearningPathProgress.service";

export class LearningPathsController {
    public async getRecommended(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            return reply.status(401).send({ error: "unauthorized" });
        }

        const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
        const userXP = await getOrCreateUserXP.execute({
            userId: session.user.id,
            defaultUsername: session.user.email?.split("@")[0],
        });

        const service = container.resolve(GetRecommendedLearningPathsService);

        try {
            const result = await service.execute({ userXPId: userXP.id });

            return reply.send({
                hasProfile: true,
                ...result,
            });
        } catch (err: any) {
            if (err instanceof Error && err.message === "FINANCIAL_PROFILE_NOT_FOUND") {
                return reply.status(200).send({
                    hasProfile: false,
                    message: "User has not completed onboarding quiz yet.",
                    profile: null,
                    recommendedPaths: [],
                });
            }

            request.log.error(
                { err },
                "Error while getting recommended learning paths",
            );

            return reply.status(500).send({ error: "internal_server_error" });
        }
    }

    public async getById(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            return reply.status(401).send({ error: "unauthorized" });
        }

        const { id } = request.params as { id: string };

        const service = container.resolve(GetLearningPathByIdService);
        const path = await service.execute({ id });

        if (!path) {
            return reply.status(404).send({ error: "learning_path_not_found" });
        }

        return reply.send(path);
    }

    public async markStepCompleted(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            return reply.status(401).send({ error: "unauthorized" });
        }

        const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
        const userXP = await getOrCreateUserXP.execute({
            userId: session.user.id,
            defaultUsername: session.user.email?.split("@")[0],
        });

        const { stepId } = request.params as { stepId: string };

        const service = container.resolve(MarkLearningStepCompletedService);

        try {
            const progress = await service.execute({
                userXPId: userXP.id,
                stepId,
            });

            return reply.send(progress);
        } catch (err: any) {
            if (err instanceof Error && err.message === "LEARNING_STEP_NOT_FOUND") {
                return reply.status(404).send({ error: "learning_step_not_found" });
            }

            request.log.error({ err }, "Error while marking step as completed");
            return reply.status(500).send({ error: "internal_server_error" });
        }
    }

    public async getPathProgress(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            return reply.status(401).send({ error: "unauthorized" });
        }

        const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
        const userXP = await getOrCreateUserXP.execute({
            userId: session.user.id,
            defaultUsername: session.user.email?.split("@")[0],
        });

        const { id } = request.params as { id: string };

        const service = container.resolve(GetLearningPathProgressService);

        try {
            const progress = await service.execute({
                userXPId: userXP.id,
                learningPathId: id,
            });

            return reply.send(progress);
        } catch (err: any) {
            if (err instanceof Error && err.message === "LEARNING_PATH_NOT_FOUND") {
                return reply.status(404).send({ error: "learning_path_not_found" });
            }

            request.log.error({ err }, "Error while getting path progress");
            return reply.status(500).send({ error: "internal_server_error" });
        }
    }
}
