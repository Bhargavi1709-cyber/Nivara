import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey,
});

async function main(q: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: q,
  });
  return response.text;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "World";
  const d = await main("Explain how AI works in a few words");
  return NextResponse.json({ message: `Hello, ${name}!`, data: d });
}

export async function POST(req: Request) {
  const data = await req.json();
  const _x0211A1 = data.prompt;
  const _x0211A2 = await main(data.prompt);
  return NextResponse.json({
    message: "Received!",
    prompt: _x0211A1,
    res: _x0211A2,
  });
}
