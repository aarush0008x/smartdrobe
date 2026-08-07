import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { processAIChatMessage } from "@/lib/ai";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let conversation = await prisma.aIChatConversation.findFirst({
    where: { userId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!conversation) {
    conversation = await prisma.aIChatConversation.create({
      data: {
        userId: user.id,
        title: "Styling Assistant",
      },
      include: { messages: true },
    });
  }

  return NextResponse.json({ conversation });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { message, conversationId, generateImage } = body;

    if (!message) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    let convId = conversationId;
    if (!convId) {
      const conv = await prisma.aIChatConversation.findFirst({
        where: { userId: user.id },
      }) || await prisma.aIChatConversation.create({
        data: { userId: user.id, title: "Fashion Chat" },
      });
      convId = conv.id;
    }

    // 1. Save user message
    const userMsg = await prisma.chatMessage.create({
      data: {
        conversationId: convId,
        role: "user",
        content: message,
      },
    });

    // 2. Process AI Response
    const aiResult = await processAIChatMessage(message, [], { generateImage: !!generateImage });

    // 3. Save assistant message
    const assistantMsg = await prisma.chatMessage.create({
      data: {
        conversationId: convId,
        role: "assistant",
        content: aiResult.content,
        imageUrl: aiResult.imageUrl || null,
      },
    });

    return NextResponse.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
