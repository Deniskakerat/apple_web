import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  const normEmail = String(email ?? "").trim().toLowerCase();
  const pass = String(password ?? "");

  if (!normEmail || !pass) {
    return Response.json({ error: "Вкажіть email і пароль." }, { status: 400 });
  }

  if (pass.length < 8) {
    return Response.json({ error: "Пароль має бути мінімум 8 символів." }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email: normEmail } });
  if (exists) {
    return Response.json({ error: "Цей email вже зареєстрований." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email: normEmail,
      name: name ? String(name) : null,
      passwordHash: await hashPassword(pass),
      role: "USER",
    },
  });

  const token = signToken(user.id);

  (await cookies()).set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ ok: true });
}
