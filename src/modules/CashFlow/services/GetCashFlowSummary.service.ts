// // // // // // src/modules/CashFlow/core/services/GetCashFlowSummary.service.ts
// // // // // import { inject, injectable } from "tsyringe";
// // // // // import {
// // // // //     CashFlowOperation,
// // // // //     type FinancialDimension,
// // // // // } from "@/generated/prisma/client";

// // // // // import type {
// // // // //     ICashFlowRepository,
// // // // // } from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";

// // // // // interface IRequest {
// // // // //     userXPId: string;
// // // // //     month?: number;
// // // // //     year?: number;
// // // // // }

// // // // // interface CategorySummary {
// // // // //     category: string;
// // // // //     income: number;
// // // // //     expense: number;
// // // // // }

// // // // // interface DimensionSummary {
// // // // //     dimension: FinancialDimension;
// // // // //     income: number;
// // // // //     expense: number;
// // // // // }

// // // // // interface IResponse {
// // // // //     period: {
// // // // //         month: number;
// // // // //         year: number;
// // // // //     };
// // // // //     totals: {
// // // // //         income: number;
// // // // //         expense: number;
// // // // //         netBalance: number;
// // // // //     };
// // // // //     byCategory: CategorySummary[];
// // // // //     byDimension: DimensionSummary[];
// // // // // }

// // // // // @injectable()
// // // // // export class GetCashFlowSummaryService {
// // // // //     constructor(
// // // // //         @inject("CashFlowRepository")
// // // // //         private cashFlowRepository: ICashFlowRepository,
// // // // //     ) { }

// // // // //     async execute({ userXPId, month, year }: IRequest): Promise<IResponse> {
// // // // //         const now = new Date();
// // // // //         const targetMonth = month ?? now.getMonth() + 1;
// // // // //         const targetYear = year ?? now.getFullYear();

// // // // //         const flows = await this.cashFlowRepository.listByUserAndPeriod({
// // // // //             userXPId,
// // // // //             month: targetMonth,
// // // // //             year: targetYear,
// // // // //         });

// // // // //         let income = 0;
// // // // //         let expense = 0;

// // // // //         const byCategoryMap = new Map<string, { income: number; expense: number }>();
// // // // //         const byDimensionMap = new Map<
// // // // //             FinancialDimension,
// // // // //             { income: number; expense: number }
// // // // //         >();

// // // // //         for (const flow of flows) {
// // // // //             const isIncome = flow.operation === CashFlowOperation.INCOME;
// // // // //             const value = flow.amount;

// // // // //             if (isIncome) income += value;
// // // // //             else expense += value;

// // // // //             // --- por categoria ---
// // // // //             const category = flow.category || "Outros";
// // // // //             const catAgg = byCategoryMap.get(category) ?? { income: 0, expense: 0 };

// // // // //             if (isIncome) catAgg.income += value;
// // // // //             else catAgg.expense += value;

// // // // //             byCategoryMap.set(category, catAgg);

// // // // //             // --- por dimensão financeira (se tiver) ---
// // // // //             if (flow.dimension) {
// // // // //                 const dimAgg =
// // // // //                     byDimensionMap.get(flow.dimension) ?? { income: 0, expense: 0 };

// // // // //                 if (isIncome) dimAgg.income += value;
// // // // //                 else dimAgg.expense += value;

// // // // //                 byDimensionMap.set(flow.dimension, dimAgg);
// // // // //             }
// // // // //         }

// // // // //         const netBalance = income - expense;

// // // // //         const byCategory: CategorySummary[] = Array.from(
// // // // //             byCategoryMap.entries(),
// // // // //         ).map(([category, agg]) => ({
// // // // //             category,
// // // // //             income: agg.income,
// // // // //             expense: agg.expense,
// // // // //         }));

// // // // //         const byDimension: DimensionSummary[] = Array.from(
// // // // //             byDimensionMap.entries(),
// // // // //         ).map(([dimension, agg]) => ({
// // // // //             dimension,
// // // // //             income: agg.income,
// // // // //             expense: agg.expense,
// // // // //         }));

// // // // //         return {
// // // // //             period: {
// // // // //                 month: targetMonth,
// // // // //                 year: targetYear,
// // // // //             },
// // // // //             totals: {
// // // // //                 income,
// // // // //                 expense,
// // // // //                 netBalance,
// // // // //             },
// // // // //             byCategory,
// // // // //             byDimension,
// // // // //         };
// // // // //     }
// // // // // }

// // // // import { inject, injectable } from "tsyringe";
// // // // import {
// // // //     CashFlowOperation,
// // // //     type FinancialDimension,
// // // // } from "@/generated/prisma/client";
// // // // import type { ICashFlowRepository } from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";

// // // // interface IRequest {
// // // //     userXPId: string;
// // // //     month?: number;
// // // //     year?: number;
// // // // }

// // // // interface CategorySummary {
// // // //     category: string;
// // // //     income: number;
// // // //     expense: number;
// // // // }

// // // // interface DimensionSummary {
// // // //     dimension: FinancialDimension;
// // // //     income: number;
// // // //     expense: number;
// // // // }

// // // // interface IResponse {
// // // //     period: {
// // // //         month: number;
// // // //         year: number;
// // // //     };
// // // //     totals: {
// // // //         income: number;
// // // //         expense: number;
// // // //         netBalance: number;
// // // //     };
// // // //     byCategory: CategorySummary[];
// // // //     byDimension: DimensionSummary[];
// // // // }

// // // // @injectable()
// // // // export class GetCashFlowSummaryService {
// // // //     constructor(
// // // //         @inject("CashFlowRepository")
// // // //         private cashFlowRepository: ICashFlowRepository,
// // // //     ) { }

// // // //     async execute({ userXPId, month, year }: IRequest): Promise<IResponse> {
// // // //         const now = new Date();
// // // //         const targetMonth = month ?? now.getMonth() + 1;
// // // //         const targetYear = year ?? now.getFullYear();

// // // //         const flows = await this.cashFlowRepository.listByUserAndPeriod({
// // // //             userXPId,
// // // //             month: targetMonth,
// // // //             year: targetYear,
// // // //         });

// // // //         let income = 0;
// // // //         let expense = 0;

// // // //         const byCategoryMap = new Map<string, { income: number; expense: number }>();
// // // //         const byDimensionMap = new Map<
// // // //             FinancialDimension,
// // // //             { income: number; expense: number }
// // // //         >();

// // // //         for (const flow of flows) {
// // // //             const isIncome = flow.operation === CashFlowOperation.INCOME;
// // // //             const value = flow.value; // 👈 agora bate com o model

// // // //             if (isIncome) income += value;
// // // //             else expense += value;

// // // //             // --- por categoria ---
// // // //             const category = flow.category || "Outros";
// // // //             const catAgg = byCategoryMap.get(category) ?? { income: 0, expense: 0 };

// // // //             if (isIncome) catAgg.income += value;
// // // //             else catAgg.expense += value;

// // // //             byCategoryMap.set(category, catAgg);

// // // //             // --- por dimensão financeira via meta, se houver ---
// // // //             const dimension = flow.userGoal?.goalDimension;
// // // //             if (dimension) {
// // // //                 const dimAgg = byDimensionMap.get(dimension) ?? {
// // // //                     income: 0,
// // // //                     expense: 0,
// // // //                 };

// // // //                 if (isIncome) dimAgg.income += value;
// // // //                 else dimAgg.expense += value;

// // // //                 byDimensionMap.set(dimension, dimAgg);
// // // //             }
// // // //         }

// // // //         const netBalance = income - expense;

// // // //         const byCategory: CategorySummary[] = Array.from(
// // // //             byCategoryMap.entries(),
// // // //         ).map(([category, agg]) => ({
// // // //             category,
// // // //             income: agg.income,
// // // //             expense: agg.expense,
// // // //         }));

// // // //         const byDimension: DimensionSummary[] = Array.from(
// // // //             byDimensionMap.entries(),
// // // //         ).map(([dimension, agg]) => ({
// // // //             dimension,
// // // //             income: agg.income,
// // // //             expense: agg.expense,
// // // //         }));

// // // //         return {
// // // //             period: {
// // // //                 month: targetMonth,
// // // //                 year: targetYear,
// // // //             },
// // // //             totals: {
// // // //                 income,
// // // //                 expense,
// // // //                 netBalance,
// // // //             },
// // // //             byCategory,
// // // //             byDimension,
// // // //         };
// // // //     }
// // // // }

// // // import { inject, injectable } from "tsyringe";
// // // import {
// // //     CashFlowOperation,
// // //     type FinancialDimension,
// // // } from "@/generated/prisma/client";

// // // import type { ICashFlowRepository } from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";

// // // interface IRequest {
// // //     userXPId: string;
// // //     month?: number;
// // //     year?: number;
// // // }

// // // interface CategorySummary {
// // //     category: string;
// // //     income: number;
// // //     expense: number;
// // // }

// // // interface DimensionSummary {
// // //     dimension: FinancialDimension;
// // //     income: number;
// // //     expense: number;
// // // }

// // // interface IResponse {
// // //     period: {
// // //         month: number;
// // //         year: number;
// // //     };
// // //     totals: {
// // //         income: number;
// // //         expense: number;
// // //         netBalance: number;
// // //     };
// // //     byCategory: CategorySummary[];
// // //     byDimension: DimensionSummary[];
// // // }

// // // @injectable()
// // // export class GetCashFlowSummaryService {
// // //     constructor(
// // //         @inject("CashFlowRepository")
// // //         private cashFlowRepository: ICashFlowRepository,
// // //     ) { }

// // //     async execute({ userXPId, month, year }: IRequest): Promise<IResponse> {
// // //         const now = new Date();
// // //         const targetMonth = month ?? now.getMonth() + 1;
// // //         const targetYear = year ?? now.getFullYear();

// // //         const flows = await this.cashFlowRepository.listByUserAndPeriod({
// // //             userXPId,
// // //             month: targetMonth,
// // //             year: targetYear,
// // //         });

// // //         let income = 0;
// // //         let expense = 0;

// // //         const byCategoryMap = new Map<string, { income: number; expense: number }>();
// // //         const byDimensionMap = new Map<
// // //             FinancialDimension,
// // //             { income: number; expense: number }
// // //         >();

// // //         for (const flow of flows) {
// // //             const isIncome = flow.operation === CashFlowOperation.INCOME;
// // //             const value = flow.value; // 👈 campo do model

// // //             if (isIncome) income += value;
// // //             else expense += value;

// // //             // --- por categoria ---
// // //             const category = flow.category || "Outros";
// // //             const catAgg = byCategoryMap.get(category) ?? { income: 0, expense: 0 };

// // //             if (isIncome) catAgg.income += value;
// // //             else catAgg.expense += value;

// // //             byCategoryMap.set(category, catAgg);

// // //             // // --- por dimensão financeira via meta (Goal) ---
// // //             // const dimension = flow.userGoal?.goal?.goalDimension;
// // //             // if (dimension) {
// // //             //     const dimAgg =
// // //             //         byDimensionMap.get(dimension) ?? { income: 0, expense: 0 };

// // //             //     if (isIncome) dimAgg.income += value;
// // //             //     else dimAgg.expense += value;

// // //             //     byDimensionMap.set(dimension, dimAgg);
// // //             // }

// // //             // --- por dimensão financeira via meta (UserGoal) ---
// // //             const dimension = flow.userGoal?.dimension; // 👈 nome certo do campo

// // //             if (dimension) {
// // //                 const dimAgg =
// // //                     byDimensionMap.get(dimension) ?? { income: 0, expense: 0 };

// // //                 if (isIncome) dimAgg.income += value;
// // //                 else dimAgg.expense += value;

// // //                 byDimensionMap.set(dimension, dimAgg);
// // //             }
// // //         }

// // //         const netBalance = income - expense;

// // //         const byCategory: CategorySummary[] = Array.from(byCategoryMap.entries()).map(
// // //             ([category, agg]) => ({
// // //                 category,
// // //                 income: agg.income,
// // //                 expense: agg.expense,
// // //             }),
// // //         );

// // //         const byDimension: DimensionSummary[] = Array.from(
// // //             byDimensionMap.entries(),
// // //         ).map(([dimension, agg]) => ({
// // //             dimension,
// // //             income: agg.income,
// // //             expense: agg.expense,
// // //         }));

// // //         return {
// // //             period: {
// // //                 month: targetMonth,
// // //                 year: targetYear,
// // //             },
// // //             totals: {
// // //                 income,
// // //                 expense,
// // //                 netBalance,
// // //             },
// // //             byCategory,
// // //             byDimension,
// // //         };
// // //     }
// // // }

// // // src/modules/CashFlow/services/GetCashFlowSummary.service.ts
// // import { inject, injectable } from "tsyringe";
// // import {
// //     CashFlowOperation,
// //     type FinancialDimension,
// // } from "@/generated/prisma/client";

// // import type { ICashFlowRepository } from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";

// // interface IRequest {
// //     userXPId: string;
// //     month?: number;
// //     year?: number;
// // }

// // interface CategorySummary {
// //     category: string;
// //     income: number;
// //     expense: number;
// // }

// // interface DimensionSummary {
// //     dimension: FinancialDimension;
// //     income: number;
// //     expense: number;
// // }

// // interface IResponse {
// //     period: {
// //         month: number;
// //         year: number;
// //     };
// //     totals: {
// //         income: number;
// //         expense: number;
// //         netBalance: number;
// //     };
// //     byCategory: CategorySummary[];
// //     byDimension: DimensionSummary[];
// // }

// // @injectable()
// // export class GetCashFlowSummaryService {
// //     constructor(
// //         @inject("CashFlowRepository")
// //         private cashFlowRepository: ICashFlowRepository,
// //     ) { }

// //     async execute({ userXPId, month, year }: IRequest): Promise<IResponse> {
// //         const now = new Date();
// //         const targetMonth = month ?? now.getMonth() + 1;
// //         const targetYear = year ?? now.getFullYear();

// //         const flows = await this.cashFlowRepository.listByUserAndPeriod({
// //             userXPId,
// //             month: targetMonth,
// //             year: targetYear,
// //         });

// //         let income = 0;
// //         let expense = 0;

// //         const byCategoryMap = new Map<string, { income: number; expense: number }>();
// //         const byDimensionMap = new Map<
// //             FinancialDimension,
// //             { income: number; expense: number }
// //         >();

// //         for (const flow of flows) {
// //             const isIncome = flow.operation === CashFlowOperation.INCOME;
// //             const value = flow.value; // campo do model CashFlow

// //             if (isIncome) income += value;
// //             else expense += value;

// //             // --- por categoria ---
// //             const category = flow.category || "Outros";
// //             const catAgg = byCategoryMap.get(category) ?? { income: 0, expense: 0 };

// //             if (isIncome) catAgg.income += value;
// //             else catAgg.expense += value;

// //             byCategoryMap.set(category, catAgg);

// //             // --- por dimensão financeira, via Goal da meta vinculada ---
// //             const dimension = flow.userGoal?.goal?.dimension;
// //             if (dimension) {
// //                 const dimAgg =
// //                     byDimensionMap.get(dimension) ?? { income: 0, expense: 0 };

// //                 if (isIncome) dimAgg.income += value;
// //                 else dimAgg.expense += value;

// //                 byDimensionMap.set(dimension, dimAgg);
// //             }
// //         }

// //         const netBalance = income - expense;

// //         const byCategory: CategorySummary[] = Array.from(
// //             byCategoryMap.entries(),
// //         ).map(([category, agg]) => ({
// //             category,
// //             income: agg.income,
// //             expense: agg.expense,
// //         }));

// //         const byDimension: DimensionSummary[] = Array.from(
// //             byDimensionMap.entries(),
// //         ).map(([dimension, agg]) => ({
// //             dimension,
// //             income: agg.income,
// //             expense: agg.expense,
// //         }));

// //         return {
// //             period: {
// //                 month: targetMonth,
// //                 year: targetYear,
// //             },
// //             totals: {
// //                 income,
// //                 expense,
// //                 netBalance,
// //             },
// //             byCategory,
// //             byDimension,
// //         };
// //     }
// // }

// // ------------------

// import { inject, injectable } from "tsyringe";
// import {
//     CashFlowOperation,
//     type FinancialDimension,
// } from "@/generated/prisma/client";

// import type { ICashFlowRepository } from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";

// interface IRequest {
//     userXPId: string;
//     month?: number;
//     year?: number;
// }

// interface CategorySummary {
//     category: string;
//     income: number;
//     expense: number;
//     transfer: number;
// }

// interface DimensionSummary {
//     dimension: FinancialDimension;
//     income: number;
//     expense: number;
//     transfer: number;
// }

// interface IResponse {
//     period: {
//         month: number;
//         year: number;
//     };
//     totals: {
//         income: number;
//         expense: number;
//         transfer: number;
//         netBalanceBeforeGoals: number; // income - expense
//         netBalanceAfterGoals: number;  // income - expense - transfer
//     };
//     byCategory: CategorySummary[];
//     byDimension: DimensionSummary[];
// }

// @injectable()
// export class GetCashFlowSummaryService {
//     constructor(
//         @inject("CashFlowRepository")
//         private cashFlowRepository: ICashFlowRepository,
//     ) { }

//     async execute({ userXPId, month, year }: IRequest): Promise<IResponse> {
//         const now = new Date();
//         const targetMonth = month ?? now.getMonth() + 1;
//         const targetYear = year ?? now.getFullYear();

//         const flows = await this.cashFlowRepository.listByUserAndPeriod({
//             userXPId,
//             month: targetMonth,
//             year: targetYear,
//         });

//         let income = 0;
//         let expense = 0;
//         let transfer = 0;

//         const byCategoryMap = new Map<
//             string,
//             { income: number; expense: number; transfer: number }
//         >();
//         const byDimensionMap = new Map<
//             FinancialDimension,
//             { income: number; expense: number; transfer: number }
//         >();

//         for (const flow of flows) {
//             const value = flow.value;

//             const isIncome = flow.operation === CashFlowOperation.INCOME;
//             const isExpense = flow.operation === CashFlowOperation.EXPENSE;
//             const isTransfer = flow.operation === CashFlowOperation.TRANSFER;

//             if (isIncome) income += value;
//             if (isExpense) expense += value;
//             if (isTransfer) transfer += value;

//             // --- por categoria ---
//             const category = flow.category || "OUTROS";
//             const catAgg =
//                 byCategoryMap.get(category) ?? { income: 0, expense: 0, transfer: 0 };

//             if (isIncome) catAgg.income += value;
//             if (isExpense) catAgg.expense += value;
//             if (isTransfer) catAgg.transfer += value;

//             byCategoryMap.set(category, catAgg);

//             // --- por dimensão financeira (via Goal da meta vinculada, se houver) ---
//             const dimension = flow.userGoal?.goal?.dimension;
//             if (dimension) {
//                 const dimAgg =
//                     byDimensionMap.get(dimension) ?? {
//                         income: 0,
//                         expense: 0,
//                         transfer: 0,
//                     };

//                 if (isIncome) dimAgg.income += value;
//                 if (isExpense) dimAgg.expense += value;
//                 if (isTransfer) dimAgg.transfer += value;

//                 byDimensionMap.set(dimension, dimAgg);
//             }
//         }

//         const netBalanceBeforeGoals = income - expense;
//         const netBalanceAfterGoals = income - expense - transfer;

//         const byCategory: CategorySummary[] = Array.from(
//             byCategoryMap.entries(),
//         ).map(([category, agg]) => ({
//             category,
//             income: agg.income,
//             expense: agg.expense,
//             transfer: agg.transfer,
//         }));

//         const byDimension: DimensionSummary[] = Array.from(
//             byDimensionMap.entries(),
//         ).map(([dimension, agg]) => ({
//             dimension,
//             income: agg.income,
//             expense: agg.expense,
//             transfer: agg.transfer,
//         }));

//         return {
//             period: {
//                 month: targetMonth,
//                 year: targetYear,
//             },
//             totals: {
//                 income,
//                 expense,
//                 transfer,
//                 netBalanceBeforeGoals,
//                 netBalanceAfterGoals,
//             },
//             byCategory,
//             byDimension,
//         };
//     }
// }

// src/modules/CashFlow/services/GetCashFlowSummary.service.ts
import { inject, injectable } from "tsyringe";
import {
    CashFlowOperation,
    type FinancialDimension,
} from "@/generated/prisma/client";

import type { ICashFlowRepository } from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";

interface IRequest {
    userXPId: string;
    month?: number;
    year?: number;
}

interface CategorySummary {
    category: string;
    income: number;
    expense: number;
}

interface DimensionSummary {
    dimension: FinancialDimension;
    income: number;
    expense: number;
}

interface CashFlowTotals {
    income: number;
    expense: number;
    transfer: number;
    /**
     * Saldo do mês considerando todas as movimentações
     * (INCOME - EXPENSE - TRANSFER, onde TRANSFER é subset de EXPENSE).
     */
    netBalance: number;
    /**
     * Saldo considerando apenas movimentações que NÃO estão ligadas a metas
     * (userGoalId == null). Útil pra ver “quanto sobrou” fora dos objetivos.
     */
    netBalanceBeforeGoals: number;
}

interface IResponse {
    period: {
        month: number;
        year: number;
    };
    totals: CashFlowTotals;
    byCategory: CategorySummary[];
    byDimension: DimensionSummary[];
}

@injectable()
export class GetCashFlowSummaryService {
    constructor(
        @inject("CashFlowRepository")
        private cashFlowRepository: ICashFlowRepository,
    ) { }

    async execute({ userXPId, month, year }: IRequest): Promise<IResponse> {
        const now = new Date();
        const targetMonth = month ?? now.getMonth() + 1;
        const targetYear = year ?? now.getFullYear();

        const flows = await this.cashFlowRepository.listByUserAndPeriod({
            userXPId,
            month: targetMonth,
            year: targetYear,
        });

        // Totais gerais
        let income = 0;
        let expense = 0;
        let transfer = 0;

        // Totais "antes das metas" (apenas movimentos sem userGoalId)
        let incomeBeforeGoals = 0;
        let expenseBeforeGoals = 0;

        const byCategoryMap = new Map<string, { income: number; expense: number }>();
        const byDimensionMap = new Map<
            FinancialDimension,
            { income: number; expense: number }
        >();

        for (const flow of flows) {
            const value = flow.value;
            const isIncome = flow.operation === CashFlowOperation.INCOME;
            const isTransfer = flow.operation === CashFlowOperation.TRANSFER;
            const isGoalRelated = !!flow.userGoalId;

            // --------- Totais gerais ----------
            if (isIncome) {
                income += value;
            } else {
                // EXPENSE ou TRANSFER contam como "saída"
                expense += value;
                if (isTransfer) {
                    transfer += value;
                }
            }

            // --------- Totais antes das metas ----------
            if (!isGoalRelated) {
                if (isIncome) {
                    incomeBeforeGoals += value;
                } else {
                    expenseBeforeGoals += value; // inclui TRANSFER também
                }
            }

            // --------- Por categoria ----------
            const category = flow.category || "Outros";
            const catAgg = byCategoryMap.get(category) ?? {
                income: 0,
                expense: 0,
            };

            if (isIncome) {
                catAgg.income += value;
            } else {
                catAgg.expense += value;
            }

            byCategoryMap.set(category, catAgg);

            // --------- Por dimensão financeira (via Goal vinculado) ----------
            const dimension = flow.userGoal?.goal?.dimension;
            if (dimension) {
                const dimAgg =
                    byDimensionMap.get(dimension) ?? { income: 0, expense: 0 };

                if (isIncome) {
                    dimAgg.income += value;
                } else {
                    dimAgg.expense += value;
                }

                byDimensionMap.set(dimension, dimAgg);
            }
        }

        const netBalance = income - expense;
        const netBalanceBeforeGoals = incomeBeforeGoals - expenseBeforeGoals;

        const byCategory: CategorySummary[] = Array.from(
            byCategoryMap.entries(),
        ).map(([category, agg]) => ({
            category,
            income: agg.income,
            expense: agg.expense,
        }));

        const byDimension: DimensionSummary[] = Array.from(
            byDimensionMap.entries(),
        ).map(([dimension, agg]) => ({
            dimension,
            income: agg.income,
            expense: agg.expense,
        }));

        return {
            period: {
                month: targetMonth,
                year: targetYear,
            },
            totals: {
                income,
                expense,
                transfer,
                netBalance,
                netBalanceBeforeGoals,
            },
            byCategory,
            byDimension,
        };
    }
}
