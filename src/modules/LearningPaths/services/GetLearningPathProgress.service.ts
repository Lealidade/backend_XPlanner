import { injectable, inject } from "tsyringe";
import { ILearningPathRepository } from "../data/interfaces/ILearningPathRepository";
import { IUserLearningStepProgressRepository } from "../data/interfaces/IUserLearningStepProgressRepository";
import type { LearningPathProgressDTO } from "./MarkLearningStepCompleted.service";

interface IRequest {
    userXPId: string;
    learningPathId: string;
}

@injectable()
export class GetLearningPathProgressService {
    constructor(
        @inject("LearningPathRepository")
        private learningPathRepository: ILearningPathRepository,

        @inject("UserLearningStepProgressRepository")
        private userLearningStepProgressRepository: IUserLearningStepProgressRepository,
    ) { }

    public async execute({
        userXPId,
        learningPathId,
    }: IRequest): Promise<LearningPathProgressDTO> {
        const path = await this.learningPathRepository.findByIdWithSteps(
            learningPathId,
        );

        if (!path) {
            throw new Error("LEARNING_PATH_NOT_FOUND");
        }

        const totalSteps = path.steps.length;

        if (totalSteps === 0) {
            return {
                learningPathId: path.id,
                totalSteps: 0,
                completedStepsIds: [],
                progressPercent: 0,
            };
        }

        const completedStepsIds =
            await this.userLearningStepProgressRepository.findCompletedStepIdsByUserAndPath(
                userXPId,
                learningPathId,
            );

        const completedCount = completedStepsIds.length;
        const progressPercent = Math.round((completedCount / totalSteps) * 100);

        return {
            learningPathId: path.id,
            totalSteps,
            completedStepsIds,
            progressPercent,
        };
    }
}
