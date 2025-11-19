import type { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";
import { container } from "tsyringe";

import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
import { ListQuizQuestionsService } from "@/modules/Onboarding/services/ListQuizQuestions.service";
import { SubmitQuizAnswersAndCalculateScoreService } from "../../services/SubmitQuizAnswersAndCalculateScore.service";
import { SubmitQuizAnswersBody, submitQuizAnswersBodySchema } from "../validators/submitQuizAnswers.schema";
import { GetMyFinancialProfileService } from "../../services/GetMyFinancialProfile.service";

export class OnboardingController {
    public async getQuiz(request: FastifyRequest, reply: FastifyReply) {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            return reply.status(401).send({ error: "unauthorized" });
        }

        // garante que existe UserXP
        const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
        const userXP = await getOrCreateUserXP.execute({
            userId: session.user.id,
            defaultUsername: session.user.email?.split("@")[0],
        });

        const listQuizQuestions = container.resolve(ListQuizQuestionsService);
        const questions = await listQuizQuestions.execute();

        return reply.send({
            userXPId: userXP.id,
            questions,
        });
    }

    public async submitQuizAnswers(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            return reply.status(401).send({ error: "unauthorized" });
        }

        const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
        const userXP = await getOrCreateUserXP.execute({
            userId: session.user.id,
            defaultUsername: session.user.email?.split("@")[0],
        });

        let body: SubmitQuizAnswersBody;

        try {
            body = submitQuizAnswersBodySchema.parse(request.body);
        } catch (err) {
            const zodError = err as any;
            return reply.status(400).send({
                message: "Validation error",
                errors: zodError.errors ?? zodError,
            });
        }

        const submitService = container.resolve(
            SubmitQuizAnswersAndCalculateScoreService,
        );

        const result = await submitService.execute({
            userXPId: userXP.id,
            answers: body.answers,
        });

        return reply.send(result);
    }

    public async getMyFinancialProfile(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            return reply.status(401).send({ error: "unauthorized" });
        }

        const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
        const userXP = await getOrCreateUserXP.execute({
            userId: session.user.id,
            defaultUsername: session.user.email?.split("@")[0],
        });

        const getProfileService = container.resolve(GetMyFinancialProfileService);

        const profile = await getProfileService.execute({
            userXPId: userXP.id,
        });

        // Se ainda não respondeu o quiz, não terá perfil
        if (!profile) {
            return reply.status(200).send({
                hasProfile: false,
                message: "User has not completed onboarding quiz yet.",
                profile: null,
            });
        }

        return reply.send({
            hasProfile: true,
            profile,
        });
    }
}
