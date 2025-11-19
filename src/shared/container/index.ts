// src/shared/container/index.ts
import { container } from "tsyringe";
import { IUserXPRepository } from "../../modules/UserXP/data/interfaces/IUserXPRepository";
import { UserXPRepository } from "../../modules/UserXP/data/repositories/UserXPRepository"

import { IQuizQuestionRepository } from "@/modules/Onboarding/data/interfaces/IQuizQuestionRepository";
import { QuizQuestionRepository } from "@/modules/Onboarding/data/repositories/QuizQuestionRepository";

import { IQuizOptionRepository } from "@/modules/Onboarding/data/interfaces/IQuizOptionRepository";
import { QuizOptionRepository } from "@/modules/Onboarding/data/repositories/QuizOptionRepository";

import { IUserQuizAnswerRepository } from "@/modules/Onboarding/data/interfaces/IUserQuizAnswerRepository";
import { UserQuizAnswerRepository } from "@/modules/Onboarding/data/repositories/UserQuizAnswerRepository";

import { IFinancialProfileRepository } from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";
import { FinancialProfileRepository } from "@/modules/Onboarding/data/repositories/FinancialProfileRepository";

import { ILearningPathRepository } from "@/modules/LearningPaths/data/interfaces/ILearningPathRepository";
import { LearningPathRepository } from "@/modules/LearningPaths/data/repositories/LearningPathRepository";

import { ILearningStepRepository } from "@/modules/LearningPaths/data/interfaces/ILearningStepRepository";
import { IUserLearningStepProgressRepository } from "@/modules/LearningPaths/data/interfaces/IUserLearningStepProgressRepository";

import { LearningStepRepository } from "@/modules/LearningPaths/data/repositories/LearningStepRepository";
import { UserLearningStepProgressRepository } from "@/modules/LearningPaths/data/repositories/UserLearningStepProgressRepository.ts";

container.registerSingleton<IUserLearningStepProgressRepository>(
    "UserLearningStepProgressRepository",
    UserLearningStepProgressRepository,
);

container.registerSingleton<ILearningStepRepository>(
    "LearningStepRepository",
    LearningStepRepository,
);


container.registerSingleton<ILearningPathRepository>(
    "LearningPathRepository",
    LearningPathRepository,
);

container.registerSingleton<IQuizOptionRepository>(
    "QuizOptionRepository",
    QuizOptionRepository,
);

container.registerSingleton<IUserQuizAnswerRepository>(
    "UserQuizAnswerRepository",
    UserQuizAnswerRepository,
);

container.registerSingleton<IFinancialProfileRepository>(
    "FinancialProfileRepository",
    FinancialProfileRepository,
);


container.registerSingleton<IQuizQuestionRepository>(
    "QuizQuestionRepository",
    QuizQuestionRepository
);

container.registerSingleton<IUserXPRepository>(
    "UserXPRepository",
    UserXPRepository
);
