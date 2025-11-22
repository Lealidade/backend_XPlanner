// // import { prisma } from "@/database/prismaClient";
// // import type { UserChallengeProgress } from "@/generated/prisma/client";
// // import type {
// //     CreateUserChallengeProgressInput,
// //     UpdateUserChallengeProgressInput,
// //     IUserChallengeProgressRepository,
// // } from "../interfaces/IUserChallengeProgressRepository";

// // export class UserChallengeProgressRepository
// //     implements IUserChallengeProgressRepository {

// //     async findByUserXPAndChallenge(
// //         userXPId: string,
// //         challengeId: string,
// //     ): Promise<UserChallengeProgress | null> {
// //         return prisma.userChallengeProgress.findFirst({
// //             where: { userXPId, challengeId },
// //         });
// //     }

// //     async listByUserXP(userXPId: string): Promise<UserChallengeProgress[]> {
// //         return prisma.userChallengeProgress.findMany({
// //             where: { userXPId },
// //         });
// //     }

// //     async create(
// //         data: CreateUserChallengeProgressInput,
// //     ): Promise<UserChallengeProgress> {
// //         return prisma.userChallengeProgress.create({
// //             data: {
// //                 userXPId: data.userXPId,
// //                 challengeId: data.challengeId,
// //                 startDate: data.startDate,
// //                 endDate: data.endDate ?? null,
// //                 currentProgress: data.currentProgress,
// //                 isCompleted: data.isCompleted,
// //                 completedAt: data.completedAt ?? null,
// //             },
// //         });
// //     }

// //     async update(
// //         id: string,
// //         data: UpdateUserChallengeProgressInput,
// //     ): Promise<UserChallengeProgress> {
// //         return prisma.userChallengeProgress.update({
// //             where: { id },
// //             data: {
// //                 currentProgress: data.currentProgress,
// //                 isCompleted: data.isCompleted,
// //                 endDate: data.endDate,
// //                 completedAt: data.completedAt,
// //             },
// //         });
// //     }
// // }

// import { prisma } from "@/database/prismaClient";
// import type { UserChallengeProgress } from "@/generated/prisma/client";
// import type {
//     CreateUserChallengeProgressInput,
//     UpdateUserChallengeProgressInput,
//     IUserChallengeProgressRepository,
// } from "../interfaces/IUserChallengeProgressRepository";

// export class UserChallengeProgressRepository
//     implements IUserChallengeProgressRepository {
//     async findByUserXPAndChallenge(
//         userXPId: string,
//         challengeId: string,
//     ): Promise<UserChallengeProgress | null> {
//         return prisma.userChallengeProgress.findFirst({
//             where: { userXPId, challengeId },
//         });
//     }

//     async listByUserXP(userXPId: string): Promise<UserChallengeProgress[]> {
//         return prisma.userChallengeProgress.findMany({
//             where: { userXPId },
//         });
//     }

//     async create(
//         data: CreateUserChallengeProgressInput,
//     ): Promise<UserChallengeProgress> {
//         return prisma.userChallengeProgress.create({
//             data: {
//                 userXPId: data.userXPId,
//                 challengeId: data.challengeId,
//                 startDate: data.startDate,
//                 // 👇 aqui o ajuste: nunca mandar null, só Date ou undefined
//                 endDate: data.endDate ?? undefined,
//                 currentProgress: data.currentProgress,
//                 isCompleted: data.isCompleted,
//                 completedAt: data.completedAt ?? undefined,
//             },
//         });
//     }

//     async update(
//         id: string,
//         data: UpdateUserChallengeProgressInput,
//     ): Promise<UserChallengeProgress> {
//         return prisma.userChallengeProgress.update({
//             where: { id },
//             data: {
//                 currentProgress: data.currentProgress,
//                 isCompleted: data.isCompleted,
//                 // idem aqui, evita null explícito
//                 endDate: data.endDate ?? undefined,
//                 completedAt: data.completedAt ?? undefined,
//             },
//         });
//     }
// }

import { prisma } from "@/database/prismaClient";
import type { UserChallengeProgress } from "@/generated/prisma/client";
import type {
    CreateUserChallengeProgressInput,
    UpdateUserChallengeProgressInput,
    IUserChallengeProgressRepository,
} from "../interfaces/IUserChallengeProgressRepository";

export class UserChallengeProgressRepository
    implements IUserChallengeProgressRepository {

    async findByUserXPAndChallenge(
        userXPId: string,
        challengeId: string,
    ): Promise<UserChallengeProgress | null> {
        return prisma.userChallengeProgress.findFirst({
            where: { userXPId, challengeId },
        });
    }

    async listByUserXP(userXPId: string): Promise<UserChallengeProgress[]> {
        return prisma.userChallengeProgress.findMany({
            where: { userXPId },
        });
    }

    async create(
        data: CreateUserChallengeProgressInput,
    ): Promise<UserChallengeProgress> {
        return prisma.userChallengeProgress.create({
            data: {
                userXPId: data.userXPId,
                challengeId: data.challengeId,
                startDate: data.startDate,
                // agora endDate é Date | undefined → compatível
                endDate: data.endDate,
                currentProgress: data.currentProgress,
                isCompleted: data.isCompleted,
                completedAt: data.completedAt ?? null,
            },
        });
    }

    async update(
        id: string,
        data: UpdateUserChallengeProgressInput,
    ): Promise<UserChallengeProgress> {
        return prisma.userChallengeProgress.update({
            where: { id },
            data: {
                currentProgress: data.currentProgress,
                isCompleted: data.isCompleted,
                endDate: data.endDate,
                completedAt: data.completedAt,
            },
        });
    }
}
