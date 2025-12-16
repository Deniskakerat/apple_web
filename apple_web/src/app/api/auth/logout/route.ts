import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  const jar = await cookies();
  jar.set("token", "", { path: "/", maxAge: 0 }); // стабільно працює в Next 16
  return Response.json({ ok: true });
}
