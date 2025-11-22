// // src/modules/CashFlow/api/validators/createCashFlow.schema.ts
// import { z } from "zod";
// import { CashFlowOperation } from "@/generated/prisma/client";

// export const createCashFlowBodySchema = z.object({
//     // data (aceita string e converte para Date)
//     date: z.coerce.date(),

//     // descrição da linha
//     label: z.string().min(1, "label é obrigatório"),

//     // categoria livre
//     category: z.string().min(1, "categoria é obrigatória"),

//     // operação: INCOME | EXPENSE | TRANSFER
//     operation: z.nativeEnum(CashFlowOperation, {
//         // 👇 aqui é "error" em vez de errorMap
//         error: "operation inválida (INCOME, EXPENSE ou TRANSFER)",
//     }),

//     // amount em número (coerce aceita string "1000" também)
//     amount: z.coerce
//         .number()
//         .int("amount deve ser um número inteiro")
//         .nonnegative("amount não pode ser negativo"),

//     // meta associada (opcional)
//     userGoalId: z.string().optional().nullable(),

//     // para exibirmos "Supermercado X", "XP Investimentos", etc (opcional)
//     recipient: z.string().min(1).optional(),
// });

// export type CreateCashFlowBody = z.infer<typeof createCashFlowBodySchema>;

// -----------

import { z } from "zod";
import { CashFlowOperation } from "@/generated/prisma/client";

export const createCashFlowBodySchema = z
    .object({
        // data opcional, ISO string; se não vier, usamos now() no controller
        date: z.string().datetime().optional(),

        // descrição da linha
        label: z.string().min(1, "label é obrigatório"),

        // categoria livre
        category: z.string().min(1, "categoria é obrigatória"),

        // operação: INCOME | EXPENSE | TRANSFER
        operation: z.nativeEnum(CashFlowOperation),

        // amount em número (coerce aceita string "1000" também)
        amount: z.coerce
            .number()
            .int("amount deve ser um número inteiro")
            .nonnegative("amount não pode ser negativo"),

        // meta associada (opcional; obrigatória se operation = TRANSFER)
        userGoalId: z.string().optional().nullable(),

        // para exibirmos "Supermercado X", "XP Investimentos", etc (opcional)
        recipient: z.string().min(1).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.operation === CashFlowOperation.TRANSFER && !data.userGoalId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["userGoalId"],
                message:
                    "userGoalId é obrigatório quando operation = TRANSFER (aportes devem estar ligados a uma meta).",
            });
        }
    });

export type CreateCashFlowBody = z.infer<typeof createCashFlowBodySchema>;
