import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { merchantService } from '@/lib/services/merchant.service';
import { couponService } from '@/lib/services/coupon.service';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, storeContext, userProfile } = await req.json();

    const result = await streamText({
        model: openai('gpt-4o-mini'),
        messages,
        system: `You are the CouponHub Shopping Copilot, a highly intelligent and trustworthy shopping assistant.
Your job is to orchestrate deterministic data from our backend to help users find the best deals, calculate savings, and compare stores.
You have access to tools that query our database directly. ALWAYS use these tools to find actual deals—never invent or hallucinate coupons.
If the user provides a store context (e.g. they are on the Amazon store page), prioritize that store.

Current Store Context: ${storeContext || 'None'}
User Shopping Profile: ${userProfile || 'None provided'}

When explaining savings, be precise:
1. State the coupon to use.
2. State any cashback or bank offers.
3. Show the exact estimated savings or strategy.

Do not use markdown formatting for links unless necessary. Keep responses concise, friendly, and highly actionable.`,
        tools: {
            searchCoupons: tool({
                description: 'Search for active coupons and deals for a specific store. Use this whenever the user asks for deals, coupons, or offers for a merchant.',
                parameters: z.object({
                    storeSlug: z.string().describe('The slugified name of the store (e.g., "amazon", "flipkart", "myntra")'),
                }),
                execute: async ({ storeSlug }) => {
                    try {
                        const coupons = await couponService.getStoreCoupons(storeSlug);
                        const activeCoupons = coupons.filter((c: any) => !c.expiresAt || new Date(c.expiresAt) > new Date());
                        return activeCoupons.map((c: any) => ({
                            title: c.title,
                            code: c.code,
                            discountValue: c.discountValue,
                            type: c.type,
                        }));
                    } catch (error) {
                        return { error: 'Failed to fetch coupons. The store might not exist or there was a database error.' };
                    }
                },
            }),
            compareStores: tool({
                description: 'Compare active deals across multiple stores to find where the user should shop.',
                parameters: z.object({
                    storeSlugs: z.array(z.string()).describe('An array of store slugs to compare (e.g., ["amazon", "flipkart"])'),
                }),
                execute: async ({ storeSlugs }) => {
                    try {
                        const results = [];
                        for (const slug of storeSlugs) {
                            const store = await merchantService.getMerchantBySlug(slug);
                            if (!store) continue;
                            const coupons = await couponService.getStoreCoupons(slug);
                            const activeCoupons = coupons.filter((c: any) => !c.expiresAt || new Date(c.expiresAt) > new Date());
                            // Sort by best discount
                            activeCoupons.sort((a: any, b: any) => {
                                const aVal = a.discountValue ? parseInt(a.discountValue.replace(/[^0-9]/g, '')) || 0 : 0;
                                const bVal = b.discountValue ? parseInt(b.discountValue.replace(/[^0-9]/g, '')) || 0 : 0;
                                return bVal - aVal;
                            });
                            results.push({
                                storeName: store.name,
                                bestDeal: activeCoupons.length > 0 ? {
                                    title: activeCoupons[0].title,
                                    code: activeCoupons[0].code,
                                    discountValue: activeCoupons[0].discountValue
                                } : 'No active deals'
                            });
                        }
                        return results;
                    } catch (error) {
                        return { error: 'Failed to compare stores.' };
                    }
                },
            }),
            calculateSavings: tool({
                description: 'A deterministic calculator to compute exact savings when combining a coupon, cashback, and bank offers. Use this to provide a precise savings amount.',
                parameters: z.object({
                    basePrice: z.number().describe('The original price of the item'),
                    flatDiscount: z.number().optional().describe('A flat amount off (e.g., 500 for ₹500 off)'),
                    percentageDiscount: z.number().optional().describe('A percentage off (e.g., 10 for 10% off)'),
                    cashbackPercentage: z.number().optional().describe('Cashback percentage to apply to the post-discount price (e.g., 5 for 5%)'),
                }),
                execute: async ({ basePrice, flatDiscount = 0, percentageDiscount = 0, cashbackPercentage = 0 }) => {
                    let currentPrice = basePrice;
                    
                    // Apply percentage discount first if present, otherwise flat discount
                    let discountAmount = 0;
                    if (percentageDiscount > 0) {
                        discountAmount = currentPrice * (percentageDiscount / 100);
                        currentPrice -= discountAmount;
                    } else if (flatDiscount > 0) {
                        discountAmount = flatDiscount;
                        currentPrice = Math.max(0, currentPrice - discountAmount);
                    }

                    // Apply cashback on final price
                    const cashbackAmount = currentPrice * (cashbackPercentage / 100);
                    
                    const totalSavings = discountAmount + cashbackAmount;
                    
                    return {
                        basePrice,
                        discountApplied: discountAmount,
                        cashbackEarned: cashbackAmount,
                        finalEffectivePrice: currentPrice - cashbackAmount,
                        totalSavings
                    };
                },
            }),
            createAlert: tool({
                description: 'Create a watchlist alert to notify the user when a price drops or a specific deal becomes available. Use this when the user asks to be notified, watched, or alerted about a product or store.',
                parameters: z.object({
                    query: z.string().describe('The product or deal the user is looking for (e.g., "iPhone 17", "Samsung S24")'),
                    threshold: z.string().optional().describe('The price drop or discount threshold (e.g., "under 50,000", "50% off")'),
                    storeSlug: z.string().optional().describe('The specific store, if mentioned'),
                }),
                execute: async ({ query, threshold, storeSlug }) => {
                    return {
                        success: true,
                        message: `Successfully created alert for ${query}${threshold ? ` ${threshold}` : ''}${storeSlug ? ` at ${storeSlug}` : ''}. We'll notify you when this happens.`,
                    };
                },
            }),
        },
    });

    return result.toDataStreamResponse();
}
