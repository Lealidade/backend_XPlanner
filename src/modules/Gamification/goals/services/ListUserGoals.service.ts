import { injectable, inject } from "tsyringe";
import type { UserGoal } from "@/generated/prisma/client";
import type { IUserGoalRepository } from "../data/interfaces/IUserGoalRepository";

@injectable()
export class ListUserGoalsService {
    constructor(
        @inject("UserGoalRepository")
        private userGoalRepository: IUserGoalRepository,
    ) { }

    async execute(userXPId: string): Promise<UserGoal[]> {
        return this.userGoalRepository.listByUserXPId(userXPId);
    }
}
