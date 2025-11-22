// // src/modules/CashFlow/services/ListCashFlow.service.ts
// import { inject, injectable } from "tsyringe";
// import type { CashFlow } from "@/generated/prisma/client";

// import type {
//     ICashFlowRepository,
// } from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";

// interface IRequest {
//     userXPId: string;
//     month?: number;
//     year?: number;
// }

// interface IResponse {
//     period: {
//         month: number;
//         year: number;
//     };
//     items: CashFlow[];
// }

// @injectable()
// export class ListCashFlowService {
//     constructor(
//         @inject("CashFlowRepository")
//         private cashFlowRepository: ICashFlowRepository,
//     ) { }

//     async execute({ userXPId, month, year }: IRequest): Promise<IResponse> {
//         const now = new Date();
//         const targetMonth = month ?? now.getMonth() + 1;
//         const targetYear = year ?? now.getFullYear();

//         const items = await this.cashFlowRepository.listByUserAndPeriod({
//             userXPId,
//             month: targetMonth,
//             year: targetYear,
//         });

//         return {
//             period: {
//                 month: targetMonth,
//                 year: targetYear,
//             },
//             items,
//         };
//     }
// }

// --------------------

import { inject, injectable } from "tsyringe";

import type {
    ICashFlowRepository,
    CashFlowWithRelations,
} from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";

interface IRequest {
    userXPId: string;
    month?: number;
    year?: number;
}

interface IResponse {
    period: {
        month: number;
        year: number;
    };
    items: CashFlowWithRelations[];
}

@injectable()
export class ListCashFlowService {
    constructor(
        @inject("CashFlowRepository")
        private cashFlowRepository: ICashFlowRepository,
    ) { }

    async execute({ userXPId, month, year }: IRequest): Promise<IResponse> {
        const now = new Date();
        const targetMonth = month ?? now.getMonth() + 1;
        const targetYear = year ?? now.getFullYear();

        const items = await this.cashFlowRepository.listByUserAndPeriod({
            userXPId,
            month: targetMonth,
            year: targetYear,
        });

        return {
            period: {
                month: targetMonth,
                year: targetYear,
            },
            items,
        };
    }
}
