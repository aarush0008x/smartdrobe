import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const season = searchParams.get("season");
  const search = searchParams.get("search");

  const whereClause: any = { userId: user.id };
  if (category && category !== "All") whereClause.category = category;
  if (season && season !== "All") whereClause.season = season;
  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { tags: { contains: search } },
      { color: { contains: search } },
    ];
  }

  const items = await prisma.clothingItem.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, category, imageUrl, color, season, occasion, tags, isFavorite } = body;

    if (!name || !category || !imageUrl) {
      return NextResponse.json(
        { error: "Name, category, and imageUrl are required" },
        { status: 400 }
      );
    }

    const newItem = await prisma.clothingItem.create({
      data: {
        userId: user.id,
        name,
        category,
        imageUrl,
        color: color || "Black",
        season: season || "All-Season",
        occasion: occasion || "Casual",
        tags: tags || "",
        isFavorite: Boolean(isFavorite),
      },
    });

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating wardrobe item:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
