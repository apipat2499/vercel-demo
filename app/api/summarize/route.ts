import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    // ✅ ป้องกัน JSON parse error
    let content = "";
    try {
      const body = await req.json();
      content = body?.content || "";
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'content' field" },
        { status: 400 }
      );
    }

    const prompt = `Summarize this news article clearly and concisely in 1-2 paragraphs:\n\n${content}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI news summarizer." },
        { role: "user", content: prompt },
      ],
      max_tokens: 250,
      temperature: 0.6,
    });

    const summary =
      completion.choices?.[0]?.message?.content?.trim() ||
      "⚠️ No summary returned.";

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("❌ summarize error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}