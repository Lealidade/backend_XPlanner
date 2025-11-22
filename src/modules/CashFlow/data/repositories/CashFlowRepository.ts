// // // // // // // src/modules/CashFlow/data/repositories/CashFlowRepository.ts
// // // // // // import { prisma } from "@/database/prismaClient";
// // // // // // import type { CashFlow } from "@/generated/prisma/client";

// // // // // // import type {
// // // // // //     ICashFlowRepository,
// // // // // //     CreateCashFlowInput,
// // // // // //     CashFlowListFilter,
// // // // // // } from "../interfaces/ICashFlowRepository";

// // // // // // export class CashFlowRepository implements ICashFlowRepository {
// // // // // //     async create(data: CreateCashFlowInput): Promise<CashFlow> {
// // // // // //         return prisma.cashFlow.create({ data });
// // // // // //     }

// // // // // //     async listByUserAndPeriod({
// // // // // //         userXPId,
// // // // // //         month,
// // // // // //         year,
// // // // // //     }: CashFlowListFilter): Promise<CashFlow[]> {
// // // // // //         const where: any = { userXPId };

// // // // // //         if (month && year) {
// // // // // //             const start = new Date(year, month - 1, 1); // mês 0-based
// // // // // //             const end = new Date(year, month, 1);

// // // // // //             where.date = {
// // // // // //                 gte: start,
// // // // // //                 lt: end,
// // // // // //             };
// // // // // //         }

// // // // // //         return prisma.cashFlow.findMany({
// // // // // //             where,
// // // // // //             orderBy: { date: "asc" },
// // // // // //         });
// // // // // //     }
// // // // // // }

// // // // // // src/modules/CashFlow/data/repositories/CashFlowRepository.ts
// // // // // import { prisma } from "@/database/prismaClient";
// // // // // import type { CashFlow } from "@/generated/prisma/client";

// // // // // import type {
// // // // //     ICashFlowRepository,
// // // // //     CreateCashFlowInput,
// // // // //     CashFlowListFilter,
// // // // // } from "../interfaces/ICashFlowRepository";

// // // // // export class CashFlowRepository implements ICashFlowRepository {
// // // // //     async create(data: CreateCashFlowInput): Promise<CashFlow> {
// // // // //         return prisma.cashFlow.create({
// // // // //             data: {
// // // // //                 userXPId: data.userXPId,
// // // // //                 date: data.date,
// // // // //                 description: data.description,
// // // // //                 category: data.category,
// // // // //                 // dimension é opcional → se vier undefined/null, não envia
// // // // //                 dimension: data.dimension ?? undefined,
// // // // //                 operation: data.operation,
// // // // //                 amount: data.amount,
// // // // //             },
// // // // //         });
// // // // //     }

// // // // //     async listByUserAndPeriod({
// // // // //         userXPId,
// // // // //         month,
// // // // //         year,
// // // // //     }: CashFlowListFilter): Promise<CashFlow[]> {
// // // // //         const where: any = { userXPId };

// // // // //         if (month && year) {
// // // // //             const start = new Date(year, month - 1, 1); // mês 0-based
// // // // //             const end = new Date(year, month, 1);

// // // // //             where.date = {
// // // // //                 gte: start,
// // // // //                 lt: end,
// // // // //             };
// // // // //         }

// // // // //         return prisma.cashFlow.findMany({
// // // // //             where,
// // // // //             orderBy: { date: "asc" },
// // // // //         });
// // // // //     }
// // // // // }

// // // // // src/modules/CashFlow/data/repositories/CashFlowRepository.ts
// // // // import { prisma } from "@/database/prismaClient";
// // // // import type { CashFlow } from "@/generated/prisma/client";

// // // // import type {
// // // //     ICashFlowRepository,
// // // //     CreateCashFlowInput,
// // // //     CashFlowListFilter,
// // // // } from "../interfaces/ICashFlowRepository";

// // // // export class CashFlowRepository implements ICashFlowRepository {
// // // //     async create(data: CreateCashFlowInput): Promise<CashFlow> {
// // // //         return prisma.cashFlow.create({
// // // //             data: {
// // // //                 userXPId: data.userXPId,
// // // //                 date: data.date,
// // // //                 label: data.label,                        // 👈 aqui é label
// // // //                 category: data.category,
// // // //                 // dimension é opcional → só manda se não for null/undefined
// // // //                 dimension: data.dimension ?? undefined,
// // // //                 operation: data.operation,
// // // //                 amount: data.amount,
// // // //             },
// // // //         });
// // // //     }

// // // //     async listByUserAndPeriod({
// // // //         userXPId,
// // // //         month,
// // // //         year,
// // // //     }: CashFlowListFilter): Promise<CashFlow[]> {
// // // //         const where: any = { userXPId };

// // // //         if (month && year) {
// // // //             const start = new Date(year, month - 1, 1); // mês 0-based
// // // //             const end = new Date(year, month, 1);

// // // //             where.date = {
// // // //                 gte: start,
// // // //                 lt: end,
// // // //             };
// // // //         }

// // // //         return prisma.cashFlow.findMany({
// // // //             where,
// // // //             orderBy: { date: "asc" },
// // // //         });
// // // //     }
// // // // }

// // // // src/modules/CashFlow/data/repositories/CashFlowRepository.ts
// // // import { prisma } from "@/database/prismaClient";
// // // import type { CashFlow } from "@/generated/prisma/client";

// // // import type {
// // //     ICashFlowRepository,
// // //     CreateCashFlowInput,
// // //     CashFlowListFilter,
// // // } from "../interfaces/ICashFlowRepository";

// // // export class CashFlowRepository implements ICashFlowRepository {
// // //     async create(data: CreateCashFlowInput): Promise<CashFlow> {
// // //         return prisma.cashFlow.create({
// // //             data: {
// // //                 userXPId: data.userXPId,
// // //                 // se não vier date, deixa o Prisma usar o default(now())
// // //                 date: data.date ?? undefined,
// // //                 operation: data.operation,

// // //                 value: data.value,
// // //                 label: data.label,
// // //                 category: data.category,
// // //                 recipient: data.recipient ?? undefined,

// // //                 userGoalId: data.userGoalId ?? undefined,
// // //             },
// // //         });
// // //     }

// // //     async listByUserAndPeriod({
// // //         userXPId,
// // //         month,
// // //         year,
// // //     }: CashFlowListFilter): Promise<CashFlow[]> {
// // //         const where: any = { userXPId };

// // //         if (month && year) {
// // //             const start = new Date(year, month - 1, 1); // mês 0-based
// // //             const end = new Date(year, month, 1);

// // //             where.date = {
// // //                 gte: start,
// // //                 lt: end,
// // //             };
// // //         }

// // //         return prisma.cashFlow.findMany({
// // //             where,
// // //             orderBy: { date: "asc" },
// // //         });
// // //     }
// // // }

// // // src/modules/CashFlow/data/repositories/CashFlowRepository.ts
// // import { prisma } from "@/database/prismaClient";
// // import type { CashFlow } from "@/generated/prisma/client";
// // import type {
// //     ICashFlowRepository,
// //     CreateCashFlowInput,
// //     CashFlowListFilter,
// // } from "../interfaces/ICashFlowRepository";

// // export class CashFlowRepository implements ICashFlowRepository {
// //     async create(data: CreateCashFlowInput): Promise<CashFlow> {
// //         return prisma.cashFlow.create({
// //             data: {
// //                 userXPId: data.userXPId,
// //                 date: data.date,
// //                 label: data.label,
// //                 category: data.category,
// //                 operation: data.operation,
// //                 value: data.value,
// //             },
// //         });
// //     }

// //     async listByUserAndPeriod({
// //         userXPId,
// //         month,
// //         year,
// //     }: CashFlowListFilter): Promise<CashFlow[]> {
// //         const where: any = { userXPId };

// //         if (month && year) {
// //             const start = new Date(year, month - 1, 1); // mês 0-based
// //             const end = new Date(year, month, 1);

// //             where.date = { gte: start, lt: end };
// //         }

// //         return prisma.cashFlow.findMany({
// //             where,
// //             orderBy: { date: "asc" },
// //         });
// //     }
// // }

// import { prisma } from "@/database/prismaClient";
// import type {
//     ICashFlowRepository,
//     CreateCashFlowInput,
//     CashFlowListFilter,
//     CashFlowWithGoal,
// } from "../interfaces/ICashFlowRepository";

// export class CashFlowRepository implements ICashFlowRepository {
//     async create(data: CreateCashFlowInput) {
//         // campos batendo 1:1 com o model CashFlow
//         return prisma.cashFlow.create({
//             data: {
//                 userXPId: data.userXPId,
//                 date: data.date,
//                 label: data.label,
//                 category: data.category,
//                 operation: data.operation,
//                 value: data.value,
//                 userGoalId: data.userGoalId ?? null,
//                 recipient: data.recipient ?? null,
//             },
//         });
//     }

//     async listByUserAndPeriod({
//         userXPId,
//         month,
//         year,
//     }: CashFlowListFilter): Promise<CashFlowWithGoal[]> {
//         const where: any = { userXPId };

//         if (month && year) {
//             const start = new Date(year, month - 1, 1); // mês 0-based
//             const end = new Date(year, month, 1);

//             where.date = {
//                 gte: start,
//                 lt: end,
//             };
//         }

//         return prisma.cashFlow.findMany({
//             where,
//             orderBy: { date: "asc" },
//             include: {
//                 userGoal: true, // 👈 precisamos disso pra enxergar a dimensão
//             },
//         });
//     }
// }

// import { prisma } from "@/database/prismaClient";
// import type { CashFlow } from "@/generated/prisma/client";

// import type {
//     ICashFlowRepository,
//     CreateCashFlowInput,
//     CashFlowListFilter,
//     CashFlowWithRelations,
// } from "../interfaces/ICashFlowRepository";

// export class CashFlowRepository implements ICashFlowRepository {
//     async create(data: CreateCashFlowInput): Promise<CashFlow> {
//         return prisma.cashFlow.create({
//             data: {
//                 userXPId: data.userXPId,
//                 date: data.date,
//                 value: data.amount,              // 👈 gravando no campo `value`
//                 label: data.label,
//                 category: data.category,
//                 operation: data.operation,
//                 userGoalId: data.userGoalId ?? null,
//                 recipient: data.recipient ?? null,
//             },
//         });
//     }

//     async listByUserAndPeriod({
//         userXPId,
//         month,
//         year,
//     }: CashFlowListFilter): Promise<CashFlowWithRelations[]> {
//         const where: any = { userXPId };

//         if (month && year) {
//             const start = new Date(year, month - 1, 1); // mês 0-based
//             const end = new Date(year, month, 1);

//             where.date = {
//                 gte: start,
//                 lt: end,
//             };
//         }

//         return prisma.cashFlow.findMany({
//             where,
//             orderBy: { date: "asc" },
//             include: {
//                 userGoal: {
//                     include: {
//                         goal: true,   // 👈 aqui trazemos o Goal (que tem goalDimension)
//                     },
//                 },
//             },
//         });
//     }
// }

// -------------

import { prisma } from "@/database/prismaClient";
import type { CashFlow } from "@/generated/prisma/client";

import type {
    ICashFlowRepository,
    CreateCashFlowInput,
    CashFlowListFilter,
    CashFlowWithRelations,
} from "../interfaces/ICashFlowRepository";

export class CashFlowRepository implements ICashFlowRepository {
    async create(data: CreateCashFlowInput): Promise<CashFlow> {
        return prisma.cashFlow.create({
            data: {
                userXPId: data.userXPId,
                date: data.date,
                value: data.amount,  // gravando no campo `value`
                label: data.label,
                category: data.category,
                operation: data.operation,
                userGoalId: data.userGoalId ?? null,
                recipient: data.recipient ?? null,
            },
        });
    }

    async listByUserAndPeriod({
        userXPId,
        month,
        year,
    }: CashFlowListFilter): Promise<CashFlowWithRelations[]> {
        const where: any = { userXPId };

        if (month && year) {
            const start = new Date(year, month - 1, 1); // mês 0-based
            const end = new Date(year, month, 1);

            where.date = {
                gte: start,
                lt: end,
            };
        }

        return prisma.cashFlow.findMany({
            where,
            orderBy: { date: "asc" },
            include: {
                userGoal: {
                    include: {
                        goal: true,   // traz o Goal (que tem a dimensão financeira)
                    },
                },
            },
        });
    }
}
