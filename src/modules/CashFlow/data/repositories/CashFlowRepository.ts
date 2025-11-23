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
                value: data.amount,
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
                        goal: true,
                    },
                },
            },
        });
    }
}
