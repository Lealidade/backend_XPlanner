import type { Challenge } from "@/generated/prisma/client";

export interface IChallengeRepository {
    findAll(): Promise<Challenge[]>;
    findById(id: string): Promise<Challenge | null>;
}
