import type { FinancialProfile } from "@/generated/prisma/client";

export interface IUpsertFinancialProfileDTO {
    userXPId: string;
    overallScore: number;
    desenrolaScore: number;
    organizaScore: number;
    reservaScore: number;
    investeScore: number;
}

export interface IFinancialProfileRepository {
    upsertForUserXP(
        data: IUpsertFinancialProfileDTO,
    ): Promise<FinancialProfile>;

    findByUserXPId(userXPId: string): Promise<FinancialProfile | null>;
}
