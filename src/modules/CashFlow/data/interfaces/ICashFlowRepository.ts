// // // // // // // src/modules/CashFlow/data/interfaces/ICashFlowRepository.ts
// // // // // // import type {
// // // // // //     CashFlow,
// // // // // //     FinancialDimension,
// // // // // //     CashFlowOperation,
// // // // // // } from "@/generated/prisma/client";

// // // // // // export interface CashFlowListFilter {
// // // // // //     userXPId: string;
// // // // // //     month?: number; // 1-12
// // // // // //     year?: number;  // ex: 2025
// // // // // // }

// // // // // // export interface CreateCashFlowInput {
// // // // // //     userXPId: string;
// // // // // //     date: Date;
// // // // // //     description: string;
// // // // // //     category: string;
// // // // // //     dimension?: FinancialDimension | null;
// // // // // //     operation: CashFlowOperation;
// // // // // //     amount: number; // em centavos (ex: 500000 = R$ 5.000,00)
// // // // // // }

// // // // // // export interface ICashFlowRepository {
// // // // // //     create(data: CreateCashFlowInput): Promise<CashFlow>;
// // // // // //     listByUserAndPeriod(filter: CashFlowListFilter): Promise<CashFlow[]>;
// // // // // // }

// // // // // // src/modules/CashFlow/data/interfaces/ICashFlowRepository.ts
// // // // // import type {
// // // // //     CashFlow,
// // // // //     FinancialDimension,
// // // // //     CashFlowOperation,
// // // // // } from "@/generated/prisma/client";

// // // // // export interface CashFlowListFilter {
// // // // //     userXPId: string;
// // // // //     month?: number; // 1-12
// // // // //     year?: number;  // ex: 2025
// // // // // }

// // // // // export interface CreateCashFlowInput {
// // // // //     userXPId: string;
// // // // //     date: Date;
// // // // //     description: string;
// // // // //     category: string;
// // // // //     dimension?: FinancialDimension | null;
// // // // //     operation: CashFlowOperation;
// // // // //     amount: number; // em centavos
// // // // // }

// // // // // export interface ICashFlowRepository {
// // // // //     create(data: CreateCashFlowInput): Promise<CashFlow>;
// // // // //     listByUserAndPeriod(filter: CashFlowListFilter): Promise<CashFlow[]>;
// // // // // }

// // // // // src/modules/CashFlow/data/interfaces/ICashFlowRepository.ts
// // // // import type {
// // // //     CashFlow,
// // // //     FinancialDimension,
// // // //     CashFlowOperation,
// // // // } from "@/generated/prisma/client";

// // // // export interface CashFlowListFilter {
// // // //     userXPId: string;
// // // //     month?: number; // 1-12
// // // //     year?: number;  // ex: 2025
// // // // }

// // // // export interface CreateCashFlowInput {
// // // //     userXPId: string;
// // // //     date: Date;
// // // //     label: string;        // 👈 trocamos description -> label
// // // //     category: string;
// // // //     dimension?: FinancialDimension | null;
// // // //     operation: CashFlowOperation;
// // // //     amount: number;       // em centavos
// // // // }

// // // // export interface ICashFlowRepository {
// // // //     create(data: CreateCashFlowInput): Promise<CashFlow>;
// // // //     listByUserAndPeriod(filter: CashFlowListFilter): Promise<CashFlow[]>;
// // // // }

// // // // src/modules/CashFlow/data/interfaces/ICashFlowRepository.ts
// // // import type { CashFlow, CashFlowOperation } from "@/generated/prisma/client";

// // // export interface CashFlowListFilter {
// // //     userXPId: string;
// // //     month?: number; // 1-12
// // //     year?: number;  // ex: 2025
// // // }

// // // export interface CreateCashFlowInput {
// // //     userXPId: string;
// // //     date?: Date;          // opcional -> se não vier, Prisma usa default(now())
// // //     operation: CashFlowOperation;

// // //     value: number;        // 👈 bate com o schema
// // //     label: string;
// // //     category: string;
// // //     recipient?: string | null;

// // //     userGoalId?: string | null; // opcional, se o fluxo estiver ligado a uma meta
// // // }

// // // export interface ICashFlowRepository {
// // //     create(data: CreateCashFlowInput): Promise<CashFlow>;
// // //     listByUserAndPeriod(filter: CashFlowListFilter): Promise<CashFlow[]>;
// // // }

// // // src/modules/CashFlow/data/interfaces/ICashFlowRepository.ts
// // import type { CashFlow, CashFlowOperation } from "@/generated/prisma/client";

// // export interface CashFlowListFilter {
// //     userXPId: string;
// //     month?: number; // 1-12
// //     year?: number;  // ex: 2025
// // }

// // export interface CreateCashFlowInput {
// //     userXPId: string;
// //     date: Date;
// //     label: string;              // 👈 label
// //     category: string;
// //     operation: CashFlowOperation;
// //     value: number;              // 👈 value (igual ao Prisma)
// // }

// // export interface ICashFlowRepository {
// //     create(data: CreateCashFlowInput): Promise<CashFlow>;
// //     listByUserAndPeriod(filter: CashFlowListFilter): Promise<CashFlow[]>;
// // }

// import type {
//     CashFlow,
//     UserGoal,
//     CashFlowOperation,
// } from "@/generated/prisma/client";

// export interface CashFlowListFilter {
//     userXPId: string;
//     month?: number; // 1-12
//     year?: number;  // ex: 2025
// }

// // input pra criação de um lançamento
// export interface CreateCashFlowInput {
//     userXPId: string;
//     date: Date;
//     label: string;
//     category: string;
//     operation: CashFlowOperation;
//     value: number;            // 👈 agora alinha com o Prisma
//     userGoalId?: string | null;
//     recipient?: string | null;
// }

// // tipo auxiliar: CashFlow já vindo com a meta (se tiver)
// export type CashFlowWithGoal = CashFlow & {
//     userGoal: UserGoal | null;
// };

// export interface ICashFlowRepository {
//     create(data: CreateCashFlowInput): Promise<CashFlow>;
//     listByUserAndPeriod(filter: CashFlowListFilter): Promise<CashFlowWithGoal[]>;
// }

// import type {
//     CashFlow,
//     CashFlowOperation,
//     UserGoal,
//     Goal,
// } from "@/generated/prisma/client";

// export interface CashFlowListFilter {
//     userXPId: string;
//     month?: number; // 1-12
//     year?: number;  // ex: 2025
// }

// export interface CreateCashFlowInput {
//     userXPId: string;
//     date: Date;
//     label: string;
//     category: string;
//     operation: CashFlowOperation;
//     amount: number;       // vamos gravar em CashFlow.value
//     userGoalId?: string | null;
//     recipient?: string | null;
// }

// // 👇 tipo que já vem com a meta e o Goal carregados
// export type CashFlowWithRelations = CashFlow & {
//     userGoal: (UserGoal & { goal: Goal | null }) | null;
// };

// export interface ICashFlowRepository {
//     create(data: CreateCashFlowInput): Promise<CashFlow>;
//     listByUserAndPeriod(filter: CashFlowListFilter): Promise<CashFlowWithRelations[]>;
// }

// ----------

import type {
    CashFlow,
    CashFlowOperation,
    UserGoal,
    Goal,
} from "@/generated/prisma/client";

export interface CashFlowListFilter {
    userXPId: string;
    month?: number; // 1-12
    year?: number;  // ex: 2025
}

export interface CreateCashFlowInput {
    userXPId: string;
    date: Date;
    label: string;
    category: string;
    operation: CashFlowOperation;
    amount: number;       // será gravado em CashFlow.value
    userGoalId?: string | null;
    recipient?: string | null;
}

// tipo que já vem com a meta e o Goal carregados
export type CashFlowWithRelations = CashFlow & {
    userGoal: (UserGoal & { goal: Goal | null }) | null;
};

export interface ICashFlowRepository {
    create(data: CreateCashFlowInput): Promise<CashFlow>;
    listByUserAndPeriod(
        filter: CashFlowListFilter,
    ): Promise<CashFlowWithRelations[]>;
}
