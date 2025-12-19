import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      stock: true,
      imagePath: true,
      description: true,
      type: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ products });
}
