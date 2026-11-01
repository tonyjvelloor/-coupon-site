import { prisma } from "@/lib/db";
import { SocialProofToast } from "./SocialProofToast";

const FALLBACK_STORES = [
  { name: "Amazon", logo: "/images/stores/amazon.png" },
  { name: "Flipkart", logo: "/images/stores/flipkart.png" },
  { name: "Myntra", logo: "/images/stores/myntra.png" },
  { name: "Ajio", logo: "/images/stores/ajio.png" },
  { name: "Swiggy", logo: "/images/stores/swiggy.png" },
  { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg" },
  { name: "Tata CLiQ", logo: null },
  { name: "Nykaa", logo: null },
];

export async function SocialProofWrapper() {
  try {
    // Fetch 15 popular stores to cycle through
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      take: 15,
      orderBy: { clicks: 'desc' },
      select: { name: true, logo: true }
    });

    if (stores && stores.length > 0) {
      return <SocialProofToast stores={stores} />;
    }
  } catch (e) {
    console.error("Failed to load stores for SocialProofWrapper", e);
  }

  return <SocialProofToast stores={FALLBACK_STORES} />;
}
