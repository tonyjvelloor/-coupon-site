/*
  Warnings:

  - You are about to drop the column `rowsFailed` on the `ImportJob` table. All the data in the column will be lost.
  - You are about to drop the column `rowsProcessed` on the `ImportJob` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ImportJob" DROP COLUMN "rowsFailed",
DROP COLUMN "rowsProcessed",
ADD COLUMN     "aiComplete" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "aiPending" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "avgQuality" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "duplicates" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "processingTimeMs" INTEGER,
ADD COLUMN     "published" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rejected" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'csv',
ADD COLUMN     "totalRows" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "validRows" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ImportedOffer" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL DEFAULT 'v1',
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "rawData" JSONB NOT NULL,
    "normalizedData" JSONB NOT NULL,
    "completenessScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "validationScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "freshnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "merchantMatchScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "duplicateRisk" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "finalQualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "validationErrors" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "aiEnrichedData" JSONB,
    "aiStatus" TEXT NOT NULL DEFAULT 'none',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportedOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportedOffer_importJobId_idx" ON "ImportedOffer"("importJobId");

-- CreateIndex
CREATE INDEX "ImportedOffer_status_idx" ON "ImportedOffer"("status");

-- CreateIndex
CREATE INDEX "ImportedOffer_source_sourceId_idx" ON "ImportedOffer"("source", "sourceId");

-- CreateIndex
CREATE INDEX "ImportedOffer_aiStatus_idx" ON "ImportedOffer"("aiStatus");

-- AddForeignKey
ALTER TABLE "ImportedOffer" ADD CONSTRAINT "ImportedOffer_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
