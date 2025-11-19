import { injectable, inject } from "tsyringe";
import type { UserXP } from "@/generated/prisma/client";
import { IUserXPRepository } from "../data/interfaces/IUserXPRepository";

interface IRequest {
    userId: string;
    username?: string | null;
    birthYear?: number | null;
}

@injectable()
export class UpdateUserXPService {
    constructor(
        @inject("UserXPRepository")
        private userXPRepository: IUserXPRepository
    ) { }

    async execute({ userId, username, birthYear }: IRequest): Promise<UserXP> {
        const userXP = await this.userXPRepository.updateByUserId(userId, {
            username,
            birthYear,
        });

        return userXP;
    }
}
