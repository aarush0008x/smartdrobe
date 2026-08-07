import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  let settings = await prisma.systemSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: { id: "default" },
    });
  }

  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      aiProvider,
      openaiApiKey,
      geminiApiKey,
      claudeApiKey,
      temperature,
      maxTokens,
      appName,
      appDescription,
      maintenanceMode,
      primaryColor,
      upiId,
      upiAccountHolder,
      upiQrImageUrl,
    } = body;

    const settings = await prisma.systemSettings.upsert({
      where: { id: "default" },
      update: {
        ...(aiProvider !== undefined && { aiProvider }),
        ...(openaiApiKey !== undefined && { openaiApiKey }),
        ...(geminiApiKey !== undefined && { geminiApiKey }),
        ...(claudeApiKey !== undefined && { claudeApiKey }),
        ...(temperature !== undefined && { temperature: parseFloat(temperature) }),
        ...(maxTokens !== undefined && { maxTokens: parseInt(maxTokens) }),
        ...(appName !== undefined && { appName }),
        ...(appDescription !== undefined && { appDescription }),
        ...(maintenanceMode !== undefined && { maintenanceMode: Boolean(maintenanceMode) }),
        ...(primaryColor !== undefined && { primaryColor }),
        ...(upiId !== undefined && { upiId }),
        ...(upiAccountHolder !== undefined && { upiAccountHolder }),
        ...(upiQrImageUrl !== undefined && { upiQrImageUrl }),
        ...(body.customApiName !== undefined && { customApiName: body.customApiName }),
        ...(body.customApiEndpoint !== undefined && { customApiEndpoint: body.customApiEndpoint }),
        ...(body.customApiKey !== undefined && { customApiKey: body.customApiKey }),
      },
      create: {
        id: "default",
        aiProvider: aiProvider || "openai",
        openaiApiKey,
        geminiApiKey,
        claudeApiKey,
        temperature: temperature ? parseFloat(temperature) : 0.7,
        maxTokens: maxTokens ? parseInt(maxTokens) : 1024,
        appName: appName || "SmartDrobe",
        appDescription: appDescription || "AI-Powered Minimalist Wardrobe Platform",
        maintenanceMode: Boolean(maintenanceMode),
        primaryColor: primaryColor || "#2563EB",
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
