import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, csvContent } = body;

    let itemsToImport: any[] = [];

    if (Array.isArray(items) && items.length > 0) {
      itemsToImport = items;
    } else if (csvContent && typeof csvContent === "string") {
      // Parse CSV lines
      const lines = csvContent.split(/\r?\n/).filter((line) => line.trim() !== "");
      if (lines.length > 1) {
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
          if (values.length >= 2) {
            const itemObj: any = {};
            headers.forEach((h, idx) => {
              itemObj[h] = values[idx] || "";
            });
            itemsToImport.push(itemObj);
          }
        }
      }
    }

    if (itemsToImport.length === 0) {
      return NextResponse.json(
        { error: "No valid clothing items found in import data" },
        { status: 400 }
      );
    }

    // Bulk insert formatted items
    const createdItems = await Promise.all(
      itemsToImport.map((item) =>
        prisma.clothingItem.create({
          data: {
            userId: user.id,
            name: item.name || "Imported Item",
            category: item.category || "Shirts",
            imageUrl: item.imageurl || item.imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
            color: item.color || "Black",
            season: item.season || "All-Season",
            occasion: item.occasion || "Casual",
            tags: item.tags || "imported",
            isFavorite: item.isfavorite === "true" || item.isFavorite === true,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      count: createdItems.length,
      items: createdItems,
    });
  } catch (error) {
    console.error("Wardrobe import error:", error);
    return NextResponse.json({ error: "Failed to import items" }, { status: 500 });
  }
}
