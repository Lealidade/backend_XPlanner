/*
  Warnings:

  - Added the required column `dimension` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CashFlowOperation" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "category" TEXT,
ADD COLUMN     "dimension" "FinancialDimension" NOT NULL;

-- AlterTable
ALTER TABLE "UserGoal" ADD COLUMN     "lastContributionAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CashFlow" (
    "id" TEXT NOT NULL,
    "userXPId" TEXT NOT NULL,
    "userGoalId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operation" "CashFlowOperation" NOT NULL,
    "value" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "recipient" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashFlow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CashFlow" ADD CONSTRAINT "CashFlow_userXPId_fkey" FOREIGN KEY ("userXPId") REFERENCES "UserXP"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlow" ADD CONSTRAINT "CashFlow_userGoalId_fkey" FOREIGN KEY ("userGoalId") REFERENCES "UserGoal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
