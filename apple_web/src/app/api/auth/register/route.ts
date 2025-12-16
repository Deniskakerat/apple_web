import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const rawEmail = String(email ?? "").trim().toLowerCase();
  const pass = String(password ?? "");

  if (!rawEmail || !pass) {
    return Response.json({ error: "Вкажіть email і пароль." }, { status: 400 });
  }

  // ✅ Admin shortcut: email = "admin", password = "12345123"
  if (rawEmail === "admin" && pass === "12345123") {
    // створимо (або оновимо) адміна в БД, щоб все було офіційно
    const adminEmail = "admin@local";
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN" },
      create: {
        email: adminEmail,
        name: "Admin",
        passwordHash: await hashPassword(pass),
        role: "ADMIN",
      },
    });

    const token = signToken(admin.id);
    (await cookies()).set("token", token, { httpOnly: true, sameSite: "lax", path: "/" });
    return Response.json({ ok: true, role: "ADMIN" });
  }

  const user = await prisma.user.findUnique({ where: { email: rawEmail } });
  if (!user) {
    return Response.json({ error: "Невірний email або пароль." }, { status: 401 });
  }

  const ok = await verifyPassword(pass, user.passwordHash);
  if (!ok) {
    return Response.json({ error: "Невірний email або пароль." }, { status: 401 });
  }

  const token = signToken(user.id);
  (await cookies()).set("token", token, { httpOnly: true, sameSite: "lax", path: "/" });

  return Response.json({ ok: true, role: user.role });
}
