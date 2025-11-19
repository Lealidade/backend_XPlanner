// src/modules/userXP/domain/repositories/IUserXPRepository.ts
import { UserXP } from "../../../../generated/prisma/client";
import { ICreateUserXPDTO } from "../dtos/ICreateUserXPDTO";
import { IUpdateUserXPDTO } from "../dtos/IUpdateUserXPDTO";

export interface IUserXPRepository {
    findByUserId(userId: string): Promise<UserXP | null>;
    create(data: ICreateUserXPDTO): Promise<UserXP>;
    updateByUserId(userId: string, data: IUpdateUserXPDTO): Promise<UserXP>;
}
