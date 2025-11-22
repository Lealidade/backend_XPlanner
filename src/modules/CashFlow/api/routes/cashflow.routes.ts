// // src/modules/CashFlow/api/routes/cashflow.routes.ts
// import type { FastifyInstance } from "fastify";
// import { CashFlowController } from "@/modules/CashFlow/api/controller/CashFlowController";

// export async function cashFlowRoutes(app: FastifyInstance) {
//     const controller = new CashFlowController();

//     // GET /cash-flow/summary
//     app.get("/summary", (request, reply) =>
//         controller.getSummary(request, reply),
//     );

//     // GET /cash-flow/list
//     app.get("/list", (request, reply) =>
//         controller.list(request, reply),
//     );

//     // POST /cash-flow
//     app.post("/", (request, reply) =>
//         controller.create(request, reply),
//     );
// }

// import type { FastifyInstance } from "fastify";
// import { CashFlowController } from "../controller/CashFlowController";

// export async function cashFlowRoutes(app: FastifyInstance) {
//     const controller = new CashFlowController();

//     // POST /cash-flow  → cria movimentação
//     app.post("/", (req, res) => controller.create(req, res));

//     // GET /cash-flow/summary → resumo do fluxo de caixa
//     app.get("/summary", (req, res) => controller.getSummary(req, res));
// }

// ---------------------

import type { FastifyInstance } from "fastify";
import { CashFlowController } from "../controller/CashFlowController";

export async function cashFlowRoutes(app: FastifyInstance) {
    const controller = new CashFlowController();

    // POST /cash-flow  → cria movimentação
    app.post("/", (req, res) => controller.create(req, res));

    // GET /cash-flow → lista movimentações do período
    app.get("/", (req, res) => controller.list(req, res));

    // GET /cash-flow/summary → resumo do fluxo de caixa
    app.get("/summary", (req, res) => controller.getSummary(req, res));
}
