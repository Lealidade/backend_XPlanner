import { injectable, inject } from "tsyringe";
import type { Goal } from "@/generated/prisma/client";
import type { IGoalRepository } from "../data/interfaces/IGoalRepository";

@injectable()
export class ListGoalTemplatesService {
    constructor(
        @inject("GoalRepository")
        private goalRepository: IGoalRepository,
    ) { }

    async execute(): Promise<Goal[]> {
        return this.goalRepository.listAll();
    }
}
