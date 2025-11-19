import { prisma } from "@/database/prismaClient";
import type { FinancialProfile } from "@/generated/prisma/client";
import {
    IFinancialProfileRepository,
    IUpsertFinancialProfileDTO,
} from "../interfaces/IFinancialProfileRepository";

export class FinancialProfileRepository implements IFinancialProfileRepository {
    async upsertForUserXP(
        data: IUpsertFinancialProfileDTO,
    ): Promise<FinancialProfile> {
        const now = new Date();

        return prisma.financialProfile.upsert({
            where: { userXPId: data.userXPId },
            update: {
                overallScore: data.overallScore,
                desenrolaScore: data.desenrolaScore,
                organizaScore: data.organizaScore,
                reservaScore: data.reservaScore,
                investeScore: data.investeScore,
                hasCompletedOnboarding: true,
                lastCalculatedAt: now,
            },
            create: {
                userXPId: data.userXPId,
                overallScore: data.overallScore,
                desenrolaScore: data.desenrolaScore,
                organizaScore: data.organizaScore,
                reservaScore: data.reservaScore,
                investeScore: data.investeScore,
                hasCompletedOnboarding: true,
                lastCalculatedAt: now,
            },
        });
    }

    async findByUserXPId(userXPId: string): Promise<FinancialProfile | null> {
        return prisma.financialProfile.findUnique({
            where: { userXPId },
        });
    }
}
