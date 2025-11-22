/*
  Warnings:

  - A unique constraint covering the columns `[quizContentId]` on the table `LearningStep` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- AlterEnum
ALTER TYPE "LearningContentType" ADD VALUE 'QUIZ';

-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "totalSteps" INTEGER;

-- AlterTable
ALTER TABLE "LearningStep" ADD COLUMN     "quizContentId" TEXT;

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "challengeType" "ChallengeType" NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "xpPointsReward" INTEGER NOT NULL,
    "xpCoinsReward" INTEGER DEFAULT 0,
    "badgeId" TEXT,
    "iconUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizContent" (
    "id" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswerIndex" INTEGER NOT NULL,
    "explanation" TEXT,
    "xpPointsReward" INTEGER NOT NULL,
    "xpCoinsReward" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuizContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "userXPId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChallengeProgress" (
    "id" TEXT NOT NULL,
    "userXPId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "currentProgress" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserChallengeProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userXPId_badgeId_key" ON "UserBadge"("userXPId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallengeProgress_userXPId_challengeId_key" ON "UserChallengeProgress"("userXPId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningStep_quizContentId_key" ON "LearningStep"("quizContentId");

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningStep" ADD CONSTRAINT "LearningStep_quizContentId_fkey" FOREIGN KEY ("quizContentId") REFERENCES "QuizContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userXPId_fkey" FOREIGN KEY ("userXPId") REFERENCES "UserXP"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChallengeProgress" ADD CONSTRAINT "UserChallengeProgress_userXPId_fkey" FOREIGN KEY ("userXPId") REFERENCES "UserXP"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChallengeProgress" ADD CONSTRAINT "UserChallengeProgress_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
