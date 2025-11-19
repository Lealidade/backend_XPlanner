// src/modules/userXP/services/GetOrCreateUserXPService.ts
import { injectable, inject } from "tsyringe";
import { UserXP } from "@/generated/prisma/client";
import { IUserXPRepository } from "../data/interfaces/IUserXPRepository";

interface IRequest {
    userId: string;
    defaultUsername?: string | null;
}

@injectable()
export class GetOrCreateUserXPService {
    constructor(
        @inject("UserXPRepository")
        private userXPRepository: IUserXPRepository
    ) { }

    async execute({ userId, defaultUsername }: IRequest): Promise<UserXP> {
        const existing = await this.userXPRepository.findByUserId(userId);

        if (existing) {
            return existing;
        }

        const userXP = await this.userXPRepository.create({
            userId,
            username: defaultUsername ?? null,
        });

        return userXP;
    }
}
