import { injectable, inject } from "tsyringe";
import {
    IQuizQuestionRepository,
    QuizQuestionWithOptions,
} from "../data/interfaces/IQuizQuestionRepository";

@injectable()
export class ListQuizQuestionsService {
    constructor(
        @inject("QuizQuestionRepository")
        private quizQuestionRepository: IQuizQuestionRepository
    ) { }

    async execute(): Promise<QuizQuestionWithOptions[]> {
        const questions = await this.quizQuestionRepository.findActiveWithOptions();
        return questions;
    }
}
