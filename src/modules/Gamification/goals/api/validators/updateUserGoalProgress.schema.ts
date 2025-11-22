import { z } from "zod";

export const updateUserGoalProgressBodySchema = z.object({
    currentAmount: z.number().int().nonnegative(),
});

export type UpdateUserGoalProgressBody = z.infer<
    typeof updateUserGoalProgressBodySchema
>;
