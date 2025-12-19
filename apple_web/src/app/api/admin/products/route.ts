import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin("/admin/products");
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ products });
}
