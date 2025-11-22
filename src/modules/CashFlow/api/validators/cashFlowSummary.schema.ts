// import { z } from "zod";

// export const cashFlowSummaryQuerySchema = z.object({
//     month: z
//         .coerce
//         .number()
//         .int()
//         .min(1)
//         .max(12)
//         .optional(),

//     year: z
//         .coerce
//         .number()
//         .int()
//         .min(2000)
//         .max(2100)
//         .optional(),
// });

// export type CashFlowSummaryQuery = z.infer<
//     typeof cashFlowSummaryQuerySchema
// >;

// -------

import { z } from "zod";

export const cashFlowSummaryQuerySchema = z.object({
    month: z
        .coerce.number()
        .int()
        .min(1)
        .max(12)
        .optional(),

    year: z
        .coerce.number()
        .int()
        .min(2000)
        .max(2100)
        .optional(),
});

export type CashFlowSummaryQuery = z.infer<
    typeof cashFlowSummaryQuerySchema
>;
