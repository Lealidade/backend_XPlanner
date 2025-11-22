// src/modules/Onboarding/data/interfaces/IFinancialProfileRepository.ts
import type { FinancialProfile } from "@/generated/prisma/client";

export type FinancialProfileUpsertInput = {
    overallScore: number;
    desenrolaScore: number;
    organizaScore: number;
    reservaScore: number;
    investeScore: number;
    hasCompletedOnboarding: boolean;
};

export interface IFinancialProfileRepository {
    findByUserXPId(userXPId: string): Promise<FinancialProfile | null>;

    upsertByUserXPId(
        userXPId: string,
        data: FinancialProfileUpsertInput,
    ): Promise<FinancialProfile>;
}
