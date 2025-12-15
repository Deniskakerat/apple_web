import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      stock: true,
      type: true,
      imagePath: true,
      description: true,
    },
  });

  if (!product) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(product);
}
