// // src/server.ts
// import "dotenv/config"; // precisa ser o primeiro
// import "reflect-metadata";
// import "@/shared/container";

// import Fastify from "fastify";
// import fastifyCors from "@fastify/cors";

// import { auth } from "./lib/auth";
// import { userXPRoutes } from "@/modules/UserXP/api/routes/userXP.routes";
// import { onboardingRoutes } from "./modules/Onboarding/api/routes/onboarding.routes";
// import { learningPathsRoutes } from "@/modules/LearningPaths/api/routes/learningPaths.routes";

// async function bootstrap() {
//     const app = Fastify({ logger: true });

//     // CORS – ajuste as origins conforme o front
//     await app.register(fastifyCors, {
//         origin: ["http://localhost:5173", "http://localhost:3000"],
//         credentials: true,
//     });

//     // Healthcheck
//     app.get("/", async () => {
//         return { status: "ok" };
//     });

//     // Rotas de domínio: UserXP (perfil da aplicação)
//     // GET  /user-xp/me
//     // PATCH /user-xp/me
//     app.register(userXPRoutes, {
//         prefix: "/user-xp",
//     });

//     app.register(onboardingRoutes, { prefix: "/onboarding" });

//     app.register(learningPathsRoutes, { prefix: "/learning-paths" });

//     // Rotas do Better Auth: /api/auth/*
//     app.route({
//         method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         url: "/api/auth/*",
//         async handler(request, reply) {
//             try {
//                 const url = new URL(request.url, `http://${request.headers.host}`);

//                 // converte headers do Fastify pra Headers (Fetch API)
//                 const headers = new Headers();
//                 Object.entries(request.headers).forEach(([key, value]) => {
//                     if (value) headers.append(key, String(value));
//                 });

//                 const body =
//                     request.body &&
//                         request.method !== "GET" &&
//                         request.method !== "HEAD"
//                         ? JSON.stringify(request.body)
//                         : undefined;

//                 // Request compatível com o handler do Better Auth
//                 const req = new Request(url.toString(), {
//                     method: request.method,
//                     headers,
//                     body,
//                 });

//                 const response = await auth.handler(req);

//                 // devolve resposta pro cliente
//                 reply.status(response.status);
//                 response.headers.forEach((value, key) => reply.header(key, value));

//                 const text = await response.text();
//                 reply.send(text || null);
//             } catch (error) {
//                 app.log.error({ error }, "Authentication Error");

//                 reply.status(500).send({
//                     error: "Internal authentication error",
//                     code: "AUTH_FAILURE",
//                 });
//             }
//         },
//     });

//     const port = Number(process.env.PORT) || 3000;

//     await app.listen({ port, host: "0.0.0.0" });
//     console.log(`🚀 Server running on http://localhost:${port}`);
// }

// bootstrap().catch((err) => {
//     console.error(err);
//     process.exit(1);
// });

// src/server.ts
import "dotenv/config"; // precisa ser o primeiro
import "reflect-metadata";
import "@/shared/container";

import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { auth } from "./lib/auth";
import { userXPRoutes } from "@/modules/UserXP/api/routes/userXP.routes";
import { onboardingRoutes } from "./modules/Onboarding/api/routes/onboarding.routes";
import { learningPathsRoutes } from "@/modules/LearningPaths/api/routes/learningPaths.routes";
import { goalsRoutes } from "@/modules/Gamification/goals/api/routes/goals.routes"; // 👈 NOVO
import { challengesRoutes } from "./modules/Gamification/challenges/api/routes/challenges.routes";
import { gamificationRoutes } from "@/modules/Gamification/core/api/routes/gamification.routes";


async function bootstrap() {
    const app = Fastify({ logger: true });

    // CORS – ajuste as origins conforme o front
    await app.register(fastifyCors, {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
    });

    // Healthcheck
    app.get("/", async () => {
        return { status: "ok" };
    });

    // Rotas de domínio: UserXP (perfil da aplicação)
    // GET  /user-xp/me
    // PATCH /user-xp/me
    app.register(userXPRoutes, {
        prefix: "/user-xp",
    });

    // Onboarding (quiz)
    app.register(onboardingRoutes, { prefix: "/onboarding" });

    // Trilhas de conhecimento
    app.register(learningPathsRoutes, { prefix: "/learning-paths" });

    // 🎯 Goals / Metas financeiras (gamificação)
    // GET    /gamification/goals/templates
    // GET    /gamification/goals/me
    // POST   /gamification/goals
    // PATCH  /gamification/goals/:id/progress
    app.register(goalsRoutes, { prefix: "/gamification/goals" });

    // 🎯 Goals / Metas financeiras (gamificação)
    // app.register(goalsRoutes, { prefix: "/gamification/goals" });

    // 🏆 Challenges (desafios gamificados)
    app.register(challengesRoutes, { prefix: "/gamification/challenges" });

    // ⭐ Overview de gamificação (dashboard)
    app.register(gamificationRoutes, { prefix: "/gamification" });



    // Rotas do Better Auth: /api/auth/*
    app.route({
        method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        url: "/api/auth/*",
        async handler(request, reply) {
            try {
                const url = new URL(request.url, `http://${request.headers.host}`);

                // converte headers do Fastify pra Headers (Fetch API)
                const headers = new Headers();
                Object.entries(request.headers).forEach(([key, value]) => {
                    if (value) headers.append(key, String(value));
                });

                const body =
                    request.body &&
                        request.method !== "GET" &&
                        request.method !== "HEAD"
                        ? JSON.stringify(request.body)
                        : undefined;

                // Request compatível com o handler do Better Auth
                const req = new Request(url.toString(), {
                    method: request.method,
                    headers,
                    body,
                });

                const response = await auth.handler(req);

                // devolve resposta pro cliente
                reply.status(response.status);
                response.headers.forEach((value, key) => reply.header(key, value));

                const text = await response.text();
                reply.send(text || null);
            } catch (error) {
                app.log.error({ error }, "Authentication Error");

                reply.status(500).send({
                    error: "Internal authentication error",
                    code: "AUTH_FAILURE",
                });
            }
        },
    });

    const port = Number(process.env.PORT) || 3000;

    await app.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
