import type { UserXP } from "@/generated/prisma/client";
import { prisma } from "@/database/prismaClient";
import { ICreateUserXPDTO } from "@/modules/UserXP/data/dtos/ICreateUserXPDTO";
import { IUpdateUserXPDTO } from "@/modules/UserXP/data/dtos/IUpdateUserXPDTO";
import { IUserXPRepository } from "../interfaces/IUserXPRepository";
import { injectable } from "tsyringe";

@injectable()
export class UserXPRepository implements IUserXPRepository {
    async findByUserId(userId: string): Promise<UserXP | null> {
        return prisma.userXP.findUnique({
            where: { userId },
        });
    }

    async create(data: ICreateUserXPDTO): Promise<UserXP> {
        return prisma.userXP.create({
            data,
        });
    }

    async updateByUserId(
        userId: string,
        data: IUpdateUserXPDTO
    ): Promise<UserXP> {
        return prisma.userXP.update({
            where: { userId },
            data,
        });
    }
}
