import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const jar = await cookies();
  const token = jar.get("token")?.value;

  if (!token) return Response.json({ user: null });

  try {
    const { userId } = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    return Response.json({ user });
  } catch {
    return Response.json({ user: null });
  }
}
