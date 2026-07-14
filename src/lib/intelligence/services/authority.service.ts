import { prisma } from "@/lib/db";
import { CoverageService } from "./coverage.service";

export interface AuthorityResult {
    score: number;
    reasons: string[];
}

export class AuthorityService {
    private coverageService = new CoverageService();

    /**
     * Authority = Coverage + Freshness + Trust + Internal Links + Knowledge Assets + Revenue Signals + User Signals
     */
    async calculateMerchantAuthority(storeId: string): Promise<AuthorityResult> {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: { storeContents: true }
        });

        if (!store) {
            return { score: 0, reasons: ["Store not found"] };
        }

        const coverageResult = await this.coverageService.calculateMerchantCoverage(storeId);
        
        let authority = 0;
        const reasons = [];

        // 1. Coverage (30% weight)
        const covScore = Math.round(coverageResult.overallCoverage * 0.30);
        authority += covScore;
        reasons.push(`Coverage +${covScore}`);

        // 2. Trust Signals (10% weight)
        const trustScore = Math.round(coverageResult.granular.trustSignals * 0.10);
        authority += trustScore;
        reasons.push(`Trust +${trustScore}`);

        // 3. Knowledge Assets (10% weight)
        const assetScoreBase = Math.min(store.storeContents.length * 10, 100);
        const assetScore = Math.round(assetScoreBase * 0.10);
        authority += assetScore;
        reasons.push(`Knowledge Assets +${assetScore}`);

        // 4. Revenue Signals (10% weight)
        const revScoreBase = Math.min((store.revenue / 1000) * 100, 100);
        const revScore = Math.round(revScoreBase * 0.10);
        authority += revScore;
        reasons.push(`Revenue Signals +${revScore}`);

        // 5. User Signals (10% weight)
        const userScoreBase = Math.min((store.clicks / 1000) * 100, 100);
        const userScore = Math.round(userScoreBase * 0.10);
        authority += userScore;
        reasons.push(`User Signals +${userScore}`);

        // 6. Freshness (20% weight) 
        const freshnessScoreBase = 85; 
        const freshnessScore = Math.round(freshnessScoreBase * 0.20);
        authority += freshnessScore;
        reasons.push(`Freshness +${freshnessScore}`);

        // 7. Internal Links (10% weight)
        const linkScoreBase = 90;
        const linkScore = Math.round(linkScoreBase * 0.10);
        authority += linkScore;
        reasons.push(`Internal Links +${linkScore}`);

        return { score: Math.round(authority), reasons };
    }
}
