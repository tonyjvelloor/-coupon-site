-- CreateEnum
CREATE TYPE "IntelligenceEvent" AS ENUM ('COUPON_PUBLISHED', 'MERCHANT_UPDATED', 'COLLECTION_CREATED');

-- CreateEnum
CREATE TYPE "IntelligenceTaskStatus" AS ENUM ('PENDING', 'PROCESSING', 'PENDING_REVIEW', 'APPROVED', 'APPLIED', 'REJECTED', 'FAILED');

-- CreateTable
CREATE TABLE "IntelligenceTask" (
    "id" TEXT NOT NULL,
    "event" "IntelligenceEvent" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "workerName" TEXT NOT NULL,
    "status" "IntelligenceTaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "promptVersion" TEXT NOT NULL,
    "workerVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "settings" JSONB,
    "inputSnapshot" JSONB NOT NULL,
    "generatedData" JSONB,
    "error" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntelligenceTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntelligenceTask_status_priority_createdAt_idx" ON "IntelligenceTask"("status", "priority", "createdAt");

-- CreateIndex
CREATE INDEX "IntelligenceTask_entityType_entityId_idx" ON "IntelligenceTask"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "IntelligenceTask_workerName_idx" ON "IntelligenceTask"("workerName");
