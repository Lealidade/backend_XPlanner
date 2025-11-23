import { z } from "zod";
import { CashFlowOperation } from "@/generated/prisma/client";

export const createCashFlowBodySchema = z
    .object({
        date: z.string().datetime().optional(),

        label: z.string().min(1, "label é obrigatório"),

        category: z.string().min(1, "categoria é obrigatória"),

        operation: z.nativeEnum(CashFlowOperation),

        amount: z.coerce
            .number()
            .int("amount deve ser um número inteiro")
            .nonnegative("amount não pode ser negativo"),

        userGoalId: z.string().optional().nullable(),

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
