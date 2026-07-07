-- AlterTable
ALTER TABLE "ImportJob" ADD COLUMN     "apiLatencyMs" INTEGER,
ADD COLUMN     "connectorVersion" TEXT,
ADD COLUMN     "pagesFetched" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recordsFetched" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ImportedOffer" ADD COLUMN     "resolutionSource" TEXT,
ADD COLUMN     "resolvedStoreId" TEXT;
