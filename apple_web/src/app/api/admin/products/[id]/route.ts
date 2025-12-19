import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("/admin/products");
  const { id } = await params;

  const body = await req.json();
  const data: any = {};

  if (typeof body.price === "number") data.price = body.price;
  if (typeof body.stock === "number") data.stock = body.stock;
  if (typeof body.type === "string") data.type = body.type;
  if (body.type === null) data.type = null;

  if (typeof body.description === "string") data.description = body.description;
  if (body.description === null) data.description = null;

  if (typeof body.isActive === "boolean") data.isActive = body.isActive;

  await prisma.product.update({ where: { id }, data });
  return Response.json({ ok: true });
}
