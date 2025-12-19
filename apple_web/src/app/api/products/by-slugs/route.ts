import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { slugs } = await req.json().catch(() => ({}));
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return Response.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      stock: true,
      imagePath: true,
    },
  });

  return Response.json({ products });
}
