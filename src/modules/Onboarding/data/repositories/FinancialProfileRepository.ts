// src/modules/Onboarding/data/repositories/FinancialProfileRepository.ts
import { prisma } from "@/database/prismaClient";
import type { FinancialProfile } from "@/generated/prisma/client";
import {
    IFinancialProfileRepository,
    FinancialProfileUpsertInput,
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
                ...data,
                lastCalculatedAt: now,
            },
            create: {
                userXPId,
                ...data,
                lastCalculatedAt: now,
            },
        });
    }
}
