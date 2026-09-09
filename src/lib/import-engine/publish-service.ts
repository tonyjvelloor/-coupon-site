import { prisma } from "@/lib/db";
import { NormalizedOffer } from "./types";
import { MerchantResolver } from "./merchant-resolver";

export type PublishActorType = "SYSTEM" | "ADMIN" | "API";

export interface PublishOptions {
  actorType: PublishActorType;
  actorId?: string | null;
  merchantIdentityId: string;
}

export interface PublishResult {
  success: boolean;
  couponId: string;
  storeSlug?: string;
  isNewCoupon: boolean;
}

export class PublishService {
  /**
   * Publishes an ImportedOffer into the live Coupon table, linked to a MerchantIdentity.
   * State-aware and fully idempotent: will not inflate activeOfferCount on re-publish.
   */
  async publish(importedOfferId: string, options: PublishOptions): Promise<PublishResult> {
    const importedOffer = await prisma.importedOffer.findUnique({
      where: { id: importedOfferId }
    });

    if (!importedOffer) throw new Error("ImportedOffer not found.");
    if (importedOffer.status === "published") {
      // Offer already recorded as published
      return { success: true, couponId: "", isNewCoupon: false };
    }
    
    const offer = importedOffer.normalizedData as unknown as NormalizedOffer;

    return await prisma.$transaction(async (tx) => {
      // 1. Ensure Identity exists
      const identity = await tx.merchantIdentity.findUnique({
        where: { id: options.merchantIdentityId },
        include: { store: true, candidate: true }
      });

      if (!identity) {
        throw new Error("MerchantIdentity not found.");
      }

      // 2. Automatically learn alias if this was an ADMIN explicitly confirming an alias match
      if (options.actorType === "ADMIN" && identity.type === "CANONICAL" && identity.canonicalStoreId) {
        try {
          await tx.merchantAlias.upsert({
            where: { merchantId_alias: { merchantId: identity.canonicalStoreId, alias: offer.merchantName } },
            update: { lastSeenAt: new Date(), approvedBy: options.actorId, approvedAt: new Date(), confidence: 100 },
            create: {
              merchantId: identity.canonicalStoreId,
              alias: offer.merchantName,
              normalizedAlias: MerchantResolver.normalize(offer.merchantName),
              source: importedOffer.source,
              confidence: 100,
              approvedBy: options.actorId,
              approvedAt: new Date()
            }
          });
        } catch {
          // ignore unique constraint
        }
      }

      // 3. State-aware Coupon check (deduplicate against existing live coupon)
      let existingCoupon = null;
      if (offer.code) {
        existingCoupon = await tx.coupon.findFirst({
          where: {
            merchantIdentityId: identity.id,
            code: offer.code,
            deletedAt: null,
          }
        });
      } else if (offer.title) {
        existingCoupon = await tx.coupon.findFirst({
          where: {
            merchantIdentityId: identity.id,
            title: offer.title,
            deletedAt: null,
          }
        });
      }

      const isNewCoupon = !existingCoupon;
      const isCurrentlyActive = !offer.expiry || new Date(offer.expiry) > new Date();
      const wasPreviouslyActive = existingCoupon 
        ? (!existingCoupon.expiresAt || new Date(existingCoupon.expiresAt) > new Date())
        : false;

      let couponId: string;
      if (existingCoupon) {
        couponId = existingCoupon.id;
        await tx.coupon.update({
          where: { id: existingCoupon.id },
          data: {
            description: offer.description || existingCoupon.description,
            affiliateUrl: offer.affiliateUrl || existingCoupon.affiliateUrl,
            discountValue: offer.discountValue || existingCoupon.discountValue,
            expiresAt: offer.expiry ? new Date(offer.expiry) : existingCoupon.expiresAt,
            qualityScore: importedOffer.finalQualityScore,
            updatedAt: new Date(),
          }
        });
      } else {
        const created = await tx.coupon.create({
          data: {
            title: offer.title,
            description: offer.description,
            code: offer.code,
            type: offer.code ? "coupon" : "deal",
            discountType: offer.discountType || "flat",
            discountValue: offer.discountValue,
            affiliateUrl: offer.affiliateUrl,
            expiresAt: offer.expiry ? new Date(offer.expiry) : null,
            merchantIdentityId: identity.id,
            publishedByType: options.actorType,
            publishedById: options.actorId,
            connector: importedOffer.source,
            importJobId: importedOffer.importJobId,
            qualityScore: importedOffer.finalQualityScore,
          }
        });
        couponId = created.id;
      }

      // 4. Mark the ImportedOffer as published
      await tx.importedOffer.update({
        where: { id: importedOffer.id },
        data: { status: "published" }
      });

      // 5. Transactional, State-Aware Store Metrics Update
      if (identity.canonicalStoreId) {
        const storeUpdates: any = {
          lastImportedAt: new Date(),
        };

        if (isNewCoupon) {
          storeUpdates.offerCount = { increment: 1 };
          if (isCurrentlyActive) {
            storeUpdates.activeOfferCount = { increment: 1 };
          }
        } else if (!wasPreviouslyActive && isCurrentlyActive) {
          // Re-activated an expired coupon
          storeUpdates.activeOfferCount = { increment: 1 };
        } else if (wasPreviouslyActive && !isCurrentlyActive) {
          // De-activated coupon
          storeUpdates.activeOfferCount = { decrement: 1 };
        }

        await tx.store.update({
          where: { id: identity.canonicalStoreId },
          data: storeUpdates
        });
      }

      // 6. Update ImportJob metrics
      await tx.importJob.update({
        where: { id: importedOffer.importJobId },
        data: {
          published: { increment: 1 }
        }
      });

      // 7. Create Audit Log for non-system actors
      if (options.actorType !== "SYSTEM" && options.actorId) {
        await tx.auditLog.create({
          data: {
            adminId: options.actorId,
            entityType: "Coupon",
            entityId: couponId,
            action: isNewCoupon ? "CREATE" : "UPDATE",
            newValue: JSON.parse(JSON.stringify(offer))
          }
        });
      }

      return {
        success: true,
        couponId,
        storeSlug: identity.store?.slug,
        isNewCoupon
      };
    });
  }
}
