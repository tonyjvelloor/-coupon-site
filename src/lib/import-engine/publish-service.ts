import { prisma } from "@/lib/db";
import { NormalizedOffer } from "./types";
import { MerchantResolver } from "./merchant-resolver";

export class PublishService {
  /**
   * Publishes an ImportedOffer into the live Coupon and Store tables using a transaction.
   */
  async publish(importedOfferId: string, adminId: string, confirmedStoreId?: string): Promise<boolean> {
    const importedOffer = await prisma.importedOffer.findUnique({
      where: { id: importedOfferId }
    });

    if (!importedOffer) throw new Error("ImportedOffer not found.");
    if (importedOffer.status === "published") throw new Error("Offer is already published.");
    
    const offer = importedOffer.normalizedData as unknown as NormalizedOffer;

    return await prisma.$transaction(async (tx) => {
      // 1. Ensure Store exists or create it
      let store;
      if (confirmedStoreId) {
        store = await tx.store.findUnique({ where: { id: confirmedStoreId } });
        if (!store) throw new Error("Confirmed store not found.");

        // Automatically learn the alias since an admin explicitly approved this pairing
        try {
          await tx.merchantAlias.upsert({
            where: { merchantId_alias: { merchantId: store.id, alias: offer.merchantName } },
            update: { lastSeenAt: new Date(), approvedBy: adminId, approvedAt: new Date(), confidence: 100 },
            create: {
              merchantId: store.id,
              alias: offer.merchantName,
              normalizedAlias: MerchantResolver.normalize(offer.merchantName),
              source: importedOffer.source,
              confidence: 100,
              approvedBy: adminId,
              approvedAt: new Date()
            }
          });
        } catch (e) {
          // ignore unique constraint
        }
      } else {
        const storeSlug = offer.merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        store = await tx.store.findUnique({ where: { slug: storeSlug } });
        
        if (!store) {
          store = await tx.store.create({
            data: {
              name: offer.merchantName,
              slug: storeSlug,
              description: `Coupons and deals for ${offer.merchantName}`,
            }
          });
        }
      }

      // 2. Create the Coupon
      const coupon = await tx.coupon.create({
        data: {
          title: offer.title,
          description: offer.description,
          code: offer.code,
          type: offer.code ? "coupon" : "deal",
          discountType: offer.discountType || "flat",
          discountValue: offer.discountValue,
          affiliateUrl: offer.affiliateUrl,
          expiresAt: offer.expiry ? new Date(offer.expiry) : null,
          storeId: store.id,
          // If we had a strict category mapping, we'd look it up here
        }
      });

      // 3. Mark the ImportedOffer as published
      await tx.importedOffer.update({
        where: { id: importedOffer.id },
        data: { status: "published" }
      });

      // 4. Update the ImportJob metrics
      await tx.importJob.update({
        where: { id: importedOffer.importJobId },
        data: {
          published: { increment: 1 }
        }
      });

      // 5. Create Audit Log
      await tx.auditLog.create({
        data: {
          adminId,
          entityType: "Coupon",
          entityId: coupon.id,
          action: "CREATE",
          newValue: JSON.parse(JSON.stringify(coupon))
        }
      });

      return {
        success: true,
        couponId: coupon.id,
        storeId: store.id
      };
    });
  }
}
