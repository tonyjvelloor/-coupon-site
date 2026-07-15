import { prisma } from "@/lib/db";
import { IdentityEventType } from "@prisma/client";

export class IdentityService {
  /**
   * Logs a lifecycle event for an identity.
   */
  async logEvent(
    identityId: string, 
    type: IdentityEventType, 
    actorType?: string, 
    actorId?: string, 
    metadata?: any
  ): Promise<void> {
    await prisma.identityEvent.create({
      data: {
        merchantIdentityId: identityId,
        type,
        actorType,
        actorId,
        metadata
      }
    });
  }

  /**
   * Safely merges a candidate identity into a canonical identity.
   * Preserves history and logs the merge event.
   */
  async mergeCandidateToCanonical(
    candidateIdentityId: string, 
    canonicalIdentityId: string, 
    actorType: string, 
    actorId?: string, 
    reason?: string
  ): Promise<boolean> {
    return await prisma.$transaction(async (tx) => {
      // Re-link all coupons from Candidate Identity to Canonical Identity
      await tx.coupon.updateMany({
        where: { merchantIdentityId: candidateIdentityId },
        data: { merchantIdentityId: canonicalIdentityId }
      });

      // Update candidate status
      const candidateObj = await tx.merchantCandidate.findFirst({
        where: { identity: { id: candidateIdentityId } }
      });
      if (candidateObj) {
        await tx.merchantCandidate.update({
          where: { id: candidateObj.id },
          data: { status: "MERGED" }
        });
      }

      // Record the merge operation
      await tx.identityMerge.create({
        data: {
          candidateId: candidateIdentityId,
          canonicalId: canonicalIdentityId,
          performedByType: actorType,
          mergedById: actorId,
          reason
        }
      });

      // Log events for both identities
      await tx.identityEvent.create({
        data: {
          merchantIdentityId: candidateIdentityId,
          type: "MERGED",
          actorType,
          actorId,
          metadata: { mergedInto: canonicalIdentityId, reason }
        }
      });

      await tx.identityEvent.create({
        data: {
          merchantIdentityId: canonicalIdentityId,
          type: "MERGED",
          actorType,
          actorId,
          metadata: { absorbed: candidateIdentityId, reason }
        }
      });

      return true;
    });
  }
}

export const identityService = new IdentityService();
