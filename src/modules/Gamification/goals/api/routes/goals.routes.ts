import type { FastifyInstance } from "fastify";
import { GoalsController } from "../controller/Goals.controller";

export async function goalsRoutes(app: FastifyInstance) {
    const controller = new GoalsController();

    // GET /gamification/goals/templates
    app.get("/templates", controller.listTemplates.bind(controller));

    // GET /gamification/goals/me
    app.get("/me", controller.listMyGoals.bind(controller));

    // POST /gamification/goals
    app.post("/", controller.create.bind(controller));

    // PATCH /gamification/goals/:id/progress  (ajuste manual de progresso)
    app.patch("/:id/progress", controller.updateProgress.bind(controller));

    // POST /gamification/goals/:id/contribute  (aporte na meta + cashflow + gamificação)
    app.post("/:id/contribute", controller.contribute.bind(controller));
}
