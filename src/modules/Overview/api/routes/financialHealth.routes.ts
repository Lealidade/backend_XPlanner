import type { FastifyInstance } from "fastify";
import { FinancialHealthOverviewController } from "../controller/FinancialHealthOverview.controller";

export async function financialHealthRoutes(app: FastifyInstance) {
    const controller = new FinancialHealthOverviewController();

    app.get("/overview", (req, res) => controller.getOverview(req, res));
}
