import type { FastifyInstance } from "fastify";
import { ChallengesController } from "../controller/ChallengesController";

export async function challengesRoutes(app: FastifyInstance) {
    const controller = new ChallengesController();

    // GET /gamification/challenges
    app.get("/", (req, res) => controller.listWithProgress(req, res));

    // PATCH /gamification/challenges/:challengeId/progress
    app.patch("/:challengeId/progress", (req, res) =>
        controller.updateProgress(req, res),
    );
}
