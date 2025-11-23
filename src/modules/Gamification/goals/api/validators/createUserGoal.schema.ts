import { z } from "zod";

export const createUserGoalBodySchema = z.object({
    templateId: z.string().optional(),

    customTitle: z
        .string()
        .min(3, "customTitle must have at least 3 characters")
        .max(120, "customTitle must have at most 120 characters"),

    targetAmount: z
        .number()
        .positive("targetAmount must be greater than 0"),

    currentAmount: z
        .number()
        .nonnegative("currentAmount cannot be negative")
        .optional()
        .default(0),

    targetDate: z
        .string()
        .min(1, "targetDate is required"),
});

export type CreateUserGoalBody = z.infer<typeof createUserGoalBodySchema>;
