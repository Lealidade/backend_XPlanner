import type { FastifyInstance } from "fastify";
import { OnboardingController } from "@/modules/Onboarding/api/controller/Onboarding.controller";

export async function onboardingRoutes(app: FastifyInstance) {
    const controller = new OnboardingController();

    app.get("/quiz", (request, reply) => controller.getQuiz(request, reply));

    app.post("/quiz/answers", (request, reply) =>
        controller.submitQuizAnswers(request, reply),
    );

    app.get("/financial-profile/me", (request, reply) =>
        controller.getMyFinancialProfile(request, reply)
    );
}
