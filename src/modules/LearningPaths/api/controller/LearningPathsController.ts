// import type { FastifyRequest, FastifyReply } from "fastify";
// import { auth } from "@/lib/auth";
// import { toWebHeaders } from "@/shared/utils/toWebHeaders";
// import { container } from "tsyringe";

// import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
// import { GetRecommendedLearningPathsService } from "@/modules/LearningPaths/services/GetRecommendedLearningPaths.service";
// import { GetLearningPathByIdService } from "@/modules/LearningPaths/services/GetLearningPathById.service";
// import { MarkLearningStepCompletedService } from "../../services/MarkLearningStepCompleted.service";
// import { GetLearningPathProgressService } from "../../services/GetLearningPathProgress.service";
// import { CompleteLearningStepService } from "../../services/CompleteLearningStep.service";

// export class LearningPathsController {
//     public async getRecommended(
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

//         const service = container.resolve(GetRecommendedLearningPathsService);

//         try {
//             const result = await service.execute({ userXPId: userXP.id });

//             return reply.send({
//                 hasProfile: true,
//                 ...result,
//             });
//         } catch (err: any) {
//             if (err instanceof Error && err.message === "FINANCIAL_PROFILE_NOT_FOUND") {
//                 return reply.status(200).send({
//                     hasProfile: false,
//                     message: "User has not completed onboarding quiz yet.",
//                     profile: null,
//                     recommendedPaths: [],
//                 });
//             }

//             request.log.error(
//                 { err },
//                 "Error while getting recommended learning paths",
//             );

//             return reply.status(500).send({ error: "internal_server_error" });
//         }
//     }

//     private async getSessionUserXP(request: FastifyRequest) {
//         const session = await auth.api.getSession({
//             headers: toWebHeaders(request.headers as any),
//         });

//         if (!session?.user) {
//             throw new Error("UNAUTHORIZED");
//         }

//         const getOrCreateUserXP = container.resolve(GetOrCreateUserXPService);
//         const userXP = await getOrCreateUserXP.execute({
//             userId: session.user.id,
//             defaultUsername: session.user.email?.split("@")[0],
//         });

//         return { session, userXP };
//     }

//     // public async completeStep(
//     //     request: FastifyRequest,
//     //     reply: FastifyReply,
//     // ): Promise<FastifyReply> {
//     //     try {
//     //         const { userXP } = await this.getSessionUserXP(request);
//     //         const stepId = (request.params as any).id as string;

//     //         const service = container.resolve(CompleteLearningStepService);

//     //         const { progress, rewards } = await service.execute({
//     //             userXPId: userXP.id,
//     //             learningStepId: stepId,
//     //         });

//     //         return reply.send({
//     //             progress,
//     //             rewards,
//     //         });
//     //     } catch (err: any) {
//     //         if (err.message === "UNAUTHORIZED") {
//     //             return reply.status(401).send({ error: "unauthorized" });
//     //         }
//     //         if (err.message === "LEARNING_STEP_NOT_FOUND") {
//     //             return reply.status(404).send({ error: err.message });
//     //         }

//     //         console.error(err);
//     //         return reply.status(500).send({ error: "internal_error" });
//     //     }
//     // }

//     public async completeStep(
//         request: FastifyRequest,
//         reply: FastifyReply,
//     ): Promise<FastifyReply> {
//         try {
//             const { userXP } = await this.getSessionUserXP(request);

//             // 👇 importante: bater com o nome na rota (stepId)
//             const stepId = (request.params as any).stepId as string;

//             const service = container.resolve(CompleteLearningStepService);

//             const { progress, rewards } = await service.execute({
//                 userXPId: userXP.id,
//                 learningStepId: stepId,
//             });

//             return reply.send({ progress, rewards });
//         } catch (err: any) {
//             if (err.message === "UNAUTHORIZED") {
//                 return reply.status(401).send({ error: "unauthorized" });
//             }
//             if (err.message === "LEARNING_STEP_NOT_FOUND") {
//                 return reply.status(404).send({ error: err.message });
//             }
//             console.error(err);
//             return reply.status(500).send({ error: "internal_error" });
//         }
//     }

//     public async getById(
//         request: FastifyRequest,
//         reply: FastifyReply,
//     ): Promise<FastifyReply> {
//         const session = await auth.api.getSession({
//             headers: toWebHeaders(request.headers as any),
//         });

//         if (!session?.user) {
//             return reply.status(401).send({ error: "unauthorized" });
//         }

//         const { id } = request.params as { id: string };

//         const service = container.resolve(GetLearningPathByIdService);
//         const path = await service.execute({ id });

//         if (!path) {
//             return reply.status(404).send({ error: "learning_path_not_found" });
//         }

//         return reply.send(path);
//     }

//     public async markStepCompleted(
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

//         const { stepId } = request.params as { stepId: string };

//         const service = container.resolve(MarkLearningStepCompletedService);

//         try {
//             const progress = await service.execute({
//                 userXPId: userXP.id,
//                 stepId,
//             });

//             return reply.send(progress);
//         } catch (err: any) {
//             if (err instanceof Error && err.message === "LEARNING_STEP_NOT_FOUND") {
//                 return reply.status(404).send({ error: "learning_step_not_found" });
//             }

//             request.log.error({ err }, "Error while marking step as completed");
//             return reply.status(500).send({ error: "internal_server_error" });
//         }
//     }

//     public async getPathProgress(
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

//         const { id } = request.params as { id: string };

//         const service = container.resolve(GetLearningPathProgressService);

//         try {
//             const progress = await service.execute({
//                 userXPId: userXP.id,
//                 learningPathId: id,
//             });

//             return reply.send(progress);
//         } catch (err: any) {
//             if (err instanceof Error && err.message === "LEARNING_PATH_NOT_FOUND") {
//                 return reply.status(404).send({ error: "learning_path_not_found" });
//             }

//             request.log.error({ err }, "Error while getting path progress");
//             return reply.status(500).send({ error: "internal_server_error" });
//         }
//     }
// }

import type { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";
import { container } from "tsyringe";

import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
import { GetRecommendedLearningPathsService } from "@/modules/LearningPaths/services/GetRecommendedLearningPaths.service";
import { GetLearningPathByIdService } from "@/modules/LearningPaths/services/GetLearningPathById.service";
import { GetLearningPathProgressService } from "@/modules/LearningPaths/services/GetLearningPathProgress.service";
import { CompleteLearningStepService } from "@/modules/LearningPaths/services/CompleteLearningStep.service";

export class LearningPathsController {
    // ------------------------
    // Helpers
    // ------------------------
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

    // ------------------------
    // GET /learning-paths/recommended
    // ------------------------
    public async getRecommended(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            const service = container.resolve(GetRecommendedLearningPathsService);
            const result = await service.execute({ userXPId: userXP.id });

            return reply.send({
                hasProfile: true,
                ...result,
            });
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }

            if (err instanceof Error && err.message === "FINANCIAL_PROFILE_NOT_FOUND") {
                return reply.status(200).send({
                    hasProfile: false,
                    message: "User has not completed onboarding quiz yet.",
                    profile: null,
                    recommendedPaths: [],
                });
            }

            request.log.error({ err }, "Error while getting recommended learning paths");
            return reply.status(500).send({ error: "internal_server_error" });
        }
    }

    // ------------------------
    // GET /learning-paths/:id
    // ------------------------
    public async getById(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            return reply.status(401).send({ error: "unauthorized" });
        }

        const { id } = request.params as { id: string };

        const service = container.resolve(GetLearningPathByIdService);
        const path = await service.execute({ id });

        if (!path) {
            return reply.status(404).send({ error: "learning_path_not_found" });
        }

        return reply.send(path);
    }

    // ------------------------
    // GET /learning-paths/:id/progress
    // ------------------------
    public async getPathProgress(
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

        const { id } = request.params as { id: string };

        const service = container.resolve(GetLearningPathProgressService);

        try {
            const progress = await service.execute({
                userXPId: userXP.id,
                learningPathId: id,
            });

            return reply.send(progress);
        } catch (err: any) {
            if (err instanceof Error && err.message === "LEARNING_PATH_NOT_FOUND") {
                return reply.status(404).send({ error: "learning_path_not_found" });
            }

            request.log.error({ err }, "Error while getting path progress");
            return reply.status(500).send({ error: "internal_server_error" });
        }
    }

    // ------------------------
    // POST /learning-paths/steps/:stepId/complete
    // ------------------------
    public async completeStep(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            const stepId = (request.params as any).stepId as string;

            const service = container.resolve(CompleteLearningStepService);

            const { progress, rewards } = await service.execute({
                userXPId: userXP.id,
                learningStepId: stepId,
            });

            return reply.send({ progress, rewards });
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }
            if (err.message === "LEARNING_STEP_NOT_FOUND") {
                return reply.status(404).send({ error: err.message });
            }
            console.error(err);
            return reply.status(500).send({ error: "internal_error" });
        }
    }
}
