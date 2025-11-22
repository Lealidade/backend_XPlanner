// // src/modules/Onboarding/dtos/SubmitQuizAnswersDTO.ts

// // mesmos valores do enum FinancialDimension do Prisma
// export type FinancialDimension = "DESENROLA" | "ORGANIZA" | "RESERVA" | "INVESTE";

// export interface QuizOptionFeedbackDTO {
//     id: string;
//     label: string;
//     points: number; // ex: -5, 0, +5
//     isBest: boolean;
//     explanation: string | null;
// }

// export interface QuestionFeedbackDTO {
//     questionId: string;
//     text: string;
//     dimension: FinancialDimension;

//     selectedOptionId: string;
//     selectedOptionLabel: string;
//     selectedOptionPoints: number;
//     selectedOptionIsBest: boolean;

//     bestOptionId: string;
//     bestOptionLabel: string;
//     bestOptionPoints: number;
//     bestOptionExplanation: string | null;

//     options: QuizOptionFeedbackDTO[];
// }

// export interface FinancialProfileDTO {
//     overallScore: number;
//     desenrolaScore: number;
//     organizaScore: number;
//     reservaScore: number;
//     investeScore: number;
// }

// export interface SubmitQuizAnswersResponseDTO {
//     financialProfile: FinancialProfileDTO;
//     questionsFeedback: QuestionFeedbackDTO[];
// }

// -------

// mesmos valores do enum FinancialDimension do Prisma
export type FinancialDimension =
    | "DESENROLA"
    | "ORGANIZA"
    | "RESERVA"
    | "INVESTE";

export interface QuizOptionFeedbackDTO {
    id: string;
    label: string;
    points: number; // ex: -5, 0, +5
    isBest: boolean;
    explanation: string | null;
}

export interface QuestionFeedbackDTO {
    questionId: string;
    text: string;
    dimension: FinancialDimension;

    selectedOptionId: string;
    selectedOptionLabel: string;
    selectedOptionPoints: number;
    selectedOptionIsBest: boolean;

    bestOptionId: string;
    bestOptionLabel: string;
    bestOptionPoints: number;
    bestOptionExplanation: string | null;

    options: QuizOptionFeedbackDTO[];
}

export interface FinancialProfileDTO {
    overallScore: number;
    desenrolaScore: number;
    organizaScore: number;
    reservaScore: number;
    investeScore: number;
    // usado no card: "+45 pontos esse mês"
    lastScoreChange: number;
}

export interface SubmitQuizAnswersResponseDTO {
    financialProfile: FinancialProfileDTO;
    questionsFeedback: QuestionFeedbackDTO[];
}
