import type { FastifyInstance } from "fastify";
import { LearningPathsController } from "@/modules/LearningPaths/api/controller/LearningPathsController";

export async function learningPathsRoutes(app: FastifyInstance) {
    const controller = new LearningPathsController();

    app.get("/recommended", (request, reply) =>
        controller.getRecommended(request, reply),
    );

    app.get("/:id", (request, reply) =>
        controller.getById(request, reply),
    );

    app.get("/:id/progress", (request, reply) =>
        controller.getPathProgress(request, reply),
    );

    app.post("/steps/:stepId/complete", (request, reply) =>
        controller.completeStep(request, reply),
    );
}
