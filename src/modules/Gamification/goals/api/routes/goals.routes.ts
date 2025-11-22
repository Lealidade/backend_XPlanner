// import type { FastifyInstance } from "fastify";
// import { GoalsController } from "../controller/Goals.controller";

// export async function registerGoalsRoutes(app: FastifyInstance) {
//     const controller = new GoalsController();

//     app.get("/gamification/goals/templates", (req, res) =>
//         controller.listTemplates(req, res),
//     );

//     app.get("/gamification/goals/me", (req, res) =>
//         controller.listMyGoals(req, res),
//     );

//     app.post("/gamification/goals", (req, res) =>
//         controller.create(req, res),
//     );

//     app.patch("/gamification/goals/:id/progress", (req, res) =>
//         controller.updateProgress(req, res),
//     );
// }

// import type { FastifyInstance } from "fastify";
// import { GoalsController } from "../controller/Goals.controller";

// export async function goalsRoutes(app: FastifyInstance) {
//     const controller = new GoalsController();

//     // GET /gamification/goals/templates
//     app.get("/templates", (req, res) => controller.listTemplates(req, res));

//     // GET /gamification/goals/me
//     app.get("/me", (req, res) => controller.listMyGoals(req, res));

//     // POST /gamification/goals
//     app.post("/", (req, res) => controller.create(req, res));

//     // PATCH /gamification/goals/:id/progress
//     app.patch("/:id/progress", (req, res) =>
//         controller.updateProgress(req, res),
//     );

//     // app.post("/goals", controller.create.bind(controller));
// }

// ---------------

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
