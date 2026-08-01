import { StoreContent, BankOffer, ShoppingTip } from "@prisma/client";

export class ContentSplitService {
    // Thresholds
    private readonly MIN_WORDS_FOR_PAGE = 1200;
    private readonly MIN_ITEMS_FOR_PAGE = 10;

    /**
     * Helper to estimate word count
     */
    private countWords(text?: string | null): number {
        if (!text) return 0;
        return text.trim().split(/\s+/).length;
    }

    /**
     * Evaluate if a guide should be split into a dedicated page
     */
    shouldSplitGuide(content?: string | null): boolean {
        return this.countWords(content) > this.MIN_WORDS_FOR_PAGE;
    }

    /**
     * Evaluate if FAQ should be split into a dedicated page
     */
    shouldSplitFaq(faqJsonStr?: string | null): boolean {
        if (!faqJsonStr) return false;
        try {
            const parsed = JSON.parse(faqJsonStr);
            return Array.isArray(parsed) && parsed.length > this.MIN_ITEMS_FOR_PAGE;
        } catch {
            // fallback to word count if not JSON
            return this.countWords(faqJsonStr) > this.MIN_WORDS_FOR_PAGE;
        }
    }

    shouldSplitBankOffers(offers: any[]): boolean {
        return offers.length > this.MIN_ITEMS_FOR_PAGE;
    }

    shouldSplitShoppingTips(tips: any[]): boolean {
        return tips.length > this.MIN_ITEMS_FOR_PAGE;
    }
}

export const contentSplitService = new ContentSplitService();
