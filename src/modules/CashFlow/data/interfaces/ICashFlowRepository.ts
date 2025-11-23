import type {
    CashFlow,
    CashFlowOperation,
    UserGoal,
    Goal,
} from "@/generated/prisma/client";

export interface CashFlowListFilter {
    userXPId: string;
    month?: number;
    year?: number;
}

export interface CreateCashFlowInput {
    userXPId: string;
    date: Date;
    label: string;
    category: string;
    operation: CashFlowOperation;
    amount: number;
    userGoalId?: string | null;
    recipient?: string | null;
}

export type CashFlowWithRelations = CashFlow & {
    userGoal: (UserGoal & { goal: Goal | null }) | null;
};

export interface ICashFlowRepository {
    create(data: CreateCashFlowInput): Promise<CashFlow>;
    listByUserAndPeriod(
        filter: CashFlowListFilter,
    ): Promise<CashFlowWithRelations[]>;
}
