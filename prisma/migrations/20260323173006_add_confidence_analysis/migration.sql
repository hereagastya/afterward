-- AlterTable
ALTER TABLE "Decision" ADD COLUMN     "actualOutcome" JSONB,
ADD COLUMN     "analysis" JSONB,
ADD COLUMN     "clarityScore" INTEGER,
ADD COLUMN     "fearLevel" INTEGER,
ADD COLUMN     "logicLevel" INTEGER,
ADD COLUMN     "predictionCorrect" BOOLEAN,
ADD COLUMN     "replayCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "replayEmail" TEXT,
ADD COLUMN     "replayEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "replayScheduled" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Decision_replayScheduled_idx" ON "Decision"("replayScheduled");
