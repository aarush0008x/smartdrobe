import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { priceUsd: "asc" },
    });
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, title, priceUsd, priceInr, description, features, isPopular } = body;

    if (!name || !title || priceUsd === undefined || priceInr === undefined) {
      return NextResponse.json({ error: "Name, title, priceUsd and priceInr are required" }, { status: 400 });
    }

    const plan = await prisma.plan.create({
      data: {
        name: name.toUpperCase().replace(/\s+/g, "_"),
        title,
        priceUsd: parseFloat(priceUsd),
        priceInr: parseInt(priceInr),
        description: description || "",
        features: features || "Full Access",
        isPopular: !!isPopular,
      },
    });

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error("Create plan error:", error);
    return NextResponse.json({ error: error.message || "Failed to create plan" }, { status: 500 });
  }
}
