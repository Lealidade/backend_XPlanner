import type { FastifyRequest, FastifyReply } from "fastify";
import { auth } from "@/lib/auth";
import { toWebHeaders } from "@/shared/utils/toWebHeaders";
import { container } from "tsyringe";

import { GetOrCreateUserXPService } from "@/modules/UserXP/services/GetOrCreateUserXP.service";
import { UpdateUserXPService } from "@/modules/UserXP/services/UpdateUserXP.service";
import {
    updateUserXPBodySchema,
    type UpdateUserXPBody,
} from "@/modules/UserXP/api/validators/updateUserXP.schema";

export class UserXPController {
    public async me(request: FastifyRequest, reply: FastifyReply) {
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

        return reply.send({
            user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            },
            userXP,
        });
    }

    public async updateMe(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const session = await auth.api.getSession({
            headers: toWebHeaders(request.headers as any),
        });

        if (!session?.user) {
            return reply.status(401).send({ error: "unauthorized" });
        }

        let body: UpdateUserXPBody;

        try {
            body = updateUserXPBodySchema.parse(request.body);
        } catch (err) {
            const zodError = err as any;

            return reply.status(400).send({
                message: "Validation error",
                errors: zodError.errors ?? zodError,
            });
        }

        const updateUserXPService = container.resolve(UpdateUserXPService);

        const userXP = await updateUserXPService.execute({
            userId: session.user.id,
            username: body.username ?? undefined,
            birthYear: body.birthYear ?? undefined,
        });

        return reply.send({ userXP });
    }
}
