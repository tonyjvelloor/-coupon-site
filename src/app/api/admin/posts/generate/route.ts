import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { topic, tone } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const selectedTone = tone || "professional";

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const prompt = `Write a comprehensive, SEO-optimized 500-word blog post about "${topic}" in a ${selectedTone} tone.
        Return exactly in this JSON format:
        {
          "content": "Full markdown content with # headers, bullet points, and paragraphs",
          "seoTitle": "A catchy, SEO-optimized title under 60 chars",
          "seoDescription": "A compelling meta description under 160 chars",
          "keywords": "comma, separated, keywords, related, to, topic"
        }`;
       
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });
        
        const aiData = JSON.parse(completion.choices[0].message?.content || "{}");
        return NextResponse.json(aiData);

    } catch (error) {
        console.error("AI Generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate content" },
            { status: 500 }
        );
    }
}
