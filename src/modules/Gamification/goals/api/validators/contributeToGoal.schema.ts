import { z } from "zod";

export const contributeToGoalBodySchema = z.object({
    amount: z
        .coerce
        .number()
        .int("amount deve ser um número inteiro")
        .positive("amount deve ser maior que zero"),

    date: z.coerce.date().optional(),

    label: z.string().min(1).optional(),

    // categoria livre (opcional, default = META_<DIMENSÃO> dentro do service)
    category: z.string().min(1).optional(),

    recipient: z.string().min(1).optional(),
});

export type ContributeToGoalBody = z.infer<typeof contributeToGoalBodySchema>;
