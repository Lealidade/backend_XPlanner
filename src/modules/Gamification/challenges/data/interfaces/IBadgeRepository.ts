import type { Badge } from "@/generated/prisma/client";

export interface IBadgeRepository {
    findById(id: string): Promise<Badge | null>;
}
