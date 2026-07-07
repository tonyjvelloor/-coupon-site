-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "activeOfferCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastImportedAt" TIMESTAMP(3),
ADD COLUMN     "searchImpressions" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SearchConsoleMetric" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchConsoleMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliatePostback" (
    "id" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "clickId" TEXT,
    "status" TEXT NOT NULL,
    "saleAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "rawPayload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliatePostback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SearchConsoleMetric_date_idx" ON "SearchConsoleMetric"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SearchConsoleMetric_url_date_key" ON "SearchConsoleMetric"("url", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliatePostback_transactionId_key" ON "AffiliatePostback"("transactionId");

-- CreateIndex
CREATE INDEX "AffiliatePostback_network_transactionId_idx" ON "AffiliatePostback"("network", "transactionId");

-- CreateIndex
CREATE INDEX "AffiliatePostback_clickId_idx" ON "AffiliatePostback"("clickId");
