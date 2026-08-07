import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAIImage } from "@/lib/ai";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.clothingItem.findMany({
      where: { userId: user.id },
    });

    const topsCount = items.filter((i) => i.category === "Shirts").length;
    const pantsCount = items.filter((i) => i.category === "Pants").length;
    const shoesCount = items.filter((i) => i.category === "Shoes").length;
    const outerwearCount = items.filter((i) => i.category === "Outerwear").length;
    const accessoriesCount = items.filter((i) => i.category === "Accessories").length;

    const recommendations = [];

    if (pantsCount < 2) {
      recommendations.push({
        id: "gap-1",
        title: "Charcoal Tailored Pleated Trousers",
        category: "Pants",
        unlockedOutfitsCount: 14,
        reasoning: "Adding structured charcoal trousers balances your top collection and unlocks 14 formal & smart-casual looks.",
        estimatedPrice: "$120",
        imageUrl: generateAIImage("Charcoal tailored pleated trousers, high fashion editorial"),
      });
    }

    if (shoesCount < 2) {
      recommendations.push({
        id: "gap-2",
        title: "Italian Full-Grain Leather Chelsea Boots",
        category: "Shoes",
        unlockedOutfitsCount: 10,
        reasoning: "Leather boots instantly elevate denim and trousers for rainy weather and evening occasions.",
        estimatedPrice: "$180",
        imageUrl: generateAIImage("Dark brown Italian leather Chelsea boots, luxury product shot"),
      });
    }

    if (outerwearCount < 1) {
      recommendations.push({
        id: "gap-3",
        title: "Unstructured Navy Virgin Wool Blazer",
        category: "Outerwear",
        unlockedOutfitsCount: 18,
        reasoning: "A versatile navy blazer serves as the ultimate layering piece over t-shirts or oxford button-downs.",
        estimatedPrice: "$220",
        imageUrl: generateAIImage("Navy blue unstructured wool blazer jacket, editorial studio shot"),
      });
    }

    if (accessoriesCount < 2) {
      recommendations.push({
        id: "gap-4",
        title: "Minimal Steel Chronograph & Full-Grain Belt",
        category: "Accessories",
        unlockedOutfitsCount: 8,
        reasoning: "Matching a minimalist steel watch with a leather belt completes your ensemble with refined contrast.",
        estimatedPrice: "$140",
        imageUrl: generateAIImage("Minimalist silver steel wristwatch and brown leather belt product shoot"),
      });
    }

    return NextResponse.json({
      totalItems: items.length,
      categoryCounts: {
        tops: topsCount,
        pants: pantsCount,
        shoes: shoesCount,
        outerwear: outerwearCount,
        accessories: accessoriesCount,
      },
      gapRecommendations: recommendations,
      unlockedPotentialBoost: recommendations.reduce((acc, curr) => acc + curr.unlockedOutfitsCount, 0),
    });
  } catch (error) {
    console.error("Gap analysis API error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
