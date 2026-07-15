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
            fontFamily: {
                sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
                "headline-lg": ["var(--font-outfit)"],
                "display-lg": ["var(--font-outfit)"],
                "metric-xl": ["var(--font-outfit)"],
                "body-sm": ["var(--font-plus-jakarta-sans)"],
                "label-bold": ["var(--font-plus-jakarta-sans)"],
                "body-md": ["var(--font-plus-jakarta-sans)"],
                "body-lg": ["var(--font-plus-jakarta-sans)"],
                "headline-md": ["var(--font-outfit)"],
                "headline-lg-mobile": ["var(--font-outfit)"]
            },
            fontSize: {
                "headline-lg": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
                "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                "metric-xl": ["40px", {"lineHeight": "1.0", "fontWeight": "800"}],
                "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                "label-bold": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "700"}],
                "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
                "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                "headline-lg-mobile": ["28px", {"lineHeight": "1.2", "fontWeight": "700"}]
            },
            spacing: {
                "container-max": "1200px",
                "card-padding": "1.25rem",
                "gutter": "1.5rem",
                "stack-md": "1rem",
                "section-gap": "4rem",
                "stack-sm": "0.5rem",
                // Strict 8pt grid system for Commerce Intelligence
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
            boxShadow: {
                // Semantic elevations
                surface: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                raised: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                floating: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                overlay: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            },
            transitionDuration: {
                // Motion timing
                instant: "0ms",
                fast: "150ms",
                normal: "300ms",
                slow: "500ms",
            },
            borderWidth: {
                // Border weights
                subtle: "1px",
                medium: "2px",
                strong: "4px",
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                
                // --- Commerce Intelligence Tokens ---
                primary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563EB",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                    950: "#172554",
                    DEFAULT: "#2563EB",
                },
                intelligence: {
                    DEFAULT: "#4F46E5",
                    light: "#EEF2FF",
                    dark: "#312E81",
                },
                merchant: {
                    DEFAULT: "#0F172A",
                    light: "#F8FAFC",
                    dark: "#020617",
                },
                verified: {
                    DEFAULT: "#10B981", // Emerald
                    high: "#059669",
                    medium: "#34D399",
                    low: "#6EE7B7",
                    light: "#ECFDF5",
                    dark: "#064E3B",
                },
                success: {
                    DEFAULT: "#16A34A",
                    light: "#DCFCE7",
                    dark: "#14532D",
                },
                warning: {
                    DEFAULT: "#F59E0B",
                    light: "#FEF3C7",
                    dark: "#78350F",
                },
                urgency: {
                    DEFAULT: "#EA580C",
                    light: "#FFEDD5",
                    dark: "#7C2D12",
                },
                surface: {
                    50: "#F8FAFC",
                    100: "#F1F5F9",
                    200: "#E2E8F0",
                    300: "#CBD5E1",
                    400: "#94A3B8",
                    500: "#64748B",
                    600: "#475569",
                    700: "#1E293B",
                    800: "#111827",
                    900: "#0B1220",
                    950: "#0B1220",
                    DEFAULT: "#FFFFFF",
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
};
export default config;
