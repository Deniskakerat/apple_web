import SiteFrame from "@/components/SiteFrame";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "./product-client";

type PageProps = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: PageProps) {
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
      type: true,
    },
  });

  if (!product) return notFound();

  return (
    <SiteFrame title="Навігація">
      <ProductClient product={product} />
    </SiteFrame>
  );
}
