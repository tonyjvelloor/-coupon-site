import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CouponHub - Verified Coupons & Cashback Deals",
    short_name: "CouponHub",
    description: "Browse verified promo codes, cashback rates, and daily glitch deals for 250+ stores in India.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5A4FCF",
    orientation: "portrait",
    categories: ["shopping", "lifestyle", "finance"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "maskable",
      },
      {
        src: "/icon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
