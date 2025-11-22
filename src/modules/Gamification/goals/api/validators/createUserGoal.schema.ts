// import { z } from "zod";

// export const createUserGoalBodySchema = z.object({
//     goalId: z.string().optional(),
//     customTitle: z.string().min(1, "customTitle is required"),
//     targetAmount: z.number().int().positive(),
//     targetDate: z.string().datetime(), // ISO string
// });

// export type CreateUserGoalBody = z.infer<typeof createUserGoalBodySchema>;

// import { z } from "zod";

// export const createUserGoalBodySchema = z.object({
//     // id do template (Goal.id) – opcional
//     templateId: z.string().optional(),

//     // título que vai aparecer pro usuário
//     customTitle: z
//         .string()
//         .min(3, "customTitle must have at least 3 characters")
//         .max(120, "customTitle must have at most 120 characters"),

//     // valor que o usuário quer atingir
//     targetAmount: z
//         .number({
//             required_error: "targetAmount is required",
//             invalid_type_error: "targetAmount must be a number",
//         })
//         .positive("targetAmount must be greater than 0"),

//     // quanto já tem hoje (default 0)
//     currentAmount: z
//         .number({
//             invalid_type_error: "currentAmount must be a number",
//         })
//         .nonnegative("currentAmount cannot be negative")
//         .optional()
//         .default(0),

//     // data alvo (pode ser uma string qualquer de data, vamos validar no service)
//     targetDate: z.string().optional(),
// });

// export type CreateUserGoalBody = z.infer<typeof createUserGoalBodySchema>;

// import { z } from "zod";

// export const createUserGoalBodySchema = z.object({
//     templateId: z.string().optional(),
//     customTitle: z
//         .string()
//         .min(3, "customTitle must have at least 3 characters")
//         .max(120, "customTitle must have at most 120 characters"),
//     targetAmount: z
//         .number({
//             required_error: "targetAmount is required",
//             invalid_type_error: "targetAmount must be a number",
//         })
//         .positive("targetAmount must be greater than 0"),
//     currentAmount: z
//         .number({
//             invalid_type_error: "currentAmount must be a number",
//         })
//         .nonnegative("currentAmount cannot be negative")
//         .optional()
//         .default(0),

//     targetDate: z
//         .string({
//             required_error: "targetDate is required",
//             invalid_type_error: "targetDate must be a string",
//         }),
// });

import { z } from "zod";

export const createUserGoalBodySchema = z.object({
    // id do template (Goal.id) – opcional
    templateId: z.string().optional(),

    // título que vai aparecer pro usuário
    customTitle: z
        .string()
        .min(3, "customTitle must have at least 3 characters")
        .max(120, "customTitle must have at most 120 characters"),

    // valor que o usuário quer atingir
    targetAmount: z
        .number() // <- sem objeto com required_error / invalid_type_error
        .positive("targetAmount must be greater than 0"),

    // quanto já tem hoje (default 0)
    currentAmount: z
        .number()
        .nonnegative("currentAmount cannot be negative")
        .optional()
        .default(0),

    // data alvo (string obrigatória; validamos o parse no service)
    targetDate: z
        .string()
        .min(1, "targetDate is required"),
});

export type CreateUserGoalBody = z.infer<typeof createUserGoalBodySchema>;
