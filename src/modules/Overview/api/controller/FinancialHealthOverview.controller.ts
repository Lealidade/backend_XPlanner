// src/modules/Overview/api/controller/FinancialHealthOverview.controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";

import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";
import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";

import {
    cashFlowSummaryQuerySchema,
    type CashFlowSummaryQuery,
} from "@/modules/CashFlow/api/validators/cashFlowSummary.schema";

import { GetFinancialHealthOverviewService } from "@/modules/Overview/services/GetFinancialHealthOverview.service";

export class FinancialHealthOverviewController {
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

    // GET /financial-health/overview?month=&year=
    public async getOverview(
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

            const service = container.resolve(
                GetFinancialHealthOverviewService,
            );

            const overview = await service.execute({
                userXPId: userXP.id,
                month: query.month,
                year: query.year,
            });

            return reply.send(overview);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }

            console.error(
                "[FinancialHealthOverviewController.getOverview] error:",
                err,
            );
            return reply.status(500).send({ error: "internal_error" });
        }
    }
}
