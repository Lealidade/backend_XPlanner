import { inject, injectable } from "tsyringe";
import type { CashFlow, CashFlowOperation } from "@/generated/prisma/client";
import type { ICashFlowRepository } from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";

interface IRequest {
    userXPId: string;
    date: Date;
    label: string;
    category: string;
    operation: CashFlowOperation;
    amount: number;
    userGoalId?: string | null;
    recipient?: string | null;
}

@injectable()
export class CreateCashFlowService {
    constructor(
        @inject("CashFlowRepository")
        private cashFlowRepository: ICashFlowRepository,
    ) { }

    async execute(data: IRequest): Promise<CashFlow> {
        return this.cashFlowRepository.create({
            userXPId: data.userXPId,
            date: data.date,
            label: data.label,
            category: data.category,
            operation: data.operation,
            amount: data.amount,
            userGoalId: data.userGoalId ?? null,
            recipient: data.recipient ?? null,
        });
    }
}
