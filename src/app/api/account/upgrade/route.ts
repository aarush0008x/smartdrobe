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
    const { plan, utrNumber } = body;

    if (!plan || !["PRO", "EXECUTIVE"].includes(plan.toUpperCase())) {
      return NextResponse.json({ error: "Invalid subscription plan selected" }, { status: 400 });
    }

    if (!utrNumber || utrNumber.trim().length < 6) {
      return NextResponse.json(
        { error: "Valid 12-digit UPI UTR / Transaction Reference ID is required" },
        { status: 400 }
      );
    }

    const pendingStatus = `PENDING_${plan.toUpperCase()}`;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: pendingStatus,
        paymentUtr: utrNumber.trim(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionPlan: true,
        paymentUtr: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `UPI Payment submitted! UTR ${utrNumber} is pending admin verification for ${plan.toUpperCase()} Plan.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Manual UPI upgrade error:", error);
    return NextResponse.json({ error: "Failed to submit payment request" }, { status: 500 });
  }
}
