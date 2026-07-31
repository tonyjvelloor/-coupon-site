import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // PREMIUM SYSTEM COLORS
                "brand-indigo": "#4F46E5",
                "brand-purple": "#7C3AED",
                "brand-emerald": "#10B981",
                "text-main": "#0F172A", // Slate 900
                "text-muted": "#64748B", // Slate 500

                // LEGACY MATERIAL MAP (Re-mapped to Premium Slate/Indigo to prevent breaking)
                "primary": "#4F46E5",
                "on-primary": "#FFFFFF",
                "primary-container": "#E0E7FF",
                "on-primary-container": "#312E81",
                "secondary": "#10B981",
                "on-secondary": "#FFFFFF",
                "secondary-container": "#D1FAE5",
                "on-secondary-container": "#064E3B",
                "surface": "#FFFFFF",
                "on-surface": "#0F172A",
                "surface-variant": "#F1F5F9",
                "on-surface-variant": "#475569",
                "background": "#F8FAFC",
                "on-background": "#0F172A",
                "error": "#EF4444",
                "on-error": "#FFFFFF",
                "outline": "#E2E8F0",
                "outline-variant": "#CBD5E1",
                
                // Fallbacks to avoid errors
                "tertiary": "#64748B",
                "on-tertiary": "#FFFFFF",
                "surface-dim": "#E2E8F0",
                "surface-bright": "#FFFFFF",
                "inverse-surface": "#0F172A",
                "inverse-on-surface": "#F8FAFC",
                "inverse-primary": "#A5B4FC",
            },
            boxShadow: {
                // Premium Stripe-like soft shadows
                'premium-sm': '0px 2px 4px rgba(15, 23, 42, 0.04), 0px 4px 6px rgba(15, 23, 42, 0.02)',
                'premium-md': '0px 4px 6px rgba(15, 23, 42, 0.05), 0px 10px 15px rgba(15, 23, 42, 0.03)',
                'premium-lg': '0px 10px 15px rgba(15, 23, 42, 0.05), 0px 20px 25px rgba(15, 23, 42, 0.03)',
                'premium-glow': '0 0 40px -10px rgba(79, 70, 229, 0.4)',
            },
            borderRadius: {
                "DEFAULT": "0.375rem", // 6px
                "md": "0.5rem", // 8px
                "lg": "0.75rem", // 12px
                "xl": "1rem", // 16px
                "2xl": "1.5rem", // 24px
                "full": "9999px"
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                }
            },
            animation: {
                gradient: 'gradient 8s ease infinite',
                'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
                'shimmer': 'shimmer 2s linear infinite',
            },
            spacing: {
                "stack-sm": "12px",
                "stack-md": "24px",
                "margin-mobile": "16px",
                "margin-desktop": "40px",
                "base": "8px",
                "stack-lg": "48px",
                "gutter": "24px",
                "container-max": "1200px",
                // Fallbacks for standard Tailwind spacing (needed by existing components)
                4: "0.25rem",
                8: "0.5rem",
                12: "0.75rem",
                16: "1rem",
                24: "1.5rem",
                32: "2rem",
                48: "3rem",
                64: "4rem",
                96: "6rem",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                "display-lg": ["var(--font-inter)"],
                "headline-lg": ["var(--font-inter)"],
                "headline-lg-mobile": ["var(--font-inter)"],
                "title-md": ["var(--font-inter)"],
                "body-md": ["var(--font-inter)"],
                "body-lg": ["var(--font-inter)"],
                "label-md": ["var(--font-inter)"],
                "label-sm": ["var(--font-inter)"]
            },
            fontSize: {
                "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                "title-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
};
export default config;
