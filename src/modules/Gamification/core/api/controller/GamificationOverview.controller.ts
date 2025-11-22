// // src/modules/Gamification/core/api/controller/GamificationOverview.controller.ts
// import type { FastifyRequest, FastifyReply } from "fastify";
// import { container } from "tsyringe";

// import { auth } from "@/lib/auth";
// import { toWebHeaders } from "@/shared/utils/toWebHeaders";

// import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
// import { GetGamificationOverviewService } from "@/modules/Gamification/core/services/GetGamificationOverview.service";

// export class GamificationOverviewController {
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

//     // GET /gamification/overview
//     public async getOverview(
//         request: FastifyRequest,
//         reply: FastifyReply,
//     ): Promise<FastifyReply> {
//         try {
//             const { userXP } = await this.getSessionUserXP(request);

//             const service = container.resolve(GetGamificationOverviewService);
//             const overview = await service.execute({ userXP });

//             return reply.send(overview);
//         } catch (err: any) {
//             if (err.message === "UNAUTHORIZED") {
//                 return reply.status(401).send({ error: "unauthorized" });
//             }

//             return reply.status(500).send({ error: "internal_error" });
//         }
//     }
// }

// src/modules/Gamification/core/api/controller/GamificationOverview.controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { container } from "tsyringe";

import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";
import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
import { GetGamificationOverviewService } from "@/modules/Gamification/core/services/GetGamificationOverview.service";

export class GamificationOverviewController {
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

    // GET /gamification/overview
    public async getOverview(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<FastifyReply> {
        try {
            const { userXP } = await this.getSessionUserXP(request);

            const service = container.resolve(GetGamificationOverviewService);

            const overview = await service.execute({
                userXPId: userXP.id,
            });

            return reply.send(overview);
        } catch (err: any) {
            if (err.message === "UNAUTHORIZED") {
                return reply.status(401).send({ error: "unauthorized" });
            }

            if (err.message === "USER_XP_NOT_FOUND") {
                return reply.status(404).send({ error: "user_xp_not_found" });
            }

            request.log.error(
                { err },
                "[GamificationOverviewController.getOverview] error",
            );

            return reply.status(500).send({ error: "internal_error" });
        }
    }
}
