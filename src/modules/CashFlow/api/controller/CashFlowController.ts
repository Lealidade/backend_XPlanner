import type { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";

import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";
import { CashFlowOperation } from "@/generated/prisma/client";

import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
import { CreateCashFlowService } from "@/modules/CashFlow/services/CreateCashFlow.service";
import { GetCashFlowSummaryService } from "@/modules/CashFlow/services/GetCashFlowSummary.service";
import { ListCashFlowService } from "@/modules/CashFlow/services/ListCashFlow.service";

import {
    createCashFlowBodySchema,
    type CreateCashFlowBody,
} from "../validators/createCashFlow.schema";
import {
    cashFlowSummaryQuerySchema,
    type CashFlowSummaryQuery,
} from "../validators/cashFlowSummary.schema";

export class CashFlowController {
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

    // POST /cash-flow
    public async create(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            let body: CreateCashFlowBody;
            try {
                body = createCashFlowBodySchema.parse(request.body);
            } catch (err: any) {
                return reply.status(400).send({
                    message: "Validation error",
                    errors: err.errors ?? err,
                });
            }

            const date = body.date ? new Date(body.date) : new Date();

            const createCashFlow = container.resolve(CreateCashFlowService);

            const cashFlow = await createCashFlow.execute({
                userXPId: userXP.id,
                date,
                label: body.label,
                category: body.category,
                operation: body.operation as CashFlowOperation,
                amount: body.amount,
                userGoalId: body.userGoalId ?? null,
                recipient: body.recipient ?? null,
            });

            return reply.status(201).send({ cashFlow });
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            console.error("[CashFlowController.create] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // GET /cash-flow
    public async list(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            let query: CashFlowSummaryQuery;
            try {
                query = cashFlowSummaryQuerySchema.parse(request.query);
            } catch (err: any) {
                return reply.status(400).send({
                    message: "Validation error",
                    errors: err.errors ?? err,
                });
            }

            const listService = container.resolve(ListCashFlowService);

            const result = await listService.execute({
                userXPId: userXP.id,
                month: query.month,
                year: query.year,
            });

            return reply.send(result);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            console.error("[CashFlowController.list] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // GET /cash-flow/summary?month=&year=
    public async getSummary(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            let query: CashFlowSummaryQuery;
            try {
                query = cashFlowSummaryQuerySchema.parse(request.query);
            } catch (err: any) {
                return reply.status(400).send({
                    message: "Validation error",
                    errors: err.errors ?? err,
                });
            }

            const getSummary = container.resolve(GetCashFlowSummaryService);

            const summary = await getSummary.execute({
                userXPId: userXP.id,
                month: query.month,
                year: query.year,
            });

            return reply.send(summary);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            console.error("[CashFlowController.getSummary] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }
}
