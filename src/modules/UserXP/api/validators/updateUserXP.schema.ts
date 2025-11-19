import { z } from "zod";

export const updateUserXPBodySchema = z.object({
    username: z
        .string()
        .min(3, { message: "username must have at least 3 characters" })
        .max(50, { message: "username must have at most 50 characters" })
        .optional()
        .nullable(),

    birthYear: z
        .number()
        .int({ message: "birthYear must be an integer" })
        .gte(1900, { message: "birthYear must be >= 1900" })
        .lte(new Date().getFullYear(), {
            message: "birthYear cannot be in the future",
        })
        .optional()
        .nullable(),
});

export type UpdateUserXPBody = z.infer<typeof updateUserXPBodySchema>;
