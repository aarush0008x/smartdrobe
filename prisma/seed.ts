import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SmartDrobe database...");

  // Clean existing data
  await prisma.aPILog.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.aIChatConversation.deleteMany({});
  await prisma.outfit.deleteMany({});
  await prisma.clothingItem.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.systemSettings.deleteMany({});

  // 1. Create Default System Settings
  await prisma.systemSettings.create({
    data: {
      id: "default",
      aiProvider: "gemini",
      geminiApiKey: process.env.GEMINI_API_KEY || "your_gemini_api_key_here",
      temperature: 0.7,
      maxTokens: 1024,
      appName: "SmartDrobe",
      appDescription: "AI-Powered Minimalist Wardrobe & Style Platform",
      maintenanceMode: false,
      primaryColor: "#2563EB",
      upiId: "smartdrobe@upi",
      upiAccountHolder: "SmartDrobe Official Merchant",
      upiQrImageUrl: "",
    },
  });

  // Seed Initial Plans
  await prisma.plan.deleteMany({});
  await prisma.plan.createMany({
    data: [
      {
        name: "PRO",
        title: "Pro Styling Plan",
        priceUsd: 12.0,
        priceInr: 999,
        billingCycle: "monthly",
        description: "Unlimited AI Outfit Generations & Unlimited Digital Wardrobe Vault Items",
        features: "Unlimited Wardrobe Catalog,Unlimited AI Recommendations,High Resolution Image Storage,Priority AI Processing",
        isPopular: true,
      },
      {
        name: "EXECUTIVE",
        title: "Executive VIP Plan",
        priceUsd: 29.0,
        priceInr: 2399,
        billingCycle: "monthly",
        description: "Dedicated AI Key Integration & 1-on-1 Personal Stylist Chat Strategy",
        features: "Custom LLM API Key Integration,Dedicated Personal Stylist AI,Bulk CSV/JSON Imports,Priority Support 24/7",
        isPopular: false,
      },
    ],
  });

  // 2. Create Admin & User Accounts
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@smartdrobe.ai",
      name: "Alexander Vance",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: "user@smartdrobe.ai",
      name: "Sophia Chen",
      passwordHash: userPassword,
      role: "USER",
      emailVerified: true,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    },
  });

  console.log(`👤 Created Users: ${admin.email} (ADMIN), ${demoUser.email} (USER)`);

  // 3. Create Wardrobe Items for Demo User
  const wardrobeData = [
    {
      name: "Minimalist Oxford Crisp Shirt",
      category: "Shirts",
      imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
      color: "White",
      season: "All-Season",
      occasion: "Work",
      tags: "linen, crisp, tailored, formal",
      isFavorite: true,
    },
    {
      name: "Japanese Raw Selvedge Denim",
      category: "Pants",
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
      color: "Dark Blue",
      season: "All-Season",
      occasion: "Casual",
      tags: "denim, durable, classic fit",
      isFavorite: true,
    },
    {
      name: "Minimalist Leather Low-Top Sneakers",
      category: "Shoes",
      imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
      color: "White",
      season: "All-Season",
      occasion: "Casual",
      tags: "leather, comfortable, versatile",
      isFavorite: true,
    },
    {
      name: "Merino Wool Trench Coat",
      category: "Jackets",
      imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80",
      color: "Beige",
      season: "Winter",
      occasion: "Work",
      tags: "wool, double-breasted, warm",
      isFavorite: false,
    },
    {
      name: "Silk Slip Evening Dress",
      category: "Dresses",
      imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
      color: "Black",
      season: "Summer",
      occasion: "Party",
      tags: "silk, elegant, cocktail",
      isFavorite: true,
    },
    {
      name: "Structured Chronograph Steel Watch",
      category: "Accessories",
      imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
      color: "Silver",
      season: "All-Season",
      occasion: "Formal",
      tags: "steel, watch, luxury",
      isFavorite: false,
    },
    {
      name: "Heavyweight Boxy Tee",
      category: "Shirts",
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
      color: "Black",
      season: "Summer",
      occasion: "Casual",
      tags: "cotton, relaxed, streetwear",
      isFavorite: false,
    },
    {
      name: "Tailored Pleated Trousers",
      category: "Pants",
      imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=600&q=80",
      color: "Charcoal",
      season: "Fall",
      occasion: "Work",
      tags: "wool blend, pleated, sleek",
      isFavorite: true,
    },
    {
      name: "Full-Grain Italian Leather Belt",
      category: "Accessories",
      imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80",
      color: "Black",
      season: "All-Season",
      occasion: "Casual",
      tags: "leather, belt, buckle, minimal",
      isFavorite: true,
    },
    {
      name: "Classic Italian Leather Chelsea Boots",
      category: "Shoes",
      imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80",
      color: "Black",
      season: "Fall",
      occasion: "Casual",
      tags: "leather, boots, chelsea, durable",
      isFavorite: true,
    },
  ];

  const items = [];
  for (const item of wardrobeData) {
    const created = await prisma.clothingItem.create({
      data: {
        ...item,
        userId: demoUser.id,
      },
    });
    items.push(created);
  }

  console.log(`👗 Created ${items.length} wardrobe clothing items.`);

  // 4. Create Pre-generated Outfits
  await prisma.outfit.create({
    data: {
      userId: demoUser.id,
      title: "Executive Modern Minimalist",
      occasion: "Work",
      season: "All-Season",
      weather: "Mild / Indoor",
      score: 98,
      explanation: "Pairs crisp white Oxford shirt with tailored charcoal pleated trousers and white leather sneakers. Clean, comfortable, and authoritative.",
      clothingItemIds: JSON.stringify([items[0].id, items[7].id, items[2].id]),
      isFavorite: true,
    },
  });

  await prisma.outfit.create({
    data: {
      userId: demoUser.id,
      title: "Chic Evening Elegance",
      occasion: "Party",
      season: "Summer",
      weather: "Warm Evening",
      score: 94,
      explanation: "Features the silk slip dress styled with the steel chronograph watch and minimal heels.",
      clothingItemIds: JSON.stringify([items[4].id, items[5].id]),
      isFavorite: false,
    },
  });

  // 5. Create AI Chat Conversation
  const conv = await prisma.aIChatConversation.create({
    data: {
      userId: demoUser.id,
      title: "Capsule Wardrobe Strategy",
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        conversationId: conv.id,
        role: "user",
        content: "How can I build a 10-piece capsule wardrobe that works for both remote work and formal dinner meetings?",
      },
      {
        conversationId: conv.id,
        role: "assistant",
        content: "To construct a high-versatility capsule wardrobe, focus on high-quality neutrals in crisp white, black, charcoal, and beige.\n\n### Recommended Core Setup:\n1. **2 Crisp Button-downs** (1 White Oxford, 1 Light Blue Cotton)\n2. **2 Tailored Bottoms** (1 Raw Selvedge Denim, 1 Charcoal Pleated Trousers)\n3. **1 Outerwear** (Beige Wool Trench Coat or Structured Blazer)\n4. **2 Shoes** (1 Minimal White Leather Sneaker, 1 Black Chelsea Boot)\n5. **1 Statement Accessory** (Steel Chronograph Watch)\n\nThis setup provides **over 18 distinct styling combinations** with zero visual clutter.",
      },
    ],
  });

  // 6. Create API Logs
  await prisma.aPILog.createMany({
    data: [
      { endpoint: "/api/outfits/generate", method: "POST", statusCode: 200, durationMs: 142 },
      { endpoint: "/api/wardrobe", method: "GET", statusCode: 200, durationMs: 45 },
      { endpoint: "/api/chat", method: "POST", statusCode: 200, durationMs: 280 },
    ],
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
