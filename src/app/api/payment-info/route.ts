import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
      select: {
        upiId: true,
        upiAccountHolder: true,
        upiQrImageUrl: true,
      },
    });

    return NextResponse.json({
      upiId: settings?.upiId || "smartdrobe@upi",
      upiAccountHolder: settings?.upiAccountHolder || "SmartDrobe Official",
      upiQrImageUrl: settings?.upiQrImageUrl || "",
    });
  } catch (error) {
    return NextResponse.json({
      upiId: "smartdrobe@upi",
      upiAccountHolder: "SmartDrobe Official",
      upiQrImageUrl: "",
    });
  }
}
