"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteFrame from "@/components/SiteFrame";
import { useRouter } from "next/navigation";

type CartMap = Record<string, number>;

type Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  stock: number;
  imagePath: string | null;
};

function readCart(): CartMap {
  try { return JSON.parse(localStorage.getItem("cart") || "{}"); } catch { return {}; }
}
function writeCart(cart: CartMap) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartMap>({});
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const c = readCart();
    setCart(c);
  }, []);

  useEffect(() => {
    (async () => {
      const slugs = Object.keys(cart);
      if (slugs.length === 0) {
        setProducts({});
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/products/by-slugs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slugs }),
        });
        const data = await res.json().catch(() => ({}));
        const map: Record<string, Product> = {};
        for (const p of (data.products ?? [])) map[p.slug] = p;
        setProducts(map);
      } finally {
        setLoading(false);
      }
    })();
  }, [cart]);

  const items = useMemo(() => Object.entries(cart).map(([slug, qty]) => {
    const p = products[slug];
    return { slug, qty, p };
  }), [cart, products]);

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.p ? it.p.price * it.qty : 0), 0);
  }, [items]);

  const setQty = (slug: string, nextQty: number) => {
    const next = { ...cart };
    if (nextQty <= 0) delete next[slug];
    else next[slug] = nextQty;
    setCart(next);
    writeCart(next);
  };

  return (
    <SiteFrame title="Кошик">
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
        {loading ? (
          <div style={{ color: "var(--muted)" }}>Завантаження…</div>
        ) : items.length === 0 ? (
          <div>
            <p>Кошик порожній.</p>
            <Link href="/">Перейти в магазин</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map(({ slug, qty, p }) => (
              <div
                key={slug}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: "84px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "rgba(120, 160, 120, 0.18)",
                    border: "1px solid var(--border)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {p?.imagePath ? (
                    <img src={p.imagePath} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>Фото</span>
                  )}
                </div>

                <div>
                  <div style={{ fontWeight: 800 }}>
                    {p ? p.title : slug}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                    {p ? `${p.price} грн / шт` : "…"}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>
                    Сума: <b>{p ? p.price * qty : 0} грн</b>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    onClick={() => setQty(slug, qty - 1)}
                    style={{ borderRadius: 10, padding: "8px 10px", border: "1px solid var(--border)", background: "white", cursor: "pointer" }}
                  >
                    –
                  </button>

                  <div style={{ minWidth: 34, textAlign: "center", fontWeight: 700 }}>{qty}</div>

                  <button
                    onClick={() => setQty(slug, qty + 1)}
                    style={{ borderRadius: 10, padding: "8px 10px", border: "1px solid var(--border)", background: "white", cursor: "pointer" }}
                  >
                    +
                  </button>

                  <button
                    onClick={() => setQty(slug, 0)}
                    style={{ borderRadius: 10, padding: "8px 10px", border: "1px solid var(--border)", background: "white", cursor: "pointer" }}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--border)",
                paddingTop: 14,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900 }}>
                Разом: {total} грн
              </div>

              <button
                onClick={() => router.push("/checkout")}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid #2a2a2a",
                  background: "#2a2a2a",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Перейти до оформлення
              </button>
            </div>
          </div>
        )}
      </div>
    </SiteFrame>
  );
}
