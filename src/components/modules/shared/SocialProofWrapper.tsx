import { prisma } from "@/lib/db";
import { SocialProofToast } from "./SocialProofToast";

export async function SocialProofWrapper() {
  try {
    // Fetch 15 popular stores to cycle through
    const stores = await prisma.store.findMany({
      take: 15,
      orderBy: { popularityScore: 'desc' },
      select: { name: true, logo: true }
    });

    if (!stores || stores.length === 0) return null;

    return <SocialProofToast stores={stores} />;
  } catch (e) {
    console.error("Failed to load stores for SocialProofWrapper", e);
    return null;
  }
}
