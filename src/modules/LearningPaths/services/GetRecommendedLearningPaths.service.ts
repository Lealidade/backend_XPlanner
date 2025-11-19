import { injectable, inject } from "tsyringe";
import type { FinancialProfile } from "@/generated/prisma/client";
import {
    ILearningPathRepository,
    LearningPathWithSteps,
} from "../data/interfaces/ILearningPathRepository";
import { IFinancialProfileRepository } from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";

type DimensionKey = "DESENROLA" | "ORGANIZA" | "RESERVA" | "INVESTE";

interface IRequest {
    userXPId: string;
}

export interface RecommendedLearningStepDTO {
    id: string;
    order: number;
    title: string;
    type: string;
    xpContentUrl: string | null;
    estimatedMinutes: number | null;
}

export interface RecommendedLearningPathDTO {
    id: string;
    slug: string;
    title: string;
    description: string;
    dimension: DimensionKey;
    level: string;
    estimatedMinutes: number | null;
    priority: number;
    steps: RecommendedLearningStepDTO[];
}

export interface GetRecommendedLearningPathsResult {
    profile: {
        overallScore: number;
        desenrolaScore: number;
        organizaScore: number;
        reservaScore: number;
        investeScore: number;
    };
    recommendedPaths: RecommendedLearningPathDTO[];
}

@injectable()
export class GetRecommendedLearningPathsService {
    constructor(
        @inject("LearningPathRepository")
        private learningPathRepository: ILearningPathRepository,

        @inject("FinancialProfileRepository")
        private financialProfileRepository: IFinancialProfileRepository,
    ) { }

    private buildDimensionScores(
        profile: FinancialProfile,
    ): Record<DimensionKey, number> {
        return {
            DESENROLA: profile.desenrolaScore,
            ORGANIZA: profile.organizaScore,
            RESERVA: profile.reservaScore,
            INVESTE: profile.investeScore,
        };
    }

    public async execute({
        userXPId,
    }: IRequest): Promise<GetRecommendedLearningPathsResult> {
        const profile = await this.financialProfileRepository.findByUserXPId(
            userXPId,
        );

        if (!profile) {
            // Controller trata essa mensagem
            throw new Error("FINANCIAL_PROFILE_NOT_FOUND");
        }

        const paths = await this.learningPathRepository.findAllActiveWithSteps();

        const dimensionScores = this.buildDimensionScores(profile);

        const dimensionsSorted: DimensionKey[] = (
            Object.keys(dimensionScores) as DimensionKey[]
        ).sort((a, b) => dimensionScores[a] - dimensionScores[b]); // pior score primeiro

        const dimensionPriority: Record<DimensionKey, number> = {
            DESENROLA: 999,
            ORGANIZA: 999,
            RESERVA: 999,
            INVESTE: 999,
        };

        dimensionsSorted.forEach((dim, index) => {
            dimensionPriority[dim] = index + 1;
        });

        const pathsSorted: LearningPathWithSteps[] = paths
            .slice()
            .sort((a, b) => {
                const prioA = dimensionPriority[a.dimension as DimensionKey] ?? 999;
                const prioB = dimensionPriority[b.dimension as DimensionKey] ?? 999;

                if (prioA !== prioB) {
                    return prioA - prioB;
                }

                return a.order - b.order;
            });

        const recommendedPaths: RecommendedLearningPathDTO[] = pathsSorted.map(
            (path) => ({
                id: path.id,
                slug: path.slug,
                title: path.title,
                description: path.description,
                dimension: path.dimension as DimensionKey,
                level: path.level,
                estimatedMinutes: path.estimatedMinutes,
                priority: dimensionPriority[path.dimension as DimensionKey] ?? 999,
                steps: path.steps.map((step) => ({
                    id: step.id,
                    order: step.order,
                    title: step.title,
                    type: step.type,
                    xpContentUrl: step.xpContentUrl,
                    estimatedMinutes: step.estimatedMinutes,
                })),
            }),
        );

        return {
            profile: {
                overallScore: profile.overallScore,
                desenrolaScore: profile.desenrolaScore,
                organizaScore: profile.organizaScore,
                reservaScore: profile.reservaScore,
                investeScore: profile.investeScore,
            },
            recommendedPaths,
        };
    }
}
