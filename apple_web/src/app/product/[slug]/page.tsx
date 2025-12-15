import { prisma } from "@/lib/prisma";
import ProductClient from "./product-client";

export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      stock: true,
      imagePath: true,      
      description: true,
    },
  });

  if (!product) {
    return <div style={{ padding: 20 }}>Товар не знайдено</div>;
  }

  return <ProductClient product={product} />;
}
