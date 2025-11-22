import { z } from "zod";

export const contributeToGoalBodySchema = z.object({
    // valor do aporte que vai para a meta
    amount: z
        .coerce
        .number()
        .int("amount deve ser um número inteiro")
        .positive("amount deve ser maior que zero"),

    // data da movimentação (opcional, default = agora)
    date: z.coerce.date().optional(),

    // rótulo da movimentação no extrato (opcional)
    label: z.string().min(1).optional(),

    // categoria livre (opcional, default = META_<DIMENSÃO> dentro do service)
    category: z.string().min(1).optional(),

    // ex: "XP Investimentos"
    recipient: z.string().min(1).optional(),
});

export type ContributeToGoalBody = z.infer<typeof contributeToGoalBodySchema>;
