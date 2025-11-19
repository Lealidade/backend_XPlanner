import { injectable, inject } from "tsyringe";
import { IQuizOptionRepository } from "../data/interfaces/IQuizOptionRepository";
import {
    IUserQuizAnswerRepository,
    ICreateUserQuizAnswerDTO,
} from "../data/interfaces/IUserQuizAnswerRepository";
import { IFinancialProfileRepository } from "../data/interfaces/IFinancialProfileRepository";

type Dimension = "DESENROLA" | "ORGANIZA" | "RESERVA" | "INVESTE";

interface IAnswerInput {
    questionId: string;
    optionId: string;
}

interface IRequest {
    userXPId: string;
    answers: IAnswerInput[];
}

export interface IScoreResult {
    overallScore: number;
    desenrolaScore: number;
    organizaScore: number;
    reservaScore: number;
    investeScore: number;
}

@injectable()
export class SubmitQuizAnswersAndCalculateScoreService {
    constructor(
        @inject("QuizOptionRepository")
        private quizOptionRepository: IQuizOptionRepository,

        @inject("UserQuizAnswerRepository")
        private userQuizAnswerRepository: IUserQuizAnswerRepository,

        @inject("FinancialProfileRepository")
        private financialProfileRepository: IFinancialProfileRepository,
    ) { }

    private computeScore(sum: number, count: number): number {
        if (count === 0) return 500;

        const avgWeight = sum / count; // -3 .. 3
        const normalized = (avgWeight + 3) / 6; // 0 .. 1
        const score = Math.round(normalized * 1000);

        return Math.max(0, Math.min(1000, score));
    }

    public async execute({ userXPId, answers }: IRequest): Promise<IScoreResult> {
        if (!answers || answers.length === 0) {
            throw new Error("At least one answer is required");
        }

        // buscar todas as opções com suas perguntas
        const optionIds = [...new Set(answers.map((a) => a.optionId))];

        const optionsWithQuestion =
            await this.quizOptionRepository.findManyWithQuestionByIds(optionIds);

        const optionMap = new Map(
            optionsWithQuestion.map((o) => [o.id, o]),
        );

        // acumular respostas válidas e checar consistência
        const sums: Record<Dimension, number> = {
            DESENROLA: 0,
            ORGANIZA: 0,
            RESERVA: 0,
            INVESTE: 0,
        };
        const counts: Record<Dimension, number> = {
            DESENROLA: 0,
            ORGANIZA: 0,
            RESERVA: 0,
            INVESTE: 0,
        };

        const answersToPersist: ICreateUserQuizAnswerDTO[] = [];

        for (const answer of answers) {
            const opt = optionMap.get(answer.optionId);
            if (!opt) {
                throw new Error(`Option not found: ${answer.optionId}`);
            }

            if (opt.questionId !== answer.questionId) {
                throw new Error(
                    `Option ${answer.optionId} does not belong to question ${answer.questionId}`,
                );
            }

            const dimension = opt.question.dimension as Dimension;

            sums[dimension] += opt.weight;
            counts[dimension] += 1;

            answersToPersist.push({
                userXPId,
                questionId: answer.questionId,
                optionId: answer.optionId,
            });
        }

        // salvar respostas
        await this.userQuizAnswerRepository.createManyForUser(answersToPersist);

        // calcular scores
        const desenrolaScore = this.computeScore(
            sums.DESENROLA,
            counts.DESENROLA,
        );
        const organizaScore = this.computeScore(
            sums.ORGANIZA,
            counts.ORGANIZA,
        );
        const reservaScore = this.computeScore(
            sums.RESERVA,
            counts.RESERVA,
        );
        const investeScore = this.computeScore(
            sums.INVESTE,
            counts.INVESTE,
        );

        const overallScore = Math.round(
            (desenrolaScore +
                organizaScore +
                reservaScore +
                investeScore) /
            4,
        );

        // upsert do FinancialProfile
        await this.financialProfileRepository.upsertForUserXP({
            userXPId,
            overallScore,
            desenrolaScore,
            organizaScore,
            reservaScore,
            investeScore,
        });

        return {
            overallScore,
            desenrolaScore,
            organizaScore,
            reservaScore,
            investeScore,
        };
    }
}
