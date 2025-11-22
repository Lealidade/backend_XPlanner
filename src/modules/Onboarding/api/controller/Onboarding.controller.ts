// import type { FastifyRequest, FastifyReply } from "fastify";
// import { auth } from "@/lib/auth";
// import { toWebHeaders } from "@/shared/utils/toWebHeaders";
// import { container } from "tsyringe";

// import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
// import { ListQuizQuestionsService } from "@/modules/Onboarding/services/ListQuizQuestions.service";
// import { SubmitQuizAnswersBody, submitQuizAnswersBodySchema } from "../validators/submitQuizAnswers.schema";
// import { GetMyFinancialProfileService } from "../../services/GetMyFinancialProfile.service";
// import { SubmitQuizAnswersService } from "@/modules/Onboarding/services/SubmitQuizAnswers.service";


// export class OnboardingController {
//     public async getQuiz(request: FastifyRequest, reply: FastifyReply) {
//         const session = await auth.api.getSession({
//             headers: toWebHeaders(request.headers as any),
//         });

//         if (!session?.user) {
//             return reply.status(401).send({ error: "unauthorized" });
//         }

//         // garante que existe UserXP
//         const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
//         const userXP = await getOrCreateUserXP.execute({
//             userId: session.user.id,
//             defaultUsername: session.user.email?.split("@")[0],
//         });

//         const listQuizQuestions = container.resolve(ListQuizQuestionsService);
//         const questions = await listQuizQuestions.execute();

//         return reply.send({
//             userXPId: userXP.id,
//             questions,
//         });
//     }

//     public async submitQuizAnswers(
//         request: FastifyRequest,
//         reply: FastifyReply,
//     ): Promise<FastifyReply> {
//         const session = await auth.api.getSession({
//             headers: toWebHeaders(request.headers as any),
//         });

//         if (!session?.user) {
//             return reply.status(401).send({ error: "unauthorized" });
//         }

//         const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
//         const userXP = await getOrCreateUserXP.execute({
//             userId: session.user.id,
//             defaultUsername: session.user.email?.split("@")[0],
//         });

//         let body: SubmitQuizAnswersBody;

//         try {
//             body = submitQuizAnswersBodySchema.parse(request.body);
//         } catch (err) {
//             const zodError = err as any;
//             return reply.status(400).send({
//                 message: "Validation error",
//                 errors: zodError.errors ?? zodError,
//             });
//         }

//         const submitQuizAnswersService = container.resolve(SubmitQuizAnswersService);

//         const result = await submitQuizAnswersService.execute({
//             userXPId: userXP.id,
//             answers: body.answers,   // 👈 aqui é o ponto: usar body.answers
//         });

//         return reply.status(200).send(result);
//     }

//     public async getMyFinancialProfile(
//         request: FastifyRequest,
//         reply: FastifyReply
//     ): Promise<FastifyReply> {
//         const session = await auth.api.getSession({
//             headers: toWebHeaders(request.headers as any),
//         });

//         if (!session?.user) {
//             return reply.status(401).send({ error: "unauthorized" });
//         }

//         const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
//         const userXP = await getOrCreateUserXP.execute({
//             userId: session.user.id,
//             defaultUsername: session.user.email?.split("@")[0],
//         });

//         const getProfileService = container.resolve(GetMyFinancialProfileService);

//         const profile = await getProfileService.execute({
//             userXPId: userXP.id,
//         });

//         // Se ainda não respondeu o quiz, não terá perfil
//         if (!profile) {
//             return reply.status(200).send({
//                 hasProfile: false,
//                 message: "User has not completed onboarding quiz yet.",
//                 profile: null,
//             });
//         }

//         return reply.send({
//             hasProfile: true,
//             profile,
//         });
//     }
// }

import type { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";
import { container } from "tsyringe";

import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
import { ListQuizQuestionsService } from "@/modules/Onboarding/services/ListQuizQuestions.service";
import {
    submitQuizAnswersBodySchema,
    type SubmitQuizAnswersBody,
} from "../validators/submitQuizAnswers.schema";
import { GetMyFinancialProfileService } from "../../services/GetMyFinancialProfile.service";
import { SubmitQuizAnswersService } from "@/modules/Onboarding/services/SubmitQuizAnswers.service";

export class OnboardingController {
    private async getSessionUserXP(request: FastifyRequest) {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            throw new Error("UNAUTHORIZED");
        }

        const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
        const userXP = await getOrCreateUserXP.execute({
            userId: session.user.id,
            defaultUsername: session.user.email?.split("@")[0],
        });

        return { session, userXP };
    }

    // GET /onboarding/quiz
    public async getQuiz(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            const listQuizQuestions = container.resolve(ListQuizQuestionsService);
            const questions = await listQuizQuestions.execute();

            return reply.send({
                userXPId: userXP.id,
                questions,
            });
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }

            console.error("[OnboardingController.getQuiz] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // POST /onboarding/quiz/answers
    public async submitQuizAnswers(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            let body: SubmitQuizAnswersBody;
            try {
                body = submitQuizAnswersBodySchema.parse(request.body);
            } catch (err: any) {
                return reply.status(400).send({
                    message: "Validation error",
                    errors: err.errors ?? err,
                });
            }

            const submitQuizAnswersService = container.resolve(
                SubmitQuizAnswersService,
            );

            const result = await submitQuizAnswersService.execute({
                userXPId: userXP.id,
                answers: body.answers,
            });

            return reply.status(200).send(result);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }

            console.error("[OnboardingController.submitQuizAnswers] error:", err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }

    // GET /onboarding/financial-profile/me
    public async getMyFinancialProfile(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            const getProfileService = container.resolve(
                GetMyFinancialProfileService,
            );

            const profile = await getProfileService.execute({
                userXPId: userXP.id,
            });

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
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }

            console.error(
                "[OnboardingController.getMyFinancialProfile] error:",
                err,
            );
            return reply.status(500).send({ error: "internal_error" });
        }
    }
}
