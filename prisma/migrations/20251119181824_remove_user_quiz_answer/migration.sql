/*
  Warnings:

  - You are about to drop the `UserQuizAnswer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserQuizAnswer" DROP CONSTRAINT "UserQuizAnswer_optionId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizAnswer" DROP CONSTRAINT "UserQuizAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "UserQuizAnswer" DROP CONSTRAINT "UserQuizAnswer_userXPId_fkey";

-- DropTable
DROP TABLE "UserQuizAnswer";
