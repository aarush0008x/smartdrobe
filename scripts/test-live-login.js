const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const dbUrl = "postgresql://neondb_owner:npg_knXTHMi4fY8s@ep-frosty-meadow-zaclk2lc-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

async function main() {
  console.log("Testing query on live Neon PostgreSQL database...");
  const user = await prisma.user.findUnique({
    where: { email: "admin@smartdrobe.ai" },
  });

  console.log("User query result:", user ? { id: user.id, email: user.email, role: user.role } : "NOT FOUND");
  
  if (user) {
    const valid = await bcrypt.compare("admin123", user.passwordHash);
    console.log("Password comparison for admin123:", valid ? "SUCCESS" : "FAILED");
  }
}

main()
  .catch(err => console.error("Error connecting to live DB:", err))
  .finally(() => prisma.$disconnect());
