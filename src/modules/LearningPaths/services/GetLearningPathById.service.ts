import { injectable, inject } from "tsyringe";
import {
    ILearningPathRepository,
    LearningPathWithSteps,
} from "../data/interfaces/ILearningPathRepository";

interface IRequest {
    id: string;
}

@injectable()
export class GetLearningPathByIdService {
    constructor(
        @inject("LearningPathRepository")
        private learningPathRepository: ILearningPathRepository,
    ) { }

    async execute({ id }: IRequest): Promise<LearningPathWithSteps | null> {
        return this.learningPathRepository.findByIdWithSteps(id);
    }
}
