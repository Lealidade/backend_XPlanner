-- CreateTable
CREATE TABLE "UserLearningStepProgress" (
    "id" TEXT NOT NULL,
    "userXPId" TEXT NOT NULL,
    "learningStepId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLearningStepProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLearningStepProgress_userXPId_learningStepId_key" ON "UserLearningStepProgress"("userXPId", "learningStepId");

-- AddForeignKey
ALTER TABLE "UserLearningStepProgress" ADD CONSTRAINT "UserLearningStepProgress_userXPId_fkey" FOREIGN KEY ("userXPId") REFERENCES "UserXP"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLearningStepProgress" ADD CONSTRAINT "UserLearningStepProgress_learningStepId_fkey" FOREIGN KEY ("learningStepId") REFERENCES "LearningStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
