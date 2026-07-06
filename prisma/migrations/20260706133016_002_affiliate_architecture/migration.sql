-- CreateTable
CREATE TABLE "AffiliateNetwork" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateNetwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateProgram" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "networkId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "commissionType" TEXT NOT NULL,
    "commissionRate" TEXT NOT NULL,
    "cookieDuration" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateCampaign" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "trackingUrl" TEXT NOT NULL,
    "landingUrl" TEXT,
    "campaignName" TEXT NOT NULL,
    "commissionRate" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateCampaignHistory" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "commissionRate" TEXT,
    "trackingUrl" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateCampaignHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AffiliateCampaignToCoupon" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AffiliateCampaignToCoupon_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateNetwork_slug_key" ON "AffiliateNetwork"("slug");

-- CreateIndex
CREATE INDEX "AffiliateNetwork_slug_idx" ON "AffiliateNetwork"("slug");

-- CreateIndex
CREATE INDEX "AffiliateProgram_merchantId_idx" ON "AffiliateProgram"("merchantId");

-- CreateIndex
CREATE INDEX "AffiliateProgram_networkId_idx" ON "AffiliateProgram"("networkId");

-- CreateIndex
CREATE INDEX "AffiliateCampaign_programId_idx" ON "AffiliateCampaign"("programId");

-- CreateIndex
CREATE INDEX "AffiliateCampaignHistory_campaignId_effectiveFrom_idx" ON "AffiliateCampaignHistory"("campaignId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "_AffiliateCampaignToCoupon_B_index" ON "_AffiliateCampaignToCoupon"("B");

-- AddForeignKey
ALTER TABLE "AffiliateProgram" ADD CONSTRAINT "AffiliateProgram_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateProgram" ADD CONSTRAINT "AffiliateProgram_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "AffiliateNetwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateCampaign" ADD CONSTRAINT "AffiliateCampaign_programId_fkey" FOREIGN KEY ("programId") REFERENCES "AffiliateProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateCampaignHistory" ADD CONSTRAINT "AffiliateCampaignHistory_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AffiliateCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AffiliateCampaignToCoupon" ADD CONSTRAINT "_AffiliateCampaignToCoupon_A_fkey" FOREIGN KEY ("A") REFERENCES "AffiliateCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AffiliateCampaignToCoupon" ADD CONSTRAINT "_AffiliateCampaignToCoupon_B_fkey" FOREIGN KEY ("B") REFERENCES "Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
