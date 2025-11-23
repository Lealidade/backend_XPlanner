// src/modules/UserXP/api/routes/userXP.routes.ts
import type { FastifyInstance } from "fastify";
import { UserXPController } from "@/modules/UserXP/api/controller/UserXP.controller";

export async function userXPRoutes(app: FastifyInstance) {
    const controller = new UserXPController();

    // /user-xp/me
    app.get("/me", (request, reply) => controller.me(request, reply));

    // /user-xp/me (update)
    app.patch("/me", (request, reply) => controller.updateMe(request, reply));

}
