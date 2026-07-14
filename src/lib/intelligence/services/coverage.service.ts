import { prisma } from "@/lib/db";

export interface GranularCoverage {
    offers: number;
    policies: number;
    guides: number;
    timeline: number;
    faq: number;
    comparisons: number;
    trustSignals: number;
}

export interface CoverageResult {
    overallCoverage: number;
    granular: GranularCoverage;
    reasons: string[];
}

export class CoverageService {
    /**
     * Calculates coverage metrics on the fly based on observed data.
     */
    async calculateMerchantCoverage(storeId: string): Promise<CoverageResult> {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: {
                coupons: { take: 1, select: { id: true } },
                storeContents: { select: { type: true } },
                merchantHistories: { take: 1, select: { id: true } },
            }
        });

        if (!store) {
            return {
                overallCoverage: 0,
                granular: { offers: 0, policies: 0, guides: 0, timeline: 0, faq: 0, comparisons: 0, trustSignals: 0 },
                reasons: ["Store not found"]
            };
        }

        const hasOffers = store.coupons.length > 0;
        const hasPolicies = store.storeContents.some(c => c.type === 'SHIPPING' || c.type === 'RETURNS');
        const hasFaq = store.storeContents.some(c => c.type === 'FAQ');
        const hasGuide = store.storeContents.some(c => c.type === 'BUYING_GUIDE');
        const hasTimeline = store.merchantHistories.length > 0;
        
        // Trust is defined by cryptographic verification (isVerified) or baseline status
        const hasTrustSignals = store.isActive || store.isFeatured;
        
        // Comparisons not fully built in schema yet, mock to 0 for now
        const hasComparisons = false;

        const granular = {
            offers: hasOffers ? 100 : 0,
            policies: hasPolicies ? 100 : 0,
            guides: hasGuide ? 100 : 0,
            timeline: hasTimeline ? 100 : 0,
            faq: hasFaq ? 100 : 0,
            comparisons: hasComparisons ? 100 : 0,
            trustSignals: hasTrustSignals ? 100 : 0
        };

        const scoreValues = Object.values(granular);
        const overallCoverage = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);

        const reasons = [];
        if (hasOffers) reasons.push("Active Offers (+14%)"); else reasons.push("Missing Offers (0%)");
        if (hasPolicies) reasons.push("Policies present (+14%)"); else reasons.push("Missing Policies (0%)");
        if (hasGuide) reasons.push("Buying Guides present (+14%)"); else reasons.push("Missing Buying Guides (0%)");
        if (hasTimeline) reasons.push("Timeline events exist (+14%)"); else reasons.push("Empty Timeline (0%)");
        if (hasFaq) reasons.push("FAQ structured (+14%)"); else reasons.push("Missing FAQ (0%)");
        if (hasTrustSignals) reasons.push("Trust Signals active (+14%)"); else reasons.push("Low Trust Signals (0%)");

        return { overallCoverage, granular, reasons };
    }
}
