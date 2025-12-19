import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin(nextUrl = "/admin/orders") {
  const jar = await cookies(); // ✅ важливо
  const token = jar.get("token")?.value;

  if (!token) redirect(`/login?next=${encodeURIComponent(nextUrl)}`);

  const { userId } = verifyToken(token);

  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!u || u.role !== "ADMIN") redirect("/");
}
