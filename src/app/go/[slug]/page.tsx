import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ShieldCheck, Clock, ArrowRight, Store as StoreIcon } from "lucide-react";
import RedirectCountdown from "./RedirectCountdown";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function CampaignRedirectPage({ params }: Props) {
    const { slug } = await params;

    // Find the campaign link
    const campaignLink = await prisma.campaignLink.findUnique({
        where: { slug },
        include: { merchantIdentity: { include: { store: true } } },
    });

    // If not found or inactive, show 404
    if (!campaignLink || !campaignLink.isActive) {
        notFound();
    }

    // Check if expired
    if (campaignLink.expiresAt && new Date() > campaignLink.expiresAt) {
        notFound();
    }

    // Increment click count
    await prisma.campaignLink.update({
        where: { id: campaignLink.id },
        data: { clicks: { increment: 1 } },
    });

    // Build final URL with optional UTM parameters
    let finalUrl = campaignLink.destinationUrl;
    const utmParams: string[] = [];
    if (campaignLink.utmSource) utmParams.push(`utm_source=${campaignLink.utmSource}`);
    if (campaignLink.utmMedium) utmParams.push(`utm_medium=${campaignLink.utmMedium}`);
    if (campaignLink.utmCampaign) utmParams.push(`utm_campaign=${campaignLink.utmCampaign}`);

    if (utmParams.length > 0) {
        const separator = finalUrl.includes("?") ? "&" : "?";
        finalUrl += separator + utmParams.join("&");
    }

    // Extract domain for display
    let destinationDomain = "";
    try {
        destinationDomain = new URL(campaignLink.destinationUrl).hostname.replace("www.", "");
    } catch {
        destinationDomain = "partner store";
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
            <div className="max-w-lg w-full">
                {/* Main Card - Content-rich landing page (not just a redirect) */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header with Store Info */}
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-8 text-white text-center">
                        {campaignLink.store?.logo ? (
                            <img
                                src={campaignLink.store.logo}
                                alt={campaignLink.store.name}
                                className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-white p-2 object-contain"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-white/20 flex items-center justify-center">
                                <StoreIcon className="w-10 h-10 text-white" />
                            </div>
                        )}
                        <h1 className="text-2xl font-bold mb-2">{campaignLink.name}</h1>
                        {campaignLink.store && (
                            <p className="text-violet-200">Exclusive offer from {campaignLink.store.name}</p>
                        )}
                    </div>

                    {/* Deal Information - Shows actual content */}
                    <div className="p-6 space-y-6">
                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Verified Offer
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-orange-500" />
                                Limited Time
                            </div>
                        </div>

                        {/* Countdown & Redirect */}
                        <RedirectCountdown destinationUrl={finalUrl} storeName={campaignLink.store?.name} />

                        {/* Destination Transparency - Required for policy compliance */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
                                You will be redirected to:
                            </p>
                            <div className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-violet-600 flex-shrink-0" />
                                <p className="text-sm text-gray-700 font-medium truncate">
                                    {destinationDomain}
                                </p>
                            </div>
                        </div>

                        {/* Manual Proceed Button */}
                        <a
                            href={finalUrl}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Proceed to {campaignLink.store?.name || "Offer"}
                            <ArrowRight className="w-5 h-5" />
                        </a>

                        {/* Skip option */}
                        <Link
                            href="/"
                            className="block text-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            Or return to CouponHub
                        </Link>
                    </div>
                </div>

                {/* Affiliate Disclosure - Required by FTC & ad policies */}
                <div className="mt-6 text-center text-xs text-white/60 px-4">
                    <p>
                        <strong>Disclosure:</strong> CouponHub may earn a commission when you
                        make a purchase through this link at no extra cost to you. This helps
                        us provide free coupons and deals.
                    </p>
                </div>

                {/* Footer Links - Shows this is a real site */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/40">
                    <Link href="/privacy" className="hover:text-white/60">Privacy Policy</Link>
                    <span>•</span>
                    <Link href="/terms" className="hover:text-white/60">Terms of Service</Link>
                    <span>•</span>
                    <Link href="/" className="hover:text-white/60">Home</Link>
                </div>
            </div>
        </main>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const campaignLink = await prisma.campaignLink.findUnique({
        where: { slug },
        include: { merchantIdentity: { include: { store: true } } },
    });

    if (!campaignLink) {
        return { title: "Offer Not Found | CouponHub" };
    }

    return {
        title: `${campaignLink.name} | CouponHub`,
        description: `Get the best deal on ${campaignLink.store?.name || "our partner store"}. Verified offer with exclusive savings.`,
        // Not noindex - this is legitimate content now
        openGraph: {
            title: campaignLink.name,
            description: `Exclusive offer from ${campaignLink.store?.name || "partner store"}`,
            type: "website",
        },
    };
}
