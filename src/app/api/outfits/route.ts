import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const outfits = await prisma.outfit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ outfits });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, occasion, season, weather, score, explanation, clothingItemIds, isFavorite } = body;

    const outfit = await prisma.outfit.create({
      data: {
        userId: user.id,
        title,
        occasion,
        season,
        weather,
        score: score || 95,
        explanation,
        clothingItemIds: typeof clothingItemIds === "string" ? clothingItemIds : JSON.stringify(clothingItemIds),
        isFavorite: Boolean(isFavorite),
      },
    });

    return NextResponse.json({ outfit }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
