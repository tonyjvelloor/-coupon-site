import { prisma } from "@/lib/db";
import { NormalizedOffer } from "./types";
import { MerchantResolver } from "./merchant-resolver";

export type PublishActorType = "SYSTEM" | "ADMIN" | "API";

export interface PublishOptions {
  actorType: PublishActorType;
  actorId?: string | null;
  merchantIdentityId: string;
}

export class PublishService {
  /**
   * Publishes an ImportedOffer into the live Coupon table, linked to a MerchantIdentity.
   */
  async publish(importedOfferId: string, options: PublishOptions): Promise<boolean> {
    const importedOffer = await prisma.importedOffer.findUnique({
      where: { id: importedOfferId }
    });

    if (!importedOffer) throw new Error("ImportedOffer not found.");
    if (importedOffer.status === "published") throw new Error("Offer is already published.");
    
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
        } catch (e) {
          // ignore unique constraint
        }
      }

      // 3. Create the Coupon
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
          merchantIdentityId: identity.id,
          publishedByType: options.actorType,
          publishedById: options.actorId,
          connector: importedOffer.source,
          importJobId: importedOffer.importJobId,
          qualityScore: importedOffer.finalQualityScore,
        }
      });

      // 4. Mark the ImportedOffer as published
      await tx.importedOffer.update({
        where: { id: importedOffer.id },
        data: { status: "published" }
      });

      // 5. Update the ImportJob metrics
      await tx.importJob.update({
        where: { id: importedOffer.importJobId },
        data: {
          published: { increment: 1 }
        }
      });

      // 6. Create Audit Log (only for human actors or explicitly flagged)
      if (options.actorType !== "SYSTEM" && options.actorId) {
        await tx.auditLog.create({
          data: {
            adminId: options.actorId,
            entityType: "Coupon",
            entityId: coupon.id,
            action: "CREATE",
            newValue: JSON.parse(JSON.stringify(coupon))
          }
        });
      }

      return true;
    });
  }
}
