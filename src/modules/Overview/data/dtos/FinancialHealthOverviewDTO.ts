import type { FinancialDimension } from "@/generated/prisma/client";
import type { FinancialProfileDTO } from "@/modules/Onboarding/data/dtos/SubmitQuizAnswersDTO";

export interface FinancialHealthOverviewDTO {
    period: {
        month: number;
        year: number;
    };

    financialProfile: {
        hasProfile: boolean;
        profile: FinancialProfileDTO | null;
    };

    cashFlow: {
        totals: {
            income: number;
            expense: number;
            netBalance: number;
        };
        byCategory: {
            category: string;
            income: number;
            expense: number;
        }[];
        byDimension: {
            dimension: FinancialDimension;
            income: number;
            expense: number;
        }[];
    };

    goals: {
        activeGoalsCount: number;
        completedGoalsCount: number;
    };
}
