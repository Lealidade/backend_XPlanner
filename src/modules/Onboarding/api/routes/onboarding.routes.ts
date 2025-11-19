import type { FastifyInstance } from "fastify";
import { OnboardingController } from "@/modules/Onboarding/api/controller/Onboarding.controller";

export async function onboardingRoutes(app: FastifyInstance) {
    const controller = new OnboardingController();

    // GET /onboarding/quiz
    app.get("/quiz", (request, reply) => controller.getQuiz(request, reply));

    // POST /onboarding/quiz/answers
    app.post("/quiz/answers", (request, reply) =>
        controller.submitQuizAnswers(request, reply),
    );

    // GET /onboarding/financial-profile/me
    app.get("/financial-profile/me", (request, reply) =>
        controller.getMyFinancialProfile(request, reply)
    );
}
