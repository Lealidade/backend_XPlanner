// import type { UserChallengeProgress } from "@/generated/prisma/client";

// // export interface CreateUserChallengeProgressInput {
// //     userXPId: string;
// //     challengeId: string;
// //     startDate: Date;
// //     endDate?: Date | null;
// //     currentProgress: number;
// //     isCompleted: boolean;
// //     completedAt?: Date | null;
// // }

// // export interface UpdateUserChallengeProgressInput {
// //     currentProgress?: number;
// //     isCompleted?: boolean;
// //     endDate?: Date | null;
// //     completedAt?: Date | null;
// // }

// export interface IUserChallengeProgressRepository {
//     findByUserXPAndChallenge(
//         userXPId: string,
//         challengeId: string,
//     ): Promise<UserChallengeProgress | null>;

//     listByUserXP(userXPId: string): Promise<UserChallengeProgress[]>;

//     create(
//         data: CreateUserChallengeProgressInput,
//     ): Promise<UserChallengeProgress>;

//     update(
//         id: string,
//         data: UpdateUserChallengeProgressInput,
//     ): Promise<UserChallengeProgress>;
// }

// export interface CreateUserChallengeProgressInput {
//     userXPId: string;
//     challengeId: string;
//     startDate: Date;
//     endDate?: Date;          // 👈 sem null
//     currentProgress: number;
//     isCompleted: boolean;
//     completedAt?: Date | null; // completedAt pode ser null
// }

// export interface UpdateUserChallengeProgressInput {
//     currentProgress?: number;
//     isCompleted?: boolean;
//     endDate?: Date;          // 👈 sem null
//     completedAt?: Date | null;
// }

import type { UserChallengeProgress } from "@/generated/prisma/client";

/**
 * DTO usado para criar um progresso de desafio.
 * endDate é OBRIGATÓRIO aqui porque no Prisma o campo também é obrigatório
 * (o tipo do create tem endDate: string | Date, sem ?).
 */
export interface CreateUserChallengeProgressInput {
    userXPId: string;
    challengeId: string;
    startDate: Date;
    endDate: Date;           // 👈 obrigatório
    currentProgress: number;
    isCompleted: boolean;
    completedAt?: Date | null;
}

/**
 * DTO para atualizar um progresso existente.
 * Aqui endDate é opcional, porque podemos não querer alterar o prazo.
 */
export interface UpdateUserChallengeProgressInput {
    currentProgress?: number;
    isCompleted?: boolean;
    endDate?: Date;          // opcional
    completedAt?: Date | null;
}

export interface IUserChallengeProgressRepository {
    findByUserXPAndChallenge(
        userXPId: string,
        challengeId: string,
    ): Promise<UserChallengeProgress | null>;

    listByUserXP(userXPId: string): Promise<UserChallengeProgress[]>;

    create(
        data: CreateUserChallengeProgressInput,
    ): Promise<UserChallengeProgress>;

    update(
        id: string,
        data: UpdateUserChallengeProgressInput,
    ): Promise<UserChallengeProgress>;
}
