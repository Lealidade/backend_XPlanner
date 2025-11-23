import { container } from "tsyringe";
import { IUserXPRepository } from "../../modules/UserXP/data/interfaces/IUserXPRepository";
import { UserXPRepository } from "../../modules/UserXP/data/repositories/UserXPRepository"

import { IQuizQuestionRepository } from "@/modules/Onboarding/data/interfaces/IQuizQuestionRepository";
import { QuizQuestionRepository } from "@/modules/Onboarding/data/repositories/QuizQuestionRepository";

import { IQuizOptionRepository } from "@/modules/Onboarding/data/interfaces/IQuizOptionRepository";
import { QuizOptionRepository } from "@/modules/Onboarding/data/repositories/QuizOptionRepository";

import { IFinancialProfileRepository } from "@/modules/Onboarding/data/interfaces/IFinancialProfileRepository";
import { FinancialProfileRepository } from "@/modules/Onboarding/data/repositories/FinancialProfileRepository";

import { ILearningPathRepository } from "@/modules/LearningPaths/data/interfaces/ILearningPathRepository";
import { LearningPathRepository } from "@/modules/LearningPaths/data/repositories/LearningPathRepository";

import { ILearningStepRepository } from "@/modules/LearningPaths/data/interfaces/ILearningStepRepository";
import { IUserLearningStepProgressRepository } from "@/modules/LearningPaths/data/interfaces/IUserLearningStepProgressRepository";

import { LearningStepRepository } from "@/modules/LearningPaths/data/repositories/LearningStepRepository";
import { UserLearningStepProgressRepository } from "@/modules/LearningPaths/data/repositories/UserLearningStepProgressRepository.ts";

import { GoalRepository } from "@/modules/Gamification/goals/data/repositories/GoalRepository";
import { UserGoalRepository } from "@/modules/Gamification/goals/data/repositories/UserGoalRepository";

import type { IGoalRepository } from "@/modules/Gamification/goals/data/interfaces/IGoalRepository";
import type { IUserGoalRepository } from "@/modules/Gamification/goals/data/interfaces/IUserGoalRepository";

import { UserXPGamificationService } from "@/modules/Gamification/core/services/UserXPGamification.service";


import type { IChallengeRepository } from "@/modules/Gamification/challenges/data/interfaces/IChallengeRepository";
import type { IUserChallengeProgressRepository } from "@/modules/Gamification/challenges/data/interfaces/IUserChallengeProgressRepository";
import type { IBadgeRepository } from "@/modules/Gamification/challenges/data/interfaces/IBadgeRepository";
import type { IUserBadgeRepository } from "@/modules/Gamification/challenges/data/interfaces/IUserBadgeRepository";

import { ChallengeRepository } from "@/modules/Gamification/challenges/data/repositories/ChallengeRepository";
import { UserChallengeProgressRepository } from "@/modules/Gamification/challenges/data/repositories/UserChallengeProgressRepository";

import { BadgeRepository } from "@/modules/Gamification/challenges/data/repositories/BadgeRepository";
import { UserBadgeRepository } from "@/modules/Gamification/challenges/data/repositories/UserBadgeRepository";

import type { ICashFlowRepository } from "@/modules/CashFlow/data/interfaces/ICashFlowRepository";
import { CashFlowRepository } from "@/modules/CashFlow/data/repositories/CashFlowRepository";

container.registerSingleton<ICashFlowRepository>(
    "CashFlowRepository",
    CashFlowRepository,
);


container.registerSingleton<IChallengeRepository>(
    "ChallengeRepository",
    ChallengeRepository,
);

container.registerSingleton<IUserChallengeProgressRepository>(
    "UserChallengeProgressRepository",
    UserChallengeProgressRepository,
);

container.registerSingleton<IBadgeRepository>(
    "BadgeRepository",
    BadgeRepository,
);

container.registerSingleton<IUserBadgeRepository>(
    "UserBadgeRepository",
    UserBadgeRepository,
);

container.registerSingleton<UserXPGamificationService>(
    "UserXPGamificationService",
    UserXPGamificationService,
);


container.registerSingleton<IGoalRepository>(
    "GoalRepository",
    GoalRepository,
);

container.registerSingleton<IUserGoalRepository>(
    "UserGoalRepository",
    UserGoalRepository,
);

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
