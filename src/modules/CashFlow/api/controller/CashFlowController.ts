// // // // src/modules/CashFlow/api/controller/CashFlowController.ts
// // // import type { FastifyReply, FastifyRequest } from "fastify";
// // // import { container } from "tsyringe";

// // // import {
// // //     cashFlowQuerySchema,
// // //     createCashFlowBodySchema,
// // // } from "../validators/cashflow.validators";

// // // import { GetCashFlowSummaryService } from "../../services/GetCashFlowSummary.service";
// // // import { ListCashFlowService } from "../../services/ListCashFlow.service";
// // // import { CreateCashFlowService } from "../../services/CreateCashFlow.service";

// // // export class CashFlowController {
// // //     async getSummary(request: FastifyRequest, reply: FastifyReply) {
// // //         try {
// // //             const { userXPId, month, year } = cashFlowQuerySchema.parse(
// // //                 request.query,
// // //             );

// // //             const service = container.resolve(GetCashFlowSummaryService);
// // //             const result = await service.execute({ userXPId, month, year });

// // //             return reply.status(200).send(result);
// // //         } catch (error) {
// // //             request.log.error({ error }, "Error in CashFlow summary");
// // //             return reply.status(400).send({
// // //                 error: "INVALID_REQUEST",
// // //                 message: (error as Error).message,
// // //             });
// // //         }
// // //     }

// // //     async list(request: FastifyRequest, reply: FastifyReply) {
// // //         try {
// // //             const { userXPId, month, year } = cashFlowQuerySchema.parse(
// // //                 request.query,
// // //             );

// // //             const service = container.resolve(ListCashFlowService);
// // //             const result = await service.execute({ userXPId, month, year });

// // //             return reply.status(200).send(result);
// // //         } catch (error) {
// // //             request.log.error({ error }, "Error in CashFlow list");
// // //             return reply.status(400).send({
// // //                 error: "INVALID_REQUEST",
// // //                 message: (error as Error).message,
// // //             });
// // //         }
// // //     }

// // //     async create(request: FastifyRequest, reply: FastifyReply) {
// // //         try {
// // //             const body = createCashFlowBodySchema.parse(request.body);

// // //             const service = container.resolve(CreateCashFlowService);

// // //             const cashFlow = await service.execute({
// // //                 userXPId: body.userXPId,
// // //                 date: new Date(body.date),
// // //                 description: body.description,
// // //                 category: body.category,
// // //                 dimension: body.dimension ?? null,
// // //                 operation: body.operation,
// // //                 amount: body.amount,
// // //             });

// // //             return reply.status(201).send({ cashFlow });
// // //         } catch (error) {
// // //             request.log.error({ error }, "Error creating CashFlow entry");
// // //             return reply.status(400).send({
// // //                 error: "INVALID_REQUEST",
// // //                 message: (error as Error).message,
// // //             });
// // //         }
// // //     }
// // // }

// // import type { FastifyRequest, FastifyReply } from "fastify";
// // import { container } from "tsyringe";

// // import { auth } from "@/lib/auth";
// // import { toWebHeaders } from "@/shared/utils/toWebHeaders";

// // import { CashFlowOperation } from "@/generated/prisma/client";
// // import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
// // import { CreateCashFlowService } from "../../services/CreateCashFlow.service";
// // import { GetCashFlowSummaryService } from "@/modules/CashFlow/services/GetCashFlowSummary.service";

// // type AnyRequest = FastifyRequest<any>;

// // export class CashFlowController {
// //     /**
// //      * Helper igual ao de Goals: garante sessão e retorna userXP
// //      */
// //     private async getSessionUserXP(request: AnyRequest) {
// //         const session = await auth.api.getSession({
// //             headers: toWebHeaders(request.headers as any),
// //         });

// //         if (!session?.user) {
// //             throw new Error("UNAUTHORIZED");
// //         }

// //         const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
// //         const userXP = await getOrCreateUserXP.execute({
// //             userId: session.user.id,
// //             defaultUsername: session.user.email?.split("@")[0],
// //         });

// //         return { session, userXP };
// //     }

// //     /**
// //      * POST /cash-flow
// //      * Registra uma movimentação (entrada/saída/destino)
// //      */
// //     public async create(
// //         request: FastifyRequest,
// //         reply: FastifyReply,
// //     ): Promise<FastifyReply> {
// //         try {
// //             const { userXP } = await this.getSessionUserXP(request as AnyRequest);

// //             const body: any = request.body ?? {};

// //             const {
// //                 date,
// //                 label,
// //                 category,
// //                 operation,
// //                 amount,
// //                 userGoalId,
// //                 recipient,
// //             } = body;

// //             if (!label || !category || !operation || amount === undefined) {
// //                 return reply.status(400).send({
// //                     message:
// //                         "Campos obrigatórios: label, category, operation, amount.",
// //                 });
// //             }

// //             const parsedAmount = Number(amount);
// //             if (Number.isNaN(parsedAmount)) {
// //                 return reply
// //                     .status(400)
// //                     .send({ message: "amount precisa ser um número válido." });
// //             }

// //             const parsedDate = date ? new Date(date) : new Date();
// //             if (Number.isNaN(parsedDate.getTime())) {
// //                 return reply
// //                     .status(400)
// //                     .send({ message: "date inválida (use ISO string)." });
// //             }

// //             const createCashFlow = container.resolve(CreateCashFlowService);

// //             const cashFlow = await createCashFlow.execute({
// //                 userXPId: userXP.id,
// //                 date: parsedDate,
// //                 label,
// //                 category,
// //                 operation: operation as CashFlowOperation,
// //                 amount: parsedAmount,
// //                 userGoalId: userGoalId ?? null,
// //                 recipient: recipient ?? null,
// //             });

// //             return reply.status(201).send({ cashFlow });
// //         } catch (err: any) {
// //             if (err.message === "UNAUTHORIZED") {
// //                 return reply.status(401).send({ error: "unauthorized" });
// //             }

// //             // para debug rápido no hackaton
// //             console.error("[CashFlowController.create] error:", err);
// //             return reply.status(500).send({ error: "internal_error" });
// //         }
// //     }

// //     /**
// //      * GET /cash-flow/summary?month=&year=
// //      * Retorna o resumo do fluxo de caixa (entradas, saídas, por categoria, por dimensão)
// //      */
// //     public async getSummary(
// //         request: FastifyRequest,
// //         reply: FastifyReply,
// //     ): Promise<FastifyReply> {
// //         try {
// //             const { userXP } = await this.getSessionUserXP(request as AnyRequest);

// //             const query: any = request.query ?? {};
// //             const month =
// //                 typeof query.month === "string" ? Number(query.month) : undefined;
// //             const year =
// //                 typeof query.year === "string" ? Number(query.year) : undefined;

// //             const getSummary = container.resolve(GetCashFlowSummaryService);

// //             const summary = await getSummary.execute({
// //                 userXPId: userXP.id,
// //                 month: Number.isNaN(month!) ? undefined : month,
// //                 year: Number.isNaN(year!) ? undefined : year,
// //             });

// //             return reply.send(summary);
// //         } catch (err: any) {
// //             if (err.message === "UNAUTHORIZED") {
// //                 return reply.status(401).send({ error: "unauthorized" });
// //             }

// //             console.error("[CashFlowController.getSummary] error:", err);
// //             return reply.status(500).send({ error: "internal_error" });
// //         }
// //     }
// // }

// import type { FastifyRequest, FastifyReply } from "fastify";
// import { container } from "tsyringe";

// import { auth } from "@/lib/auth";
// import { toWebHeaders } from "@/shared/utils/toWebHeaders";
// import { CashFlowOperation } from "@/generated/prisma/client";

// import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
// import { CreateCashFlowService } from "@/modules/CashFlow/services/CreateCashFlow.service";
// import { GetCashFlowSummaryService } from "@/modules/CashFlow/services/GetCashFlowSummary.service";

// import {
//     createCashFlowBodySchema,
//     type CreateCashFlowBody,
// } from "../validators/createCashFlow.schema";
// import {
//     cashFlowSummaryQuerySchema,
//     type CashFlowSummaryQuery,
// } from "../validators/cashFlowSummary.schema";

// export class CashFlowController {
//     private async getSessionUserXP(request: FastifyRequest) {
//         const session = await auth.api.getSession({
//             headers: toWebHeaders(request.headers as any),
//         });

//         if (!session?.user) {
//             throw new Error("UNAUTHORIZED");
//         }

//         const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
//         const userXP = await getOrCreateUserXP.execute({
//             userId: session.user.id,
//             defaultUsername: session.user.email?.split("@")[0],
//         });

//         return { session, userXP };
//     }

//     // POST /cash-flow
//     public async create(
//         request: FastifyRequest,
//         reply: FastifyReply,
//     ): Promise<FastifyReply> {
//         try {
//             const { userXP } = await this.getSessionUserXP(request);

//             let body: CreateCashFlowBody;
//             try {
//                 body = createCashFlowBodySchema.parse(request.body);
//             } catch (err: any) {
//                 return reply.status(400).send({
//                     message: "Validation error",
//                     errors: err.errors ?? err,
//                 });
//             }

//             const date = body.date ? new Date(body.date) : new Date();
//             if (body.date && Number.isNaN(date.getTime())) {
//                 return reply
//                     .status(400)
//                     .send({ message: "date inválida (use ISO string)" });
//             }

//             const createCashFlow = container.resolve(CreateCashFlowService);

//             const cashFlow = await createCashFlow.execute({
//                 userXPId: userXP.id,
//                 date,
//                 label: body.label,
//                 category: body.category,
//                 operation: body.operation as CashFlowOperation,
//                 amount: body.amount,
//                 userGoalId: body.userGoalId ?? null,
//                 recipient: body.recipient ?? null,
//             });

//             return reply.status(201).send({ cashFlow });
//         } catch (err: any) {
//             if (err.message === "UNAUTHORIZED") {
//                 return reply.status(401).send({ error: "unauthorized" });
//             }
//             console.error("[CashFlowController.create] error:", err);
//             return reply.status(500).send({ error: "internal_error" });
//         }
//     }

//     // GET /cash-flow/summary?month=&year=
//     public async getSummary(
//         request: FastifyRequest,
//         reply: FastifyReply,
//     ): Promise<FastifyReply> {
//         try {
//             const { userXP } = await this.getSessionUserXP(request);

//             let query: CashFlowSummaryQuery;
//             try {
//                 query = cashFlowSummaryQuerySchema.parse(request.query);
//             } catch (err: any) {
//                 return reply.status(400).send({
//                     message: "Validation error",
//                     errors: err.errors ?? err,
//                 });
//             }

//             const getSummary = container.resolve(GetCashFlowSummaryService);

//             const summary = await getSummary.execute({
//                 userXPId: userXP.id,
//                 month: query.month,
//                 year: query.year,
//             });

//             return reply.send(summary);
//         } catch (err: any) {
//             if (err.message === "UNAUTHORIZED") {
//                 return reply.status(401).send({ error: "unauthorized" });
//             }
//             console.error("[CashFlowController.getSummary] error:", err);
//             return reply.status(500).send({ error: "internal_error" });
//         }
//     }
// }

// ----------------------

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
