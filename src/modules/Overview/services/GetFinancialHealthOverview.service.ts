// // // src/modules/Overview/services/GetFinancialHealthOverview.service.ts
// // import { injectable, inject } from "tsyringe";
// // import type { FinancialProfile } from "@/generated/prisma/client";

// // import type {
// //     IFinancialProfileRepository,
// // } from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";
// // import type {
// //     IUserGoalRepository,
// // } from "@/modules/Gamification/goals/data/interfaces/IUserGoalRepository";

// // import { GetCashFlowSummaryService } from "@/modules/CashFlow/services/GetCashFlowSummary.service";
// // import type { FinancialProfileDTO } from "@/modules/Onboarding/data/dtos/SubmitQuizAnswersDTO";
// // import type { FinancialHealthOverviewDTO } from "../data/dtos/FinancialHealthOverviewDTO";

// // interface IRequest {
// //     userXPId: string;
// //     month?: number;
// //     year?: number;
// // }

// // @injectable()
// // export class GetFinancialHealthOverviewService {
// //     constructor(
// //         @inject("FinancialProfileRepository")
// //         private financialProfileRepository: IFinancialProfileRepository,

// //         @inject("UserGoalRepository")
// //         private userGoalRepository: IUserGoalRepository,

// //         // Service concreto: tsyringe resolve pelo tipo da classe
// //         private cashFlowSummaryService: GetCashFlowSummaryService,
// //     ) { }

// //     private mapProfileToDTO(
// //         profile: FinancialProfile | null,
// //     ): { hasProfile: boolean; profile: FinancialProfileDTO | null } {
// //         if (!profile) {
// //             return {
// //                 hasProfile: false,
// //                 profile: null,
// //             };
// //         }

// //         const dto: FinancialProfileDTO = {
// //             overallScore: profile.overallScore,
// //             desenrolaScore: profile.desenrolaScore,
// //             organizaScore: profile.organizaScore,
// //             reservaScore: profile.reservaScore,
// //             investeScore: profile.investeScore,
// //             // se o campo ainda for null, tratamos como 0
// //             lastScoreChange: profile.lastScoreChange ?? 0,
// //         };

// //         return {
// //             hasProfile: true,
// //             profile: dto,
// //         };
// //     }

// //     public async execute({
// //         userXPId,
// //         month,
// //         year,
// //     }: IRequest): Promise<FinancialHealthOverviewDTO> {
// //         const now = new Date();
// //         const targetMonth = month ?? now.getMonth() + 1;
// //         const targetYear = year ?? now.getFullYear();

// //         const [profile, cashFlowSummary, userGoals] = await Promise.all([
// //             this.financialProfileRepository.findByUserXPId(userXPId),
// //             this.cashFlowSummaryService.execute({
// //                 userXPId,
// //                 month: targetMonth,
// //                 year: targetYear,
// //             }),
// //             this.userGoalRepository.listByUserXPId(userXPId),
// //         ]);

// //         const activeGoalsCount = userGoals.filter((g) => g.isActive).length;
// //         const completedGoalsCount = userGoals.filter(
// //             (g) => !!g.completedAt,
// //         ).length;

// //         const { hasProfile, profile: profileDTO } =
// //             this.mapProfileToDTO(profile);

// //         const overview: FinancialHealthOverviewDTO = {
// //             period: {
// //                 month: cashFlowSummary.period.month,
// //                 year: cashFlowSummary.period.year,
// //             },
// //             financialProfile: {
// //                 hasProfile,
// //                 profile: profileDTO,
// //             },
// //             cashFlow: {
// //                 totals: cashFlowSummary.totals,
// //                 byCategory: cashFlowSummary.byCategory,
// //                 byDimension: cashFlowSummary.byDimension,
// //             },
// //             goals: {
// //                 activeGoalsCount,
// //                 completedGoalsCount,
// //             },
// //         };

// //         return overview;
// //     }
// // }

// // src/modules/Overview/services/GetFinancialHealthOverview.service.ts
// import { injectable, inject } from "tsyringe";
// import type { FinancialProfile } from "@/generated/prisma/client";

// import type {
//     IFinancialProfileRepository,
// } from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";
// import type {
//     IUserGoalRepository,
// } from "@/modules/Gamification/goals/data/interfaces/IUserGoalRepository";

// import { GetCashFlowSummaryService } from "@/modules/CashFlow/services/GetCashFlowSummary.service";
// import type { FinancialProfileDTO } from "@/modules/Onboarding/data/dtos/SubmitQuizAnswersDTO";
// import type { FinancialHealthOverviewDTO } from "../data/dtos/FinancialHealthOverviewDTO";

// interface IRequest {
//     userXPId: string;
//     month?: number;
//     year?: number;
// }

// @injectable()
// export class GetFinancialHealthOverviewService {
//     constructor(
//         @inject("FinancialProfileRepository")
//         private financialProfileRepository: IFinancialProfileRepository,

//         @inject("UserGoalRepository")
//         private userGoalRepository: IUserGoalRepository,

//         // Service concreto: tsyringe resolve pelo tipo da classe
//         private cashFlowSummaryService: GetCashFlowSummaryService,
//     ) { }

//     private mapProfileToDTO(
//         profile: FinancialProfile | null,
//     ): { hasProfile: boolean; profile: FinancialProfileDTO | null } {
//         if (!profile) {
//             return {
//                 hasProfile: false,
//                 profile: null,
//             };
//         }

//         const dto: FinancialProfileDTO = {
//             overallScore: profile.overallScore,
//             desenrolaScore: profile.desenrolaScore,
//             organizaScore: profile.organizaScore,
//             reservaScore: profile.reservaScore,
//             investeScore: profile.investeScore,
//             // se o campo ainda for null, tratamos como 0
//             lastScoreChange: profile.lastScoreChange ?? 0,
//         };

//         return {
//             hasProfile: true,
//             profile: dto,
//         };
//     }

//     public async execute({
//         userXPId,
//         month,
//         year,
//     }: IRequest): Promise<FinancialHealthOverviewDTO> {
//         const now = new Date();
//         const targetMonth = month ?? now.getMonth() + 1;
//         const targetYear = year ?? now.getFullYear();

//         const [profile, cashFlowSummary, userGoals] = await Promise.all([
//             this.financialProfileRepository.findByUserXPId(userXPId),
//             this.cashFlowSummaryService.execute({
//                 userXPId,
//                 month: targetMonth,
//                 year: targetYear,
//             }),
//             this.userGoalRepository.listByUserXPId(userXPId),
//         ]);

//         const activeGoalsCount = userGoals.filter((g) => g.isActive).length;
//         const completedGoalsCount = userGoals.filter(
//             (g) => !!g.completedAt,
//         ).length;

//         const { hasProfile, profile: profileDTO } =
//             this.mapProfileToDTO(profile);

//         const overview: FinancialHealthOverviewDTO = {
//             period: {
//                 month: cashFlowSummary.period.month,
//                 year: cashFlowSummary.period.year,
//             },
//             financialProfile: {
//                 hasProfile,
//                 profile: profileDTO,
//             },
//             cashFlow: {
//                 totals: cashFlowSummary.totals,
//                 byCategory: cashFlowSummary.byCategory,
//                 byDimension: cashFlowSummary.byDimension,
//             },
//             goals: {
//                 activeGoalsCount,
//                 completedGoalsCount,
//             },
//         };

//         return overview;
//     }
// }

// src/modules/Overview/services/GetFinancialHealthOverview.service.ts
import { injectable, inject, container } from "tsyringe";
import type { FinancialProfile } from "@/generated/prisma/client";

import type {
    IFinancialProfileRepository,
} from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";
import type {
    IUserGoalRepository,
} from "@/modules/Gamification/goals/data/interfaces/IUserGoalRepository";

import { GetCashFlowSummaryService } from "@/modules/CashFlow/services/GetCashFlowSummary.service";
import type { FinancialProfileDTO } from "@/modules/Onboarding/data/dtos/SubmitQuizAnswersDTO";
import type { FinancialHealthOverviewDTO } from "../data/dtos/FinancialHealthOverviewDTO";

interface IRequest {
    userXPId: string;
    month?: number;
    year?: number;
}

@injectable()
export class GetFinancialHealthOverviewService {
    constructor(
        @inject("FinancialProfileRepository")
        private financialProfileRepository: IFinancialProfileRepository,

        @inject("UserGoalRepository")
        private userGoalRepository: IUserGoalRepository,
        // ❌ removido: injeção direta do GetCashFlowSummaryService
        // private cashFlowSummaryService: GetCashFlowSummaryService,
    ) { }

    private mapProfileToDTO(
        profile: FinancialProfile | null,
    ): { hasProfile: boolean; profile: FinancialProfileDTO | null } {
        if (!profile) {
            return {
                hasProfile: false,
                profile: null,
            };
        }

        const dto: FinancialProfileDTO = {
            overallScore: profile.overallScore,
            desenrolaScore: profile.desenrolaScore,
            organizaScore: profile.organizaScore,
            reservaScore: profile.reservaScore,
            investeScore: profile.investeScore,
            lastScoreChange: profile.lastScoreChange ?? 0,
        };

        return {
            hasProfile: true,
            profile: dto,
        };
    }

    public async execute({
        userXPId,
        month,
        year,
    }: IRequest): Promise<FinancialHealthOverviewDTO> {
        const now = new Date();
        const targetMonth = month ?? now.getMonth() + 1;
        const targetYear = year ?? now.getFullYear();

        // 👉 resolve o serviço concreto aqui, em vez de via construtor
        const cashFlowSummaryService = container.resolve(
            GetCashFlowSummaryService,
        );

        const [profile, cashFlowSummary, userGoals] = await Promise.all([
            this.financialProfileRepository.findByUserXPId(userXPId),
            cashFlowSummaryService.execute({
                userXPId,
                month: targetMonth,
                year: targetYear,
            }),
            this.userGoalRepository.listByUserXPId(userXPId),
        ]);

        const activeGoalsCount = userGoals.filter((g) => g.isActive).length;
        const completedGoalsCount = userGoals.filter(
            (g) => !!g.completedAt,
        ).length;

        const { hasProfile, profile: profileDTO } =
            this.mapProfileToDTO(profile);

        const overview: FinancialHealthOverviewDTO = {
            period: {
                month: cashFlowSummary.period.month,
                year: cashFlowSummary.period.year,
            },
            financialProfile: {
                hasProfile,
                profile: profileDTO,
            },
            cashFlow: {
                totals: cashFlowSummary.totals,
                byCategory: cashFlowSummary.byCategory,
                byDimension: cashFlowSummary.byDimension,
            },
            goals: {
                activeGoalsCount,
                completedGoalsCount,
            },
        };

        return overview;
    }
}
