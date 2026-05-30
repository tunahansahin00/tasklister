import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "İş", color: "#3b82f6", icon: "💼", isDefault: true },
  { name: "Kişisel", color: "#8b5cf6", icon: "👤", isDefault: true },
  { name: "Sağlık", color: "#10b981", icon: "💪", isDefault: true },
  { name: "Alışveriş", color: "#f59e0b", icon: "🛒", isDefault: true },
  { name: "Spor", color: "#ef4444", icon: "🏃", isDefault: true },
  { name: "Okuma", color: "#06b6d4", icon: "📖", isDefault: true },
  { name: "Proje", color: "#f97316", icon: "📁", isDefault: true },
  { name: "Aile", color: "#ec4899", icon: "👨‍👩‍👧‍👦", isDefault: true },
  { name: "Finans", color: "#22c55e", icon: "💰", isDefault: true },
  { name: "Sosyal", color: "#a855f7", icon: "🤝", isDefault: true },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
