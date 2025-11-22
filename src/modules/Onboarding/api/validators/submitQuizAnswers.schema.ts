// import { z } from "zod";

// export const submitQuizAnswersBodySchema = z.object({
//     answers: z
//         .array(
//             z.object({
//                 questionId: z.string().min(1, "questionId is required"),
//                 optionId: z.string().min(1, "optionId is required"),
//             }),
//         )
//         .min(1, { message: "At least one answer is required" }),
// });

// export type SubmitQuizAnswersBody = z.infer<
//     typeof submitQuizAnswersBodySchema
// >;

import { z } from "zod";

export const submitQuizAnswersBodySchema = z.object({
    answers: z
        .array(
            z.object({
                questionId: z.string().min(1, "questionId is required"),
                optionIndex: z
                    .number({
                        invalid_type_error: "optionIndex must be a number",
                    })
                    .int("optionIndex must be an integer")
                    .min(0, "optionIndex must be >= 0"),
            }),
        )
        .min(1, "At least one answer is required"),
});

export type SubmitQuizAnswersBody = z.infer<typeof submitQuizAnswersBodySchema>;
