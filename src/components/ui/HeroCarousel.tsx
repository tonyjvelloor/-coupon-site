"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
    { src: "/assets/images/hero-concept-phone.png", alt: "Mobile Savings Concept" },
    { src: "/assets/images/hero-concept-abstract.png", alt: "Abstract Fintech Savings" },
    { src: "/assets/images/hero-concept-minimal.png", alt: "Premium Savings Gift" },
];

export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-[500px]">
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/30 to-violet-500/30 blur-3xl rounded-[100px] md:rounded-full scale-90"></div>

            {images.map((image, index) => (
                <div
                    key={image.src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 float-animation" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-contain drop-shadow-2xl relative z-10"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                    />
                </div>
            ))}

            {/* Pagination Dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "bg-violet-400 w-6 h-2"
                                : "bg-white/30 hover:bg-white/50 w-2 h-2"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
