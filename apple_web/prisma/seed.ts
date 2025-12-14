import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const cat = await prisma.category.upsert({
    where: { slug: "apple-seedlings" },
    update: {},
    create: { name: "Яблуневі саджанці", slug: "apple-seedlings" },
  });

  const products = [
    { title: "Ноябрьська", slug: "noyabrska-1", price: 150, stock: 20 },
    { title: "Ноябрьська", slug: "noyabrska-2", price: 150, stock: 15 },
    { title: "Конкорд", slug: "concord-1", price: 150, stock: 30 },
    { title: "Ноябрьська", slug: "noyabrska-3", price: 150, stock: 10 },
    { title: "Ноябрьська", slug: "noyabrska-4", price: 150, stock: 12 },
    { title: "Конкорд", slug: "concord-2", price: 150, stock: 18 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { title: p.title, price: p.price, stock: p.stock, isActive: true, categoryId: cat.id },
      create: { title: p.title, slug: p.slug, price: p.price, stock: p.stock, categoryId: cat.id },
    });
  }

  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
