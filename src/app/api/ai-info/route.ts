import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    const provider = settings?.aiProvider || "gemini";
    let activeModel = "Google Gemini 1.5 Flash";

    if (provider === "openai") {
      activeModel = "OpenAI GPT-4o";
    } else if (provider === "claude") {
      activeModel = "Anthropic Claude 3.5 Sonnet";
    } else if (provider === "custom") {
      activeModel = settings?.customApiName || "Custom LLM API Endpoint";
    }

    return NextResponse.json({
      provider,
      activeModel,
      customEndpoint: provider === "custom" ? settings?.customApiEndpoint : undefined,
    });
  } catch (error) {
    return NextResponse.json({
      provider: "gemini",
      activeModel: "Google Gemini 1.5 Flash",
    });
  }
}
