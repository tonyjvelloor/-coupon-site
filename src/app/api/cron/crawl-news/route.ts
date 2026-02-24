import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

// Protect the endpoint with a secret so only our Cron job can trigger it
const CRON_SECRET = process.env.CRON_SECRET || "local-dev-secret-key";

// Helper to generate slug
const generateSlug = (title: string, index: number) => {
    const baseSlug = title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const uniqueId = Math.random().toString(36).substring(2, 6);
    return `${baseSlug}-${uniqueId}-${index}`;
};

export async function GET(request: Request) {
    try {
        // 1. Authenticate Request
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${CRON_SECRET}`) {
            // For local testing, allow if no auth but warn
            console.warn("⚠️ Unauthorized cron attempt. Ensure CRON_SECRET is passed in production.");
            if (process.env.NODE_ENV === "production") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        console.log("🚀 Starting Automated News Crawl...");

        // 2. Fetch Raw Deals Data
        // For this implementation, we simulate fetching from an aggregator API (like Reddit/r/deals or a JSON feed)
        // In a full production app, you would use 'cheerio' here to scrape HTML sites or 'fetch' to hit JSON APIs
        const rawDeals = [
            {
                title: "Apple M3 MacBook Pro drops to lowest price ever ($1,299)",
                url: "https://example.com/deal/m3-macbook",
                source: "TechDeals",
                description: "Amazon just dropped the price of the base M3 MacBook Pro 14-inch by $300. This is the lowest price we've seen since launch.",
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
            },
            {
                title: "Random Phone Case 5% off",
                url: "https://example.com/deal/phone-case",
                source: "RandomStore",
                description: "Get 5% off this generic silicone phone case. Limit 1 per customer.",
                image: null
            },
            {
                title: "Sony WH-1000XM5 Noise Cancelling Headphones - $248 (Refurbished)",
                url: "https://example.com/deal/sony-xm5",
                source: "AudioBargains",
                description: "eBay has certified refurbished Sony XM5s for extremely cheap today. Includes 2-year warranty.",
                image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb"
            }
        ];

        // 3. Initialize OpenAI
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        let addedCount = 0;

        // 4. Process and AI-Verify Each Deal
        for (let i = 0; i < rawDeals.length; i++) {
            const deal = rawDeals[i];

            // AI Prompt: Determine if viral/worthy, and rewrite if yes
            const prompt = `
            Analyze this product deal:
            Title: ${deal.title}
            Description: ${deal.description}
            
            Is this a genuinely high-value, exciting, or "viral" deal that users would care about? (e.g., big discounts on premium tech, rare price drops).
            If NO (e.g., tiny 5% discount, boring generic item): strictly return {"status": "REJECT"}
            If YES: Return a JSON object with status "APPROVE" and a punchy, 3-sentence summary that highlights why this deal is amazing and creates urgency.
            
            Return format MUST be valid JSON:
            {
                "status": "REJECT" | "APPROVE",
                "summary": "Your 3 sentence summary here (if approved)"
            }
            `;

            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4-turbo",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" }
                });

                const aiResponse = JSON.parse(completion.choices[0].message?.content || "{}");

                if (aiResponse.status === "APPROVE" && aiResponse.summary) {
                    // Save to DB
                    await prisma.newsArticle.create({
                        data: {
                            title: deal.title,
                            slug: generateSlug(deal.title, i),
                            summary: aiResponse.summary,
                            sourceUrl: deal.url,
                            sourceName: deal.source,
                            imageUrl: deal.image,
                            isVerified: true,
                        }
                    });
                    addedCount++;
                    console.log(`✅ Approved and Saved: ${deal.title}`);
                } else {
                    console.log(`❌ Rejected by AI: ${deal.title}`);
                }

            } catch (err) {
                console.error(`Error processing deal: ${deal.title}`, err);
                // Continue to next item even if one fails
            }
        }

        return NextResponse.json({
            success: true,
            message: `Crawl complete. Added ${addedCount} new viral articles.`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Cron Crawl Error:", error);
        return NextResponse.json(
            { error: "Failed to execute news crawler" },
            { status: 500 }
        );
    }
}
