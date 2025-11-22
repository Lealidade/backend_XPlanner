import type { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";
import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";

import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
import { ListGoalTemplatesService } from "@/modules/Gamification/goals/services/ListGoalTemplates.service";
import { ListUserGoalsService } from "@/modules/Gamification/goals/services/ListUserGoals.service";
import { CreateUserGoalService } from "@/modules/Gamification/goals/services/CreateUserGoal.service";
import { UpdateUserGoalProgressService } from "@/modules/Gamification/goals/services/UpdateUserGoalProgress.service";

import {
    createUserGoalBodySchema,
    type CreateUserGoalBody,
} from "../validators/createUserGoal.schema";
import {
    updateUserGoalProgressBodySchema,
    type UpdateUserGoalProgressBody,
} from "../validators/updateUserGoalProgress.schema";

export class GoalsController {
    public async create(
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

        let body: CreateUserGoalBody;

        try {
            body = createUserGoalBodySchema.parse(request.body);
        } catch (err: any) {
            return reply.status(400).send({
                message: "Validation error",
                errors: err.errors ?? err,
            });
        }

        const createGoalService = container.resolve(CreateUserGoalService);

        const goal = await createGoalService.execute({
            userXPId: userXP.id,
            templateId: body.templateId,
            customTitle: body.customTitle,
            targetAmount: body.targetAmount,
            currentAmount: body.currentAmount,
            targetDate: body.targetDate,
        });

        return reply.status(201).send({ goal });
    }

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

    public async listTemplates(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            // só verifica auth
            await this.getSessionUserXP(request);

            const service = container.resolve(ListGoalTemplatesService);
            const templates = await service.execute();

            return reply.send({ templates });
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    public async listMyGoals(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            const service = container.resolve(ListUserGoalsService);
            const goals = await service.execute(userXP.id);

            return reply.send({ goals });
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // public async create(
    //     request: FastifyRequest,
    //     reply: FastifyReply,
    // ): Promise<FastifyReply> {
    //     try {
    //         const { userXP } = await this.getSessionUserXP(request);

    //         let body: CreateUserGoalBody;
    //         try {
    //             body = createUserGoalBodySchema.parse(request.body);
    //         } catch (err: any) {
    //             return reply.status(400).send({
    //                 message: "Validation error",
    //                 errors: err.errors ?? err,
    //             });
    //         }

    //         const targetDate = new Date(body.targetDate);

    //         const service = container.resolve(CreateUserGoalService);

    //         const goal = await service.execute({
    //             userXPId: userXP.id,
    //             goalId: body.goalId,
    //             customTitle: body.customTitle,
    //             targetAmount: body.targetAmount,
    //             targetDate,
    //         });

    //         return reply.status(201).send({ goal });
    //     } catch (err: any) {
    //         if (err.message === "UNAUTHORIZED") {
    //             return reply.status(401).send({ error: "unauthorized" });
    //         }
    //         if (err.message === "GOAL_TEMPLATE_NOT_FOUND") {
    //             return reply.status(404).send({ error: err.message });
    //         }
    //         return reply.status(500).send({ error: "internal_error" });
    //     }
    // }

    public async updateProgress(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            const userGoalId = (request.params as any).id as string;

            let body: UpdateUserGoalProgressBody;
            try {
                body = updateUserGoalProgressBodySchema.parse(request.body);
            } catch (err: any) {
                return reply.status(400).send({
                    message: "Validation error",
                    errors: err.errors ?? err,
                });
            }

            const service = container.resolve(UpdateUserGoalProgressService);

            const updated = await service.execute({
                userXPId: userXP.id,
                userGoalId,
                currentAmount: body.currentAmount,
            });

            return reply.send({ goal: updated });
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            if (err.message === "USER_GOAL_NOT_FOUND") {
                return reply.status(404).send({ error: err.message });
            }
            return reply.status(500).send({ error: "internal_error" });
        }
    }
}
