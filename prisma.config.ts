// import { defineConfig, env } from "prisma/config";
// import "dotenv/config";

// export default defineConfig({
//   // schema: "prisma/schema.prisma",
//   schema: "prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   engine: "classic",
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });

// prisma.config.ts
// import "dotenv/config";
// import path from "node:path";
// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: path.join("prisma", "schema.prisma"),
//   migrations: {
//     path: path.join("prisma", "migrations"),
//     // 👇 aqui é o importante: mandando rodar o seed com tsx
//     seed: "tsx prisma/seed.ts",
//   }
// });

// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // 👇 diz pro Prisma: use TODOS os .prisma dentro da pasta prisma/
  schema: "prisma",

  migrations: {
    path: "prisma/migrations",
    // comando pra rodar o seed
    seed: "tsx prisma/seed.ts",
  },

  engine: "classic",

  datasource: {
    url: env("DATABASE_URL"),
  },
});
