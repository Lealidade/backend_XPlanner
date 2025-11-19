import { injectable, inject } from "tsyringe";
import type { FinancialProfile } from "@/generated/prisma/client";
import { IFinancialProfileRepository } from "../data/interfaces/IFinancialProfileRepository";

interface IRequest {
    userXPId: string;
}

@injectable()
export class GetMyFinancialProfileService {
    constructor(
        @inject("FinancialProfileRepository")
        private financialProfileRepository: IFinancialProfileRepository
    ) { }

    async execute({ userXPId }: IRequest): Promise<FinancialProfile | null> {
        const profile = await this.financialProfileRepository.findByUserXPId(
            userXPId
        );
        return profile;
    }
}
