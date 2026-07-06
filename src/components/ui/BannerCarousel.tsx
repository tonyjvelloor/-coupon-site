"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";

interface Banner {
    id: string;
    imageUrl: string;
    link: string;
    title: string | null;
}

interface BannerCarouselProps {
    banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    if (banners.length === 0) {
        // Fallback static banner if no banners set
        return (
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 md:p-16 text-center shadow-2xl border border-white/10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Huge Savings on Top Brands
                    </h2>
                    <p className="text-lg md:text-xl text-violet-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Discover verified coupons and exclusive deals for your favorite online stores.
                    </p>
                    <div className="flex justify-center">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 shadow-lg">
                            <p className="font-semibold text-white">🎉 New deals added hourly</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl shadow-2xl relative group bg-gray-900" ref={emblaRef}>
            <div className="flex aspect-[21/9] min-h-[300px] md:min-h-[400px]">
                {banners.map((banner) => (
                    <div className="flex-[0_0_100%] min-w-0 relative" key={banner.id}>
                        <img
                            src={banner.imageUrl}
                            alt={banner.title || "Offer"}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay Content */}
                        {(banner.title || banner.link) && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:p-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                                {banner.title && (
                                    <h2 className="text-2xl md:text-4xl font-bold text-white max-w-3xl drop-shadow-lg leading-tight">
                                        {banner.title}
                                    </h2>
                                )}
                                <a
                                    href={banner.link}
                                    target="_blank"
                                    className="bg-white text-violet-900 hover:bg-violet-50 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg text-sm md:text-base hover:scale-105 active:scale-95"
                                >
                                    Get Deal <ArrowRight className="w-5 h-5" />
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
