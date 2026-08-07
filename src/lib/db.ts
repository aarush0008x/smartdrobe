import { PrismaClient } from "@prisma/client";

function getCleanDatabaseUrl(): string {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const clean = raw.trim().replace(/^["']|["']$/g, "");
    if (clean.startsWith("postgresql://") || clean.startsWith("postgres://")) {
      return clean;
    }
  }

  // Fallback to active live Neon PostgreSQL database connection string
  return "postgresql://neondb_owner:npg_knXTHMi4fY8s@ep-frosty-meadow-zaclk2lc-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require";
}

const activeDbUrl = getCleanDatabaseUrl();
process.env.DATABASE_URL = activeDbUrl;
process.env.POSTGRES_PRISMA_URL = activeDbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
