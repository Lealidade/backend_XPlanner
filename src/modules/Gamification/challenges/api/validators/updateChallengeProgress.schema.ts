import { z } from "zod";

export const updateChallengeProgressBodySchema = z.object({
    currentProgress: z
        .number()
        .nonnegative("currentProgress cannot be negative"),

    isCompleted: z.boolean().optional(),
});

export type UpdateChallengeProgressBody = z.infer<
    typeof updateChallengeProgressBodySchema
>;
