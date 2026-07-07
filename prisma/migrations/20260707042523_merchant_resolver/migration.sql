-- AlterTable
ALTER TABLE "ImportedOffer" ADD COLUMN     "resolutionConfidence" JSONB,
ADD COLUMN     "resolutionReason" TEXT,
ADD COLUMN     "suggestedStoreId" TEXT;

-- CreateTable
CREATE TABLE "MerchantAlias" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "normalizedAlias" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL DEFAULT 100,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantAlias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MerchantAlias_alias_idx" ON "MerchantAlias"("alias");

-- CreateIndex
CREATE INDEX "MerchantAlias_normalizedAlias_idx" ON "MerchantAlias"("normalizedAlias");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantAlias_merchantId_alias_key" ON "MerchantAlias"("merchantId", "alias");

-- AddForeignKey
ALTER TABLE "MerchantAlias" ADD CONSTRAINT "MerchantAlias_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
