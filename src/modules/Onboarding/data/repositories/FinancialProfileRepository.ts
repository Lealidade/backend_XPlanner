import { prisma } from "@/database/prismaClient";
import type { FinancialProfile } from "@/generated/prisma/client";
import {
    type IFinancialProfileRepository,
    type FinancialProfileUpsertInput,
} from "../interfaces/IFinancialProfileRepository";

export class FinancialProfileRepository
    implements IFinancialProfileRepository {
    async findByUserXPId(userXPId: string): Promise<FinancialProfile | null> {
        return prisma.financialProfile.findUnique({
            where: { userXPId },
        });
    }

    async upsertByUserXPId(
        userXPId: string,
        data: FinancialProfileUpsertInput,
    ): Promise<FinancialProfile> {
        const now = new Date();

        return prisma.financialProfile.upsert({
            where: { userXPId },
            update: {
                overallScore: data.overallScore,
                desenrolaScore: data.desenrolaScore,
                organizaScore: data.organizaScore,
                reservaScore: data.reservaScore,
                investeScore: data.investeScore,
                hasCompletedOnboarding: data.hasCompletedOnboarding,
                lastScoreChange: data.lastScoreChange,
                lastCalculatedAt: now,
            },
            create: {
                userXPId,
                overallScore: data.overallScore,
                desenrolaScore: data.desenrolaScore,
                organizaScore: data.organizaScore,
                reservaScore: data.reservaScore,
                investeScore: data.investeScore,
                hasCompletedOnboarding: data.hasCompletedOnboarding,
                lastScoreChange: data.lastScoreChange,
                lastCalculatedAt: now,
            },
        });
    }
}
