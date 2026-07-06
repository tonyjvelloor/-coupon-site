"use client";

import Image from "next/image";

const partnerBrands = [
    { name: "Amazon", logo: "/images/stores/amazon.png" },
    { name: "Flipkart", logo: "/images/stores/flipkart.png" },
    { name: "Myntra", logo: "/images/stores/myntra.png" },
    { name: "Swiggy", logo: "/images/stores/swiggy.png" },
    { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg" },
    { name: "Ajio", logo: "/images/stores/ajio.png" },
];

export default function TrustedPartners() {
    return (
        <section className="py-12 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                        Trusted by India&apos;s Top Brands
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500">
                    {partnerBrands.map((brand) => (
                        <div
                            key={brand.name}
                            className="flex items-center justify-center h-10 md:h-12 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                            title={brand.name}
                        >
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={120}
                                height={48}
                                className="max-h-full w-auto object-contain"
                                unoptimized
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-400 text-xs">
                        ...and 500+ more partner stores
                    </p>
                </div>
            </div>
        </section>
    );
}
