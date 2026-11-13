import Link from "next/link";
import { ShieldCheck, CheckCircle2, FileText, Clock, Scale } from "lucide-react";

interface TrustWidgetProps {
    platform?: "trustpilot" | "google" | "mixed";
}

export default function TrustWidget({ platform: _platform = "mixed" }: TrustWidgetProps) {
    const pillars = [
        {
            title: "Direct Merchant & Network Feeds",
            description: "Offers are sourced from official brand campaigns, verified affiliate partner feeds, and bank promotional terms.",
            icon: FileText,
        },
        {
            title: "Routine Expiration Sweeps",
            description: "Coupons carry explicit expiry windows and active/inactive statuses so expired campaigns are retired promptly.",
            icon: Clock,
        },
        {
            title: "Editorial Independence",
            description: "Merchants cannot pay to display broken codes or override editorial savings guides and side-by-side comparisons.",
            icon: Scale,
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full mb-3">
                        <ShieldCheck className="w-4 h-4" />
                        Editorial Standards
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">How CouponHub Curates Deals</h3>
                </div>

                <Link
                    href="/how-we-verify"
                    className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white transition-colors shrink-0"
                >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Read Verification Guide
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {pillars.map((pillar) => (
                    <div key={pillar.title} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 flex items-center justify-center shrink-0">
                            <pillar.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">{pillar.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{pillar.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
