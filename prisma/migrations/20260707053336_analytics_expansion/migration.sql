-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AnalyticsEventType" ADD VALUE 'OFFER_IMPORTED';
ALTER TYPE "AnalyticsEventType" ADD VALUE 'OFFER_PUBLISHED';
ALTER TYPE "AnalyticsEventType" ADD VALUE 'OFFER_INDEXED';
ALTER TYPE "AnalyticsEventType" ADD VALUE 'OFFER_CLICKED';
ALTER TYPE "AnalyticsEventType" ADD VALUE 'OFFER_CONVERTED';

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "revenueAttribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalClicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalConversions" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "revenueAttribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalClicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalConversions" INTEGER NOT NULL DEFAULT 0;
