// import type { FastifyInstance } from "fastify";
// import { LearningPathsController } from "@/modules/LearningPaths/api/controller/LearningPathsController";

// export async function learningPathsRoutes(app: FastifyInstance) {
//     const controller = new LearningPathsController();

//     // GET /learning-paths/recommended
//     app.get("/recommended", (request, reply) =>
//         controller.getRecommended(request, reply),
//     );

//     // GET /learning-paths/:id
//     app.get("/:id", (request, reply) =>
//         controller.getById(request, reply),
//     );

//     // GET /learning-paths/:id/progress
//     app.get("/:id/progress", (request, reply) =>
//         controller.getPathProgress(request, reply),
//     );

//     // POST /learning-paths/steps/:stepId/complete
//     app.post("/steps/:stepId/complete", (request, reply) =>
//         controller.markStepCompleted(request, reply),
//     );

//     // POST /learning-paths/steps/:id/complete
//     app.post("/steps/:id/complete", (req, res) =>
//         controller.completeStep(req, res),
//     );
// }

// src/modules/LearningPaths/api/routes/learningPaths.routes.ts
import type { FastifyInstance } from "fastify";
import { LearningPathsController } from "@/modules/LearningPaths/api/controller/LearningPathsController";

export async function learningPathsRoutes(app: FastifyInstance) {
    const controller = new LearningPathsController();

    // GET /learning-paths/recommended
    app.get("/recommended", (request, reply) =>
        controller.getRecommended(request, reply),
    );

    // GET /learning-paths/:id
    app.get("/:id", (request, reply) =>
        controller.getById(request, reply),
    );

    // GET /learning-paths/:id/progress
    app.get("/:id/progress", (request, reply) =>
        controller.getPathProgress(request, reply),
    );

    // ✅ ÚNICA rota de completar passo
    // POST /learning-paths/steps/:stepId/complete
    app.post("/steps/:stepId/complete", (request, reply) =>
        controller.completeStep(request, reply),
    );
}
