import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateAIOutfit } from "@/lib/ai";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { occasion, season, weather, style, mood, colorPreference, budget } = body;

    if (!occasion || !season || !weather || !style) {
      return NextResponse.json(
        { error: "Occasion, season, weather, and style are required" },
        { status: 400 }
      );
    }

    const generatedOutfit = await generateAIOutfit(user.id, {
      occasion,
      season,
      weather,
      style,
      mood,
      colorPreference,
      budget,
    });

    return NextResponse.json({ outfit: generatedOutfit });
  } catch (error) {
    console.error("AI outfit generation error:", error);
    return NextResponse.json({ error: "Failed to generate outfit" }, { status: 500 });
  }
}
