"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Item = { slug: string; qty: number };

function readCart(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem("cart") || "{}"); } catch { return {}; }
}
function writeCart(cart: Record<string, number>) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export default function CartPage() {
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => { setCart(readCart()); }, []);

  const items: Item[] = useMemo(
    () => Object.entries(cart).map(([slug, qty]) => ({ slug, qty })),
    [cart]
  );

  const inc = (slug: string) => {
    const next = { ...cart, [slug]: (cart[slug] ?? 0) + 1 };
    setCart(next); writeCart(next);
  };
  const dec = (slug: string) => {
    const nextQty = (cart[slug] ?? 0) - 1;
    const next = { ...cart };
    if (nextQty <= 0) delete next[slug];
    else next[slug] = nextQty;
    setCart(next); writeCart(next);
  };
  const del = (slug: string) => {
    const next = { ...cart };
    delete next[slug];
    setCart(next); writeCart(next);
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
      <h1>Кошик</h1>

      {items.length === 0 ? (
        <p>Кошик порожній. <Link href="/">Перейти в магазин</Link></p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((it) => (
            <div key={it.slug} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <b>{it.slug}</b>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>кількість: {it.qty}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => dec(it.slug)} style={{ borderRadius: 10, padding: "8px 10px", border: "1px solid var(--border)" }}>-</button>
                <button onClick={() => inc(it.slug)} style={{ borderRadius: 10, padding: "8px 10px", border: "1px solid var(--border)" }}>+</button>
                <button onClick={() => del(it.slug)} style={{ borderRadius: 10, padding: "8px 10px", border: "1px solid var(--border)" }}>Видалити</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
