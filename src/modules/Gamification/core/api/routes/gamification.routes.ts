// // src/modules/Gamification/core/api/routes/gamification.routes.ts
// import type { FastifyInstance } from "fastify";
// import { GamificationOverviewController } from "../controller/GamificationOverview.controller";

// export async function gamificationRoutes(app: FastifyInstance) {
//     const controller = new GamificationOverviewController();

//     // GET /gamification/overview
//     app.get("/overview", (request, reply) =>
//         controller.getOverview(request, reply),
//     );
// }

// src/modules/Gamification/core/api/routes/gamificationOverview.routes.ts
import type { FastifyInstance } from "fastify";
import { GamificationOverviewController } from "../controller/GamificationOverview.controller";

export async function gamificationOverviewRoutes(app: FastifyInstance) {
    const controller = new GamificationOverviewController();

    // GET /gamification/overview
    app.get("/overview", (request, reply) =>
        controller.getOverview(request, reply),
    );
}
