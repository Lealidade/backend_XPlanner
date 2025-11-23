import type { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";

import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";

import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";

import { ListGoalTemplatesService } from "@/modules/Gamification/goals/services/ListGoalTemplates.service";
import { ListUserGoalsService } from "@/modules/Gamification/goals/services/ListUserGoals.service";
import { CreateUserGoalService } from "@/modules/Gamification/goals/services/CreateUserGoal.service";
import { UpdateUserGoalProgressService } from "@/modules/Gamification/goals/services/UpdateUserGoalProgress.service";
import { ContributeToGoalService } from "@/modules/Gamification/goals/services/ContributeToGoal.service";

import {
    createUserGoalBodySchema,
    type CreateUserGoalBody,
} from "../validators/createUserGoal.schema";

import {
    updateUserGoalProgressBodySchema,
    type UpdateUserGoalProgressBody,
} from "../validators/updateUserGoalProgress.schema";

import {
    contributeToGoalBodySchema,
    type ContributeToGoalBody,
} from "../validators/contributeToGoal.schema";

export class GoalsController {
    // Helper único para sessão + UserXP
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

    // GET /gamification/goals/templates
    public async listTemplates(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            // só checa auth
            await this.getSessionUserXP(request);

            const service = container.resolve(ListGoalTemplatesService);
            const templates = await service.execute();

            return reply.send({ templates });
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            console.error("[GoalsController.listTemplates] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // GET /gamification/goals/me
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
            console.error("[GoalsController.listMyGoals] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // POST /gamification/goals
    public async create(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

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
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            if (
                err.message === "TARGET_DATE_REQUIRED" ||
                err.message === "INVALID_TARGET_DATE"
            ) {
                return reply.status(400).send({ error: err.message });
            }
            console.error("[GoalsController.create] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // PATCH /gamification/goals/:id/progress  (ajuste manual)
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
            console.error("[GoalsController.updateProgress] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // POST /gamification/goals/:id/contribute
    // Aporte na meta → atualiza progresso, cria CashFlow, aplica XP/coins
    public async contribute(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);
            const userGoalId = (request.params as any).id as string;

            let body: ContributeToGoalBody;
            try {
                body = contributeToGoalBodySchema.parse(request.body);
            } catch (err: any) {
                return reply.status(400).send({
                    message: "Validation error",
                    errors: err.errors ?? err,
                });
            }

            const service = container.resolve(ContributeToGoalService);

            const result = await service.execute({
                userXPId: userXP.id,
                userGoalId,
                amount: body.amount,
                date: body.date,
                label: body.label,
                category: body.category,
                recipient: body.recipient ?? null,
            });

            return reply.status(201).send(result);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            if (err.message === "USER_GOAL_NOT_FOUND") {
                return reply.status(404).send({ error: err.message });
            }
            if (err.message === "INVALID_AMOUNT") {
                return reply.status(400).send({ error: err.message });
            }
            console.error("[GoalsController.contribute] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }
}
