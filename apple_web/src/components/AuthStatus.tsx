"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Me = { id: string; email: string; name: string | null; role: "USER" | "ADMIN" };

export default function AuthStatus() {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  async function loadMe() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
      const data = await res.json().catch(() => ({}));
      setUser(data.user ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (loading) return null;

  // ✅ Guest
  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link className="navLink" href="/login">
          Log in
        </Link>
        <span style={{ color: "var(--muted)" }}>Guest</span>
      </div>
    );
  }

  // ✅ Logged in
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {user.role === "ADMIN" && (
        <>
          <Link className="navLink" href="/admin/orders" style={{ fontWeight: 700 }}>
            Admin Orders
          </Link>
          <Link className="navLink" href="/admin/products" style={{ fontWeight: 700 }}>
            Manage Products
          </Link>
        </>
      )}

      <span style={{ color: "var(--muted)" }}>
        {user.role === "ADMIN" ? "Admin" : user.email}
      </span>

      <button
        onClick={async () => {
          await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
          setUser(null);

          // ✅ оновити сторінку/стан після logout
          router.refresh();
          router.push("/");
        }}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "3px 8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
