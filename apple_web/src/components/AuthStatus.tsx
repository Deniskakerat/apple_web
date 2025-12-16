"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Me = { id: string; email: string; name: string | null; role: "USER" | "ADMIN" };

export default function AuthStatus() {
  const [user, setUser] = useState<Me | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const load = async () => {
    const res = await fetch("/api/auth/me", {
      cache: "no-store",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    setUser(data.user ?? null);
  };

useEffect(() => {
  let alive = true;
  (async () => {
    const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (alive) setUser(data.user ?? null);
  })();
  return () => { alive = false; };
}, [pathname]);

const logout = async () => {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  setUser(null);
  router.replace("/");
  router.refresh();
};

  if (!user) return <Link className="navLink" href="/login">Log in</Link>;

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "var(--muted)" }}>{user.role}</span>

      {user.role === "ADMIN" && (
        <Link className="navLink" href="/admin" style={{ textDecoration: "underline" }}>
          ADMIN
        </Link>
      )}

      <button
        onClick={logout}
        style={{ background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
      >
        Logout
      </button>
    </div>
  );
}
