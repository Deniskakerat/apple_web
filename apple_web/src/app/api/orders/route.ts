import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const PHONE_RE = /^\+380 \d{2} \d{3} \d{4}$/;

export async function POST(req: Request) {
  const body = await req.json();

  const customerName = String(body.customerName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const city = String(body.city ?? "").trim();
  const address = String(body.address ?? "").trim();
  const comment = body.comment ? String(body.comment).trim() : null;

  const items = Array.isArray(body.items) ? body.items : [];

  if (!customerName || !phone || !city || !address) {
    return Response.json({ error: "Заповніть усі обовʼязкові поля." }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return Response.json({ error: "Телефон має бути у форматі +380 YY YYY YYYY" }, { status: 400 });
  }
  if (items.length === 0) {
    return Response.json({ error: "Кошик порожній." }, { status: 400 });
  }

  // optional user
  let userId: string | null = null;
  try {
    const jar = await cookies();
    const token = jar.get("token")?.value;
    if (token) userId = verifyToken(token).userId;
  } catch {
    userId = null;
  }

  // Load products by slug, snapshot title/price, validate stock
  const slugs = items.map((x: any) => String(x.slug));
  const dbProducts = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true, title: true, price: true, stock: true, isActive: true },
  });

  const bySlug = new Map(dbProducts.map(p => [p.slug, p]));

  let total = 0;
  const orderItems: any[] = [];

  for (const it of items) {
    const slug = String(it.slug);
    const qty = Number(it.qty);

    if (!Number.isFinite(qty) || qty < 1) {
      return Response.json({ error: "Невірна кількість." }, { status: 400 });
    }

    const p = bySlug.get(slug);
    if (!p || !p.isActive) {
      return Response.json({ error: `Товар недоступний: ${slug}` }, { status: 400 });
    }
    if (p.stock < qty) {
      return Response.json({ error: `Недостатньо на складі: ${p.title}` }, { status: 400 });
    }

    total += p.price * qty;

    orderItems.push({
      productId: p.id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      qty,
    });
  }

  // Create order + decrease stock (transaction)
  const order = await prisma.$transaction(async (tx: any) => {
    for (const it of orderItems) {
      await tx.product.update({
        where: { slug: it.slug },
        data: { stock: { decrement: it.qty } },
      });
    }

    return tx.order.create({
      data: {
        customerName,
        phone,
        city,
        address,
        comment,
        userId,
        total,
        items: { create: orderItems },
      },
      select: { id: true, orderNumber: true },
    });
  });

  return Response.json({ ok: true, orderNumber: order.orderNumber });
}
