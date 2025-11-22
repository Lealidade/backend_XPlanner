// // // // // src/modules/Onboarding/services/SubmitQuizAnswersService.ts
// // // // import { injectable, inject } from "tsyringe";
// // // // import type { FinancialProfile } from "@/generated/prisma/client";
// // // // import {
// // // //     IQuizQuestionRepository,
// // // //     QuizQuestionWithOptions,
// // // // } from "../data/interfaces/IQuizQuestionRepository";
// // // // import { IFinancialProfileRepository } from "../data/interfaces/IFinancialProfileRepository";

// // // // interface AnswerInput {
// // // //     questionId: string;
// // // //     optionId: string;
// // // // }

// // // // interface IRequest {
// // // //     userXPId: string;
// // // //     answers: AnswerInput[];
// // // // }

// // // // interface DimensionScores {
// // // //     DESENROLA: number;
// // // //     ORGANIZA: number;
// // // //     RESERVA: number;
// // // //     INVESTE: number;
// // // // }

// // // // @injectable()
// // // // export class SubmitQuizAnswersService {
// // // //     constructor(
// // // //         @inject("QuizQuestionRepository")
// // // //         private quizQuestionRepository: IQuizQuestionRepository,

// // // //         @inject("FinancialProfileRepository")
// // // //         private financialProfileRepository: IFinancialProfileRepository,
// // // //     ) { }

// // // //     private normalizeScoreFromAverageWeight(avgWeight: number): number {
// // // //         // Exemplo: weight varia de -3 a +3
// // // //         const min = -3;
// // // //         const max = 3;

// // // //         const clamped = Math.min(max, Math.max(min, avgWeight));
// // // //         const normalized = (clamped - min) / (max - min); // 0 a 1
// // // //         return Math.round(normalized * 1000); // 0 a 1000
// // // //     }

// // // //     private buildDimensionScores(
// // // //         questions: QuizQuestionWithOptions[],
// // // //         answers: AnswerInput[],
// // // //     ): DimensionScores {
// // // //         // Mapear perguntas e opções pra lookup rápido
// // // //         const questionMap = new Map<string, QuizQuestionWithOptions>();
// // // //         questions.forEach((q) => questionMap.set(q.id, q));

// // // //         const sums: Record<keyof DimensionScores, number> = {
// // // //             DESENROLA: 0,
// // // //             ORGANIZA: 0,
// // // //             RESERVA: 0,
// // // //             INVESTE: 0,
// // // //         };

// // // //         const counts: Record<keyof DimensionScores, number> = {
// // // //             DESENROLA: 0,
// // // //             ORGANIZA: 0,
// // // //             RESERVA: 0,
// // // //             INVESTE: 0,
// // // //         };

// // // //         for (const answer of answers) {
// // // //             const question = questionMap.get(answer.questionId);
// // // //             if (!question) {
// // // //                 // pode ignorar ou lançar erro; aqui vou lançar erro
// // // //                 throw new Error(`QUESTION_NOT_FOUND:${answer.questionId}`);
// // // //             }

// // // //             const option = question.options.find((o) => o.id === answer.optionId);
// // // //             if (!option) {
// // // //                 throw new Error(
// // // //                     `OPTION_NOT_FOUND:${answer.optionId}:question:${answer.questionId}`,
// // // //                 );
// // // //             }

// // // //             const dim = question.dimension as keyof DimensionScores;

// // // //             sums[dim] += option.weight;
// // // //             counts[dim] += 1;
// // // //         }

// // // //         // Calcular média por dimensão e normalizar
// // // //         const result: DimensionScores = {
// // // //             DESENROLA: 0,
// // // //             ORGANIZA: 0,
// // // //             RESERVA: 0,
// // // //             INVESTE: 0,
// // // //         };

// // // //         (Object.keys(result) as (keyof DimensionScores)[]).forEach((dim) => {
// // // //             if (counts[dim] === 0) {
// // // //                 result[dim] = 500; // neutro se não teve pergunta daquela dimensão
// // // //             } else {
// // // //                 const avg = sums[dim] / counts[dim];
// // // //                 result[dim] = this.normalizeScoreFromAverageWeight(avg);
// // // //             }
// // // //         });

// // // //         return result;
// // // //     }

// // // //     public async execute({
// // // //         userXPId,
// // // //         answers,
// // // //     }: IRequest): Promise<FinancialProfile> {
// // // //         if (!answers || answers.length === 0) {
// // // //             throw new Error("NO_ANSWERS_PROVIDED");
// // // //         }

// // // //         const questions = await this.quizQuestionRepository.findActiveWithOptions();

// // // //         const dimScores = this.buildDimensionScores(questions, answers);

// // // //         // Score geral como média das dimensões
// // // //         const overallScore = Math.round(
// // // //             (dimScores.DESENROLA +
// // // //                 dimScores.ORGANIZA +
// // // //                 dimScores.RESERVA +
// // // //                 dimScores.INVESTE) /
// // // //             4,
// // // //         );

// // // //         // Atualiza (ou cria) o FinancialProfile
// // // //         const profile = await this.financialProfileRepository.upsertByUserXPId(
// // // //             userXPId,
// // // //             {
// // // //                 overallScore,
// // // //                 desenrolaScore: dimScores.DESENROLA,
// // // //                 organizaScore: dimScores.ORGANIZA,
// // // //                 reservaScore: dimScores.RESERVA,
// // // //                 investeScore: dimScores.INVESTE,
// // // //                 hasCompletedOnboarding: true,
// // // //             },
// // // //         );

// // // //         return profile;
// // // //     }
// // // // }

// // // // src/modules/Onboarding/services/SubmitQuizAnswersService.ts
// // // import { injectable, inject } from "tsyringe";
// // // import type { FinancialProfile } from "@/generated/prisma/client";

// // // import {
// // //     IQuizQuestionRepository,
// // //     QuizQuestionWithOptions,
// // // } from "../data/interfaces/IQuizQuestionRepository";
// // // import { IFinancialProfileRepository } from "../data/interfaces/IFinancialProfileRepository";

// // // import {
// // //     type SubmitQuizAnswersResponseDTO,
// // //     type QuestionFeedbackDTO,
// // //     type QuizOptionFeedbackDTO,
// // //     type FinancialDimension,
// // // } from "../dtos/SubmitQuizAnswersDTO";

// // // interface AnswerInput {
// // //     questionId: string;
// // //     optionId: string;
// // // }

// // // interface IRequest {
// // //     userXPId: string;
// // //     answers: AnswerInput[];
// // // }

// // // type Dimension = FinancialDimension;

// // // @injectable()
// // // export class SubmitQuizAnswersService {
// // //     constructor(
// // //         @inject("QuizQuestionRepository")
// // //         private quizQuestionRepository: IQuizQuestionRepository,

// // //         @inject("FinancialProfileRepository")
// // //         private financialProfileRepository: IFinancialProfileRepository,
// // //     ) { }

// // //     /**
// // //      * Normaliza a média de pesos (-3 a +3) para um score 0–1000
// // //      */
// // //     private normalizeScoreFromAverageWeight(avgWeight: number): number {
// // //         // se você usar pesos -1..+1, continua funcionando;
// // //         // só vai concentrar mais no meio (perto de 500)
// // //         const min = -3;
// // //         const max = 3;

// // //         const clamped = Math.min(max, Math.max(min, avgWeight));
// // //         const normalized = (clamped - min) / (max - min); // 0 a 1
// // //         return Math.round(normalized * 1000); // 0 a 1000
// // //     }

// // //     public async execute({
// // //         userXPId,
// // //         answers,
// // //     }: IRequest): Promise<SubmitQuizAnswersResponseDTO> {
// // //         if (!answers || answers.length === 0) {
// // //             throw new Error("NO_ANSWERS_PROVIDED");
// // //         }

// // //         // 1) Buscar todas as perguntas ativas com suas opções
// // //         const questions = await this.quizQuestionRepository.findActiveWithOptions();

// // //         const questionMap = new Map<string, QuizQuestionWithOptions>();
// // //         questions.forEach((q) => questionMap.set(q.id, q));

// // //         // 2) Acumuladores por dimensão (usam weight para o score 0–1000)
// // //         const dimSums: Record<Dimension, { sumWeight: number; count: number }> = {
// // //             DESENROLA: { sumWeight: 0, count: 0 },
// // //             ORGANIZA: { sumWeight: 0, count: 0 },
// // //             RESERVA: { sumWeight: 0, count: 0 },
// // //             INVESTE: { sumWeight: 0, count: 0 },
// // //         };

// // //         const questionsFeedback: QuestionFeedbackDTO[] = [];

// // //         // 3) Processar cada resposta do usuário
// // //         for (const answer of answers) {
// // //             const question = questionMap.get(answer.questionId);
// // //             if (!question) {
// // //                 throw new Error(`QUESTION_NOT_FOUND:${answer.questionId}`);
// // //             }

// // //             const options = question.options;
// // //             if (!options || options.length === 0) {
// // //                 continue; // ou throw, se for um erro de modelagem
// // //             }

// // //             const selectedOption = options.find((o) => o.id === answer.optionId);
// // //             if (!selectedOption) {
// // //                 throw new Error(
// // //                     `OPTION_NOT_FOUND:${answer.optionId}:question:${answer.questionId}`,
// // //                 );
// // //             }

// // //             // Melhor opção = maior weight
// // //             let bestOption = options[0];
// // //             for (const opt of options) {
// // //                 if (opt.weight > bestOption.weight) {
// // //                     bestOption = opt;
// // //                 }
// // //             }

// // //             const dim = question.dimension as Dimension;

// // //             // Acumula para cálculo de score da dimensão (com weight)
// // //             dimSums[dim].sumWeight += selectedOption.weight;
// // //             dimSums[dim].count += 1;

// // //             // Pontos para UX (Fluxo B): weight * 5
// // //             const selectedOptionPoints = selectedOption.weight * 5;
// // //             const bestOptionPoints = bestOption.weight * 5;

// // //             const optionsFeedback: QuizOptionFeedbackDTO[] = options.map((opt) => ({
// // //                 id: opt.id,
// // //                 label: opt.label,
// // //                 points: opt.weight * 5, // -5, 0, +5 etc.
// // //                 isBest: opt.id === bestOption.id,
// // //                 explanation: opt.explanation ?? null,
// // //             }));

// // //             const questionFeedback: QuestionFeedbackDTO = {
// // //                 questionId: question.id,
// // //                 text: question.text,
// // //                 dimension: dim,

// // //                 selectedOptionId: selectedOption.id,
// // //                 selectedOptionLabel: selectedOption.label,
// // //                 selectedOptionPoints,
// // //                 selectedOptionIsBest: selectedOption.id === bestOption.id,

// // //                 bestOptionId: bestOption.id,
// // //                 bestOptionLabel: bestOption.label,
// // //                 bestOptionPoints,
// // //                 bestOptionExplanation: bestOption.explanation ?? null,

// // //                 options: optionsFeedback,
// // //             };

// // //             questionsFeedback.push(questionFeedback);
// // //         }

// // //         // 4) Calcular score por dimensão (0–1000)
// // //         const desenrolaScore =
// // //             dimSums.DESENROLA.count === 0
// // //                 ? 500
// // //                 : this.normalizeScoreFromAverageWeight(
// // //                     dimSums.DESENROLA.sumWeight / dimSums.DESENROLA.count,
// // //                 );

// // //         const organizaScore =
// // //             dimSums.ORGANIZA.count === 0
// // //                 ? 500
// // //                 : this.normalizeScoreFromAverageWeight(
// // //                     dimSums.ORGANIZA.sumWeight / dimSums.ORGANIZA.count,
// // //                 );

// // //         const reservaScore =
// // //             dimSums.RESERVA.count === 0
// // //                 ? 500
// // //                 : this.normalizeScoreFromAverageWeight(
// // //                     dimSums.RESERVA.sumWeight / dimSums.RESERVA.count,
// // //                 );

// // //         const investeScore =
// // //             dimSums.INVESTE.count === 0
// // //                 ? 500
// // //                 : this.normalizeScoreFromAverageWeight(
// // //                     dimSums.INVESTE.sumWeight / dimSums.INVESTE.count,
// // //                 );

// // //         const overallScore = Math.round(
// // //             (desenrolaScore + organizaScore + reservaScore + investeScore) / 4,
// // //         );

// // //         // 5) Atualizar (ou criar) o FinancialProfile
// // //         const profile: FinancialProfile =
// // //             await this.financialProfileRepository.upsertByUserXPId(userXPId, {
// // //                 overallScore,
// // //                 desenrolaScore,
// // //                 organizaScore,
// // //                 reservaScore,
// // //                 investeScore,
// // //                 hasCompletedOnboarding: true,
// // //             });

// // //         const financialProfileDTO = {
// // //             overallScore: profile.overallScore,
// // //             desenrolaScore: profile.desenrolaScore,
// // //             organizaScore: profile.organizaScore,
// // //             reservaScore: profile.reservaScore,
// // //             investeScore: profile.investeScore,
// // //         };

// // //         // 6) Resposta final para o front (Fluxo B)
// // //         const response: SubmitQuizAnswersResponseDTO = {
// // //             financialProfile: financialProfileDTO,
// // //             questionsFeedback,
// // //         };

// // //         return response;
// // //     }
// // // }

// // import { injectable, inject } from "tsyringe";
// // import type { FinancialProfile } from "@/generated/prisma/client";

// // import {
// //     IQuizQuestionRepository,
// //     QuizQuestionWithOptions,
// // } from "../data/interfaces/IQuizQuestionRepository";
// // import { IFinancialProfileRepository } from "../data/interfaces/IFinancialProfileRepository";

// // import {
// //     type SubmitQuizAnswersResponseDTO,
// //     type QuestionFeedbackDTO,
// //     type QuizOptionFeedbackDTO,
// //     type FinancialDimension,
// // } from "../dtos/SubmitQuizAnswersDTO";

// // interface AnswerInput {
// //     questionId: string;
// //     optionIndex: number; // 👈 agora é índice, não id
// // }

// // interface IRequest {
// //     userXPId: string;
// //     answers: AnswerInput[];
// // }

// // type Dimension = FinancialDimension;

// // @injectable()
// // export class SubmitQuizAnswersService {
// //     constructor(
// //         @inject("QuizQuestionRepository")
// //         private quizQuestionRepository: IQuizQuestionRepository,

// //         @inject("FinancialProfileRepository")
// //         private financialProfileRepository: IFinancialProfileRepository,
// //     ) { }

// //     /**
// //      * Normaliza a média de pesos (-3 a +3) para um score 0–1000
// //      */
// //     private normalizeScoreFromAverageWeight(avgWeight: number): number {
// //         const min = -3;
// //         const max = 3;

// //         const clamped = Math.min(max, Math.max(min, avgWeight));
// //         const normalized = (clamped - min) / (max - min); // 0 a 1
// //         return Math.round(normalized * 1000); // 0 a 1000
// //     }

// //     public async execute({
// //         userXPId,
// //         answers,
// //     }: IRequest): Promise<SubmitQuizAnswersResponseDTO> {
// //         if (!answers || answers.length === 0) {
// //             throw new Error("NO_ANSWERS_PROVIDED");
// //         }

// //         // 1) Buscar todas as perguntas ativas com suas opções
// //         const questions = await this.quizQuestionRepository.findActiveWithOptions();

// //         const questionMap = new Map<string, QuizQuestionWithOptions>();
// //         questions.forEach((q) => questionMap.set(q.id, q));

// //         // 2) Acumuladores por dimensão (usam weight para o score 0–1000)
// //         const dimSums: Record<Dimension, { sumWeight: number; count: number }> = {
// //             DESENROLA: { sumWeight: 0, count: 0 },
// //             ORGANIZA: { sumWeight: 0, count: 0 },
// //             RESERVA: { sumWeight: 0, count: 0 },
// //             INVESTE: { sumWeight: 0, count: 0 },
// //         };

// //         const questionsFeedback: QuestionFeedbackDTO[] = [];

// //         // 3) Processar cada resposta do usuário
// //         for (const answer of answers) {
// //             const question = questionMap.get(answer.questionId);
// //             if (!question) {
// //                 throw new Error(`QUESTION_NOT_FOUND:${answer.questionId}`);
// //             }

// //             const options = question.options;
// //             if (!options || options.length === 0) {
// //                 continue; // ou throw, se considerar erro de modelagem
// //             }

// //             // 👇 Agora pegamos pelo índice vindo do front
// //             const selectedOption = options[answer.optionIndex];
// //             if (!selectedOption) {
// //                 throw new Error(
// //                     `OPTION_INDEX_OUT_OF_RANGE:${answer.optionIndex}:question:${answer.questionId}`,
// //                 );
// //             }

// //             // Melhor opção = maior weight
// //             let bestOption = options[0];
// //             for (const opt of options) {
// //                 if (opt.weight > bestOption.weight) {
// //                     bestOption = opt;
// //                 }
// //             }

// //             const dim = question.dimension as Dimension;

// //             // Acumula para cálculo de score da dimensão (com weight)
// //             dimSums[dim].sumWeight += selectedOption.weight;
// //             dimSums[dim].count += 1;

// //             // Pontos para UX (Fluxo B): weight * 5 (se quiser podemos trocar depois pra sempre +5/-5)
// //             const selectedOptionPoints = selectedOption.weight * 5;
// //             const bestOptionPoints = bestOption.weight * 5;

// //             const optionsFeedback: QuizOptionFeedbackDTO[] = options.map((opt) => ({
// //                 id: opt.id,
// //                 label: opt.label,
// //                 points: opt.weight * 5,
// //                 isBest: opt.id === bestOption.id,
// //                 explanation: opt.explanation ?? null,
// //             }));

// //             const questionFeedback: QuestionFeedbackDTO = {
// //                 questionId: question.id,
// //                 text: question.text,
// //                 dimension: dim,

// //                 selectedOptionId: selectedOption.id,
// //                 selectedOptionLabel: selectedOption.label,
// //                 selectedOptionPoints,
// //                 selectedOptionIsBest: selectedOption.id === bestOption.id,

// //                 bestOptionId: bestOption.id,
// //                 bestOptionLabel: bestOption.label,
// //                 bestOptionPoints,
// //                 bestOptionExplanation: bestOption.explanation ?? null,

// //                 options: optionsFeedback,
// //             };

// //             questionsFeedback.push(questionFeedback);
// //         }

// //         // 4) Calcular score por dimensão (0–1000)
// //         const desenrolaScore =
// //             dimSums.DESENROLA.count === 0
// //                 ? 500
// //                 : this.normalizeScoreFromAverageWeight(
// //                     dimSums.DESENROLA.sumWeight / dimSums.DESENROLA.count,
// //                 );

// //         const organizaScore =
// //             dimSums.ORGANIZA.count === 0
// //                 ? 500
// //                 : this.normalizeScoreFromAverageWeight(
// //                     dimSums.ORGANIZA.sumWeight / dimSums.ORGANIZA.count,
// //                 );

// //         const reservaScore =
// //             dimSums.RESERVA.count === 0
// //                 ? 500
// //                 : this.normalizeScoreFromAverageWeight(
// //                     dimSums.RESERVA.sumWeight / dimSums.RESERVA.count,
// //                 );

// //         const investeScore =
// //             dimSums.INVESTE.count === 0
// //                 ? 500
// //                 : this.normalizeScoreFromAverageWeight(
// //                     dimSums.INVESTE.sumWeight / dimSums.INVESTE.count,
// //                 );

// //         const overallScore = Math.round(
// //             (desenrolaScore + organizaScore + reservaScore + investeScore) / 4,
// //         );

// //         // 5) Atualizar (ou criar) o FinancialProfile
// //         const profile: FinancialProfile =
// //             await this.financialProfileRepository.upsertByUserXPId(userXPId, {
// //                 overallScore,
// //                 desenrolaScore,
// //                 organizaScore,
// //                 reservaScore,
// //                 investeScore,
// //                 hasCompletedOnboarding: true,
// //             });

// //         const financialProfileDTO = {
// //             overallScore: profile.overallScore,
// //             desenrolaScore: profile.desenrolaScore,
// //             organizaScore: profile.organizaScore,
// //             reservaScore: profile.reservaScore,
// //             investeScore: profile.investeScore,
// //         };

// //         // 6) Resposta final para o front (Fluxo B)
// //         const response: SubmitQuizAnswersResponseDTO = {
// //             financialProfile: financialProfileDTO,
// //             questionsFeedback,
// //         };

// //         return response;
// //     }
// // }


// import { injectable, inject } from "tsyringe";
// import type { FinancialProfile } from "@/generated/prisma/client";

// import {
//     IQuizQuestionRepository,
//     type QuizQuestionWithOptions,
// } from "../data/interfaces/IQuizQuestionRepository";
// import { IFinancialProfileRepository } from "../data/interfaces/IFinancialProfileRepository";

// import {
//     type SubmitQuizAnswersResponseDTO,
//     type QuestionFeedbackDTO,
//     type QuizOptionFeedbackDTO,
//     type FinancialDimension,
// } from "../data/dtos/SubmitQuizAnswersDTO";

// interface AnswerInput {
//     questionId: string;
//     optionIndex: number; // índice da opção escolhida
// }

// interface IRequest {
//     userXPId: string;
//     answers: AnswerInput[];
// }

// type Dimension = FinancialDimension;

// @injectable()
// export class SubmitQuizAnswersService {
//     constructor(
//         @inject("QuizQuestionRepository")
//         private quizQuestionRepository: IQuizQuestionRepository,

//         @inject("FinancialProfileRepository")
//         private financialProfileRepository: IFinancialProfileRepository,
//     ) { }

//     /**
//      * Normaliza a média de pesos (-3 a +3) para um score 0–1000
//      */
//     private normalizeScoreFromAverageWeight(avgWeight: number): number {
//         const min = -3;
//         const max = 3;

//         const clamped = Math.min(max, Math.max(min, avgWeight));
//         const normalized = (clamped - min) / (max - min); // 0 a 1
//         return Math.round(normalized * 1000); // 0 a 1000
//     }

//     public async execute({
//         userXPId,
//         answers,
//     }: IRequest): Promise<SubmitQuizAnswersResponseDTO> {
//         if (!answers || answers.length === 0) {
//             throw new Error("NO_ANSWERS_PROVIDED");
//         }

//         // 0) pegar perfil anterior (se existir) para calcular lastScoreChange
//         const previousProfile =
//             await this.financialProfileRepository.findByUserXPId(userXPId);

//         // 1) Buscar todas as perguntas ativas com suas opções
//         const questions = await this.quizQuestionRepository.findActiveWithOptions();

//         const questionMap = new Map<string, QuizQuestionWithOptions>();
//         questions.forEach((q) => questionMap.set(q.id, q));

//         // 2) Acumuladores por dimensão (usam weight para o score 0–1000)
//         const dimSums: Record<Dimension, { sumWeight: number; count: number }> = {
//             DESENROLA: { sumWeight: 0, count: 0 },
//             ORGANIZA: { sumWeight: 0, count: 0 },
//             RESERVA: { sumWeight: 0, count: 0 },
//             INVESTE: { sumWeight: 0, count: 0 },
//         };

//         const questionsFeedback: QuestionFeedbackDTO[] = [];

//         // 3) Processar cada resposta do usuário
//         for (const answer of answers) {
//             const question = questionMap.get(answer.questionId);
//             if (!question) {
//                 throw new Error(`QUESTION_NOT_FOUND:${answer.questionId}`);
//             }

//             const options = question.options;
//             if (!options || options.length === 0) {
//                 continue; // ou throw, se considerar erro de modelagem
//             }

//             // pegar opção pelo índice vindo do front
//             const selectedOption = options[answer.optionIndex];
//             if (!selectedOption) {
//                 throw new Error(
//                     `OPTION_INDEX_OUT_OF_RANGE:${answer.optionIndex}:question:${answer.questionId}`,
//                 );
//             }

//             // Melhor opção = maior weight
//             let bestOption = options[0];
//             for (const opt of options) {
//                 if (opt.weight > bestOption.weight) {
//                     bestOption = opt;
//                 }
//             }

//             const dim = question.dimension as Dimension;

//             // Acumula para cálculo de score da dimensão (com weight)
//             dimSums[dim].sumWeight += selectedOption.weight;
//             dimSums[dim].count += 1;

//             // Pontos para UX: weight * 5 (ajustável depois)
//             const selectedOptionPoints = selectedOption.weight * 5;
//             const bestOptionPoints = bestOption.weight * 5;

//             const optionsFeedback: QuizOptionFeedbackDTO[] = options.map((opt) => ({
//                 id: opt.id,
//                 label: opt.label,
//                 points: opt.weight * 5,
//                 isBest: opt.id === bestOption.id,
//                 explanation: opt.explanation ?? null,
//             }));

//             const questionFeedback: QuestionFeedbackDTO = {
//                 questionId: question.id,
//                 text: question.text,
//                 dimension: dim,

//                 selectedOptionId: selectedOption.id,
//                 selectedOptionLabel: selectedOption.label,
//                 selectedOptionPoints,
//                 selectedOptionIsBest: selectedOption.id === bestOption.id,

//                 bestOptionId: bestOption.id,
//                 bestOptionLabel: bestOption.label,
//                 bestOptionPoints,
//                 bestOptionExplanation: bestOption.explanation ?? null,

//                 options: optionsFeedback,
//             };

//             questionsFeedback.push(questionFeedback);
//         }

//         // 4) Calcular score por dimensão (0–1000)
//         const desenrolaScore =
//             dimSums.DESENROLA.count === 0
//                 ? 500
//                 : this.normalizeScoreFromAverageWeight(
//                     dimSums.DESENROLA.sumWeight / dimSums.DESENROLA.count,
//                 );

//         const organizaScore =
//             dimSums.ORGANIZA.count === 0
//                 ? 500
//                 : this.normalizeScoreFromAverageWeight(
//                     dimSums.ORGANIZA.sumWeight / dimSums.ORGANIZA.count,
//                 );

//         const reservaScore =
//             dimSums.RESERVA.count === 0
//                 ? 500
//                 : this.normalizeScoreFromAverageWeight(
//                     dimSums.RESERVA.sumWeight / dimSums.RESERVA.count,
//                 );

//         const investeScore =
//             dimSums.INVESTE.count === 0
//                 ? 500
//                 : this.normalizeScoreFromAverageWeight(
//                     dimSums.INVESTE.sumWeight / dimSums.INVESTE.count,
//                 );

//         const overallScore = Math.round(
//             (desenrolaScore + organizaScore + reservaScore + investeScore) / 4,
//         );

//         // 4.1) calcular diferença para o perfil anterior
//         const lastScoreChange = previousProfile
//             ? overallScore - previousProfile.overallScore
//             : 0;

//         // 5) Atualizar (ou criar) o FinancialProfile
//         const profile: FinancialProfile =
//             await this.financialProfileRepository.upsertByUserXPId(userXPId, {
//                 overallScore,
//                 desenrolaScore,
//                 organizaScore,
//                 reservaScore,
//                 investeScore,
//                 hasCompletedOnboarding: true,
//                 lastScoreChange,
//             });

//         const financialProfileDTO = {
//             overallScore: profile.overallScore,
//             desenrolaScore: profile.desenrolaScore,
//             organizaScore: profile.organizaScore,
//             reservaScore: profile.reservaScore,
//             investeScore: profile.investeScore,
//             lastScoreChange: profile.lastScoreChange ?? lastScoreChange,
//         };

//         // 6) Resposta final para o front
//         const response: SubmitQuizAnswersResponseDTO = {
//             financialProfile: financialProfileDTO,
//             questionsFeedback,
//         };

//         return response;
//     }
// }

// -----------------

import { injectable, inject } from "tsyringe";
import type { FinancialProfile } from "@/generated/prisma/client";

import {
    IQuizQuestionRepository,
    type QuizQuestionWithOptions,
} from "../data/interfaces/IQuizQuestionRepository";
import {
    IFinancialProfileRepository,
} from "../data/interfaces/IFinancialProfileRepository";

import {
    type SubmitQuizAnswersResponseDTO,
    type QuestionFeedbackDTO,
    type QuizOptionFeedbackDTO,
    type FinancialDimension,
} from "../data/dtos/SubmitQuizAnswersDTO";

interface AnswerInput {
    questionId: string;
    optionIndex: number; // índice da opção escolhida
}

interface IRequest {
    userXPId: string;
    answers: AnswerInput[];
}

type Dimension = FinancialDimension;

@injectable()
export class SubmitQuizAnswersService {
    constructor(
        @inject("QuizQuestionRepository")
        private quizQuestionRepository: IQuizQuestionRepository,

        @inject("FinancialProfileRepository")
        private financialProfileRepository: IFinancialProfileRepository,
    ) { }

    /**
     * Normaliza a média de pesos (-3 a +3) para um score 0–1000
     */
    private normalizeScoreFromAverageWeight(avgWeight: number): number {
        const min = -3;
        const max = 3;

        const clamped = Math.min(max, Math.max(min, avgWeight));
        const normalized = (clamped - min) / (max - min); // 0 a 1
        return Math.round(normalized * 1000); // 0 a 1000
    }

    public async execute({
        userXPId,
        answers,
    }: IRequest): Promise<SubmitQuizAnswersResponseDTO> {
        if (!answers || answers.length === 0) {
            throw new Error("NO_ANSWERS_PROVIDED");
        }

        // 1) Buscar todas as perguntas ativas com suas opções
        const questions =
            await this.quizQuestionRepository.findActiveWithOptions();

        const questionMap = new Map<string, QuizQuestionWithOptions>();
        questions.forEach((q) => questionMap.set(q.id, q));

        // 2) Acumuladores por dimensão (usam weight para o score 0–1000)
        const dimSums: Record<Dimension, { sumWeight: number; count: number }> =
        {
            DESENROLA: { sumWeight: 0, count: 0 },
            ORGANIZA: { sumWeight: 0, count: 0 },
            RESERVA: { sumWeight: 0, count: 0 },
            INVESTE: { sumWeight: 0, count: 0 },
        };

        const questionsFeedback: QuestionFeedbackDTO[] = [];

        // 3) Processar cada resposta do usuário
        for (const answer of answers) {
            const question = questionMap.get(answer.questionId);
            if (!question) {
                throw new Error(`QUESTION_NOT_FOUND:${answer.questionId}`);
            }

            const options = question.options;
            if (!options || options.length === 0) {
                continue;
            }

            const selectedOption = options[answer.optionIndex];
            if (!selectedOption) {
                throw new Error(
                    `OPTION_INDEX_OUT_OF_RANGE:${answer.optionIndex}:question:${answer.questionId}`,
                );
            }

            // Melhor opção = maior weight
            let bestOption = options[0];
            for (const opt of options) {
                if (opt.weight > bestOption.weight) {
                    bestOption = opt;
                }
            }

            const dim = question.dimension as Dimension;

            // Acumula para cálculo de score da dimensão (com weight)
            dimSums[dim].sumWeight += selectedOption.weight;
            dimSums[dim].count += 1;

            // Pontos para UX (Fluxo B): weight * 5
            const selectedOptionPoints = selectedOption.weight * 5;
            const bestOptionPoints = bestOption.weight * 5;

            const optionsFeedback: QuizOptionFeedbackDTO[] = options.map(
                (opt) => ({
                    id: opt.id,
                    label: opt.label,
                    points: opt.weight * 5,
                    isBest: opt.id === bestOption.id,
                    explanation: opt.explanation ?? null,
                }),
            );

            const questionFeedback: QuestionFeedbackDTO = {
                questionId: question.id,
                text: question.text,
                dimension: dim,

                selectedOptionId: selectedOption.id,
                selectedOptionLabel: selectedOption.label,
                selectedOptionPoints,
                selectedOptionIsBest: selectedOption.id === bestOption.id,

                bestOptionId: bestOption.id,
                bestOptionLabel: bestOption.label,
                bestOptionPoints,
                bestOptionExplanation: bestOption.explanation ?? null,

                options: optionsFeedback,
            };

            questionsFeedback.push(questionFeedback);
        }

        // 4) Calcular score por dimensão (0–1000)
        const desenrolaScore =
            dimSums.DESENROLA.count === 0
                ? 500
                : this.normalizeScoreFromAverageWeight(
                    dimSums.DESENROLA.sumWeight /
                    dimSums.DESENROLA.count,
                );

        const organizaScore =
            dimSums.ORGANIZA.count === 0
                ? 500
                : this.normalizeScoreFromAverageWeight(
                    dimSums.ORGANIZA.sumWeight /
                    dimSums.ORGANIZA.count,
                );

        const reservaScore =
            dimSums.RESERVA.count === 0
                ? 500
                : this.normalizeScoreFromAverageWeight(
                    dimSums.RESERVA.sumWeight /
                    dimSums.RESERVA.count,
                );

        const investeScore =
            dimSums.INVESTE.count === 0
                ? 500
                : this.normalizeScoreFromAverageWeight(
                    dimSums.INVESTE.sumWeight /
                    dimSums.INVESTE.count,
                );

        const overallScore = Math.round(
            (desenrolaScore +
                organizaScore +
                reservaScore +
                investeScore) /
            4,
        );

        // 5) Pegar perfil anterior para calcular lastScoreChange
        const previousProfile: FinancialProfile | null =
            await this.financialProfileRepository.findByUserXPId(userXPId);

        const previousOverall = previousProfile?.overallScore ?? 500;
        const lastScoreChange = overallScore - previousOverall;

        // hasCompletedOnboarding passa a ser true depois de responder o quiz
        const profile: FinancialProfile =
            await this.financialProfileRepository.upsertByUserXPId(userXPId, {
                overallScore,
                desenrolaScore,
                organizaScore,
                reservaScore,
                investeScore,
                hasCompletedOnboarding: true,
                lastScoreChange,
            });

        const financialProfileDTO = {
            overallScore: profile.overallScore,
            desenrolaScore: profile.desenrolaScore,
            organizaScore: profile.organizaScore,
            reservaScore: profile.reservaScore,
            investeScore: profile.investeScore,
        };

        const response: SubmitQuizAnswersResponseDTO = {
            financialProfile: financialProfileDTO,
            questionsFeedback,
        };

        return response;
    }
}
