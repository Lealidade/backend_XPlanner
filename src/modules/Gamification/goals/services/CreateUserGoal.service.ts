// import { injectable, inject } from "tsyringe";
// import type { UserGoal } from "@/generated/prisma/client";
// import type { IGoalRepository } from "../data/interfaces/IGoalRepository";
// import type { IUserGoalRepository } from "../data/interfaces/IUserGoalRepository";

// interface IRequest {
//     userXPId: string;
//     goalId?: string;
//     customTitle: string;
//     targetAmount: number;
//     targetDate: Date;
// }

// @injectable()
// export class CreateUserGoalService {
//     constructor(
//         @inject("GoalRepository")
//         private goalRepository: IGoalRepository,

//         @inject("UserGoalRepository")
//         private userGoalRepository: IUserGoalRepository,
//     ) { }

//     public async execute({
//         userXPId,
//         goalId,
//         customTitle,
//         targetAmount,
//         targetDate,
//     }: IRequest): Promise<UserGoal> {
//         // calcula meses até a meta (bem simples, pra hackaton)
//         const now = new Date();
//         const monthsDiff =
//             (targetDate.getFullYear() - now.getFullYear()) * 12 +
//             (targetDate.getMonth() - now.getMonth());

//         const months = Math.max(monthsDiff, 1);
//         const recommendedMonthlyDeposit = Math.round(targetAmount / months);

//         let xpCoinsRewardOnCompletion = 0;

//         if (goalId) {
//             const template = await this.goalRepository.findById(goalId);
//             if (!template) {
//                 throw new Error("GOAL_TEMPLATE_NOT_FOUND");
//             }
//             xpCoinsRewardOnCompletion = template.xpCoinsRewardOnCompletion;
//             // se quiser, pode sobrescrever customTitle com template.title aqui
//             if (!customTitle) {
//                 customTitle = template.title;
//             }
//         }

//         const userGoal = await this.userGoalRepository.create({
//             userXPId,
//             goalId,
//             customTitle,
//             targetAmount,
//             targetDate,
//             recommendedMonthlyDeposit,
//             xpCoinsRewardOnCompletion,
//         });

//         return userGoal;
//     }
// }

import { inject, injectable } from "tsyringe";
import type { UserGoal } from "@/generated/prisma/client";
import type { IUserGoalRepository } from "../data/interfaces/IUserGoalRepository";

// interface IRequest {
//     userXPId: string;
//     templateId?: string;
//     customTitle: string;
//     targetAmount: number;
//     currentAmount?: number;
//     targetDate?: string;
// }

interface IRequest {
    userXPId: string;
    templateId?: string;
    customTitle: string;
    targetAmount: number;
    currentAmount?: number;
    targetDate: string; // <- agora obrigatório
}


@injectable()
export class CreateUserGoalService {
    constructor(
        @inject("UserGoalRepository")
        private userGoalRepository: IUserGoalRepository,
    ) { }

    // private calculateRecommendedMonthlyDeposit(
    //     targetAmount: number,
    //     currentAmount: number,
    //     targetDate?: Date | null,
    // ): number | null {
    //     if (!targetDate) return null;

    //     const now = new Date();
    //     if (targetDate <= now) return null;

    //     const diffMs = targetDate.getTime() - now.getTime();
    //     const months = diffMs / (1000 * 60 * 60 * 24 * 30); // aprox. meses

    //     if (months <= 0) return null;

    //     const remaining = Math.max(0, targetAmount - currentAmount);
    //     return Math.ceil(remaining / months);
    // }

    private calculateRecommendedMonthlyDeposit(
        targetAmount: number,
        currentAmount: number,
        targetDate: Date,
    ): number {
        const now = new Date();
        if (targetDate <= now) return 0;

        const diffMs = targetDate.getTime() - now.getTime();
        const months = diffMs / (1000 * 60 * 60 * 24 * 30); // aproximação

        if (months <= 0) return 0;

        const remaining = Math.max(0, targetAmount - currentAmount);
        return Math.ceil(remaining / months);
    }


    // public async execute({
    //     userXPId,
    //     templateId,
    //     customTitle,
    //     targetAmount,
    //     currentAmount = 0,
    //     targetDate,
    // }: IRequest): Promise<UserGoal> {
    //     // valida e converte a data
    //     let parsedTargetDate: Date | null = null;
    //     if (targetDate) {
    //         const d = new Date(targetDate);
    //         if (Number.isNaN(d.getTime())) {
    //             throw new Error("INVALID_TARGET_DATE");
    //         }
    //         parsedTargetDate = d;
    //     }

    //     const recommendedMonthlyDeposit = this.calculateRecommendedMonthlyDeposit(
    //         targetAmount,
    //         currentAmount,
    //         parsedTargetDate,
    //     );

    //     const progressPercent =
    //         targetAmount > 0
    //             ? Math.min(100, Math.round((currentAmount / targetAmount) * 100))
    //             : 0;

    //     const userGoal = await this.userGoalRepository.create({
    //         userXPId,
    //         goalId: templateId ?? null,
    //         customTitle,
    //         targetAmount,
    //         currentAmount,
    //         targetDate: parsedTargetDate,
    //         recommendedMonthlyDeposit,
    //         progressPercent,
    //         isActive: true,
    //     });

    //     return userGoal;
    // }

    public async execute({
        userXPId,
        templateId,
        customTitle,
        targetAmount,
        currentAmount = 0,
        targetDate,
    }: IRequest): Promise<UserGoal> {
        // 1) targetDate é obrigatório
        if (!targetDate) {
            throw new Error("TARGET_DATE_REQUIRED");
        }

        // 2) parse da data
        const parsedTargetDate = new Date(targetDate);
        if (Number.isNaN(parsedTargetDate.getTime())) {
            throw new Error("INVALID_TARGET_DATE");
        }

        // 3) cálculo da recomendação
        const recommendedMonthlyDeposit =
            this.calculateRecommendedMonthlyDeposit(
                targetAmount,
                currentAmount,
                parsedTargetDate,
            );

        // 4) progresso inicial
        const progressPercent =
            targetAmount > 0
                ? Math.min(100, Math.round((currentAmount / targetAmount) * 100))
                : 0;

        // 5) chama o repositório com tipos já certinhos
        const userGoal = await this.userGoalRepository.create({
            userXPId,
            goalId: templateId ?? null,
            customTitle,
            targetAmount,
            currentAmount,
            targetDate: parsedTargetDate,           // <- Date
            recommendedMonthlyDeposit,              // <- number
            progressPercent,
            isActive: true,
        });

        return userGoal;
    }

}
