// src/app/product/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params; // ✅ важливо!

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

  if (!product) return notFound();

  return (
    <main style={{ padding: 24 }}>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Ціна: {product.price} грн</p>
      <p>В наявності: {product.stock}</p>

      {product.imagePath && (
        // якщо ти використовуєш next/image — можна замінити на <Image />
        <img src={product.imagePath} alt={product.title} style={{ maxWidth: 400 }} />
      )}
    </main>
  );
}
