import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("/admin/orders");
  const { id } = await params;

  const { status } = await req.json();
  if (!["CONFIRMED", "DECLINED"].includes(status)) {
    return Response.json({ error: "Bad status" }, { status: 400 });
  }

  await prisma.order.update({ where: { id }, data: { status } });
  return Response.json({ ok: true });
}
