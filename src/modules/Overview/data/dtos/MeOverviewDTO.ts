// src/modules/Overview/dtos/MeOverviewDTO.ts

// Mesmos valores dos enums do Prisma
export type FinancialDimension = "DESENROLA" | "ORGANIZA" | "RESERVA" | "INVESTE";

export type LearningPathLevel = "BASIC" | "INTERMEDIATE" | "ADVANCED";

export type LearningContentType = "ARTICLE" | "VIDEO" | "TOOL" | "OTHER";

/**
 * Bloco "user" da resposta
 * Junta infos do User (Better Auth) + UserXP + flag de onboarding.
 */
export interface MeOverviewUserDTO {
    name: string | null;
    email: string;
    username: string | null;
    birthYear: number | null;
    hasCompletedOnboarding: boolean;
}

/**
 * Bloco "financialProfile" da resposta
 * Se o usuário ainda não fez o onboarding, esse bloco será null.
 */
export interface MeOverviewFinancialProfileDTO {
    overallScore: number;
    desenrolaScore: number;
    organizaScore: number;
    reservaScore: number;
    investeScore: number;
}

/**
 * Trilhas recomendadas que aparecerão na home.
 * Cada card de trilha terá esses dados.
 */
export interface MeOverviewLearningPathDTO {
    id: string;
    slug: string;
    title: string;
    description: string;
    dimension: FinancialDimension;
    level: LearningPathLevel;
    estimatedMinutes: number | null;

    // Progresso do usuário nessa trilha
    progressPercent: number; // 0 a 100
    totalSteps: number;
    completedSteps: number;
}

/**
 * Tipos possíveis de Call to Action (nudge)
 */
export type CallToActionType =
    | "COMPLETE_ONBOARDING"
    | "START_LEARNING_PATH"
    | "CONTINUE_LEARNING_PATH";

/**
 * Call to Action genérico, com discriminated union por "type"
 */
export type MeOverviewCallToActionDTO =
    | {
        type: "COMPLETE_ONBOARDING";
        message: string;
    }
    | {
        type: "START_LEARNING_PATH";
        message: string;
        learningPathId: string;
    }
    | {
        type: "CONTINUE_LEARNING_PATH";
        message: string;
        learningPathId: string;
    };

/**
 * Resposta completa do endpoint GET /me/overview
 */
export interface MeOverviewResponseDTO {
    user: MeOverviewUserDTO;
    financialProfile: MeOverviewFinancialProfileDTO | null;
    recommendedPaths: MeOverviewLearningPathDTO[];
    callToAction: MeOverviewCallToActionDTO | null;
}
