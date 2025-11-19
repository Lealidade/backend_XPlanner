import { prisma } from "@/database/prismaClient";
import {
    IUserQuizAnswerRepository,
    ICreateUserQuizAnswerDTO,
} from "../interfaces/IUserQuizAnswerRepository";

export class UserQuizAnswerRepository implements IUserQuizAnswerRepository {
    async createManyForUser(data: ICreateUserQuizAnswerDTO[]): Promise<void> {
        if (data.length === 0) return;

        await prisma.userQuizAnswer.createMany({
            data,
        });
    }
}
