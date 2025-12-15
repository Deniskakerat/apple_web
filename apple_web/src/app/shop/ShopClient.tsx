"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  type: string | null;
  imagePath: string | null;
};

type Cart = Record<string, number>;

function readCart(): Cart {
  try { return JSON.parse(localStorage.getItem("cart") || "{}"); } catch { return {}; }
}
function writeCart(cart: Cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function readHistory(): string[] {
  try { return JSON.parse(localStorage.getItem("searchHistoryUk") || "[]"); } catch { return []; }
}
function writeHistory(list: string[]) {
  localStorage.setItem("searchHistoryUk", JSON.stringify(list));
}

export default function ShopClient({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");
  const [appliedQ, setAppliedQ] = useState("");
  const [type, setType] = useState("all");
  const [qtyBySlug, setQtyBySlug] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => setHistory(readHistory()), []);

  const filtered = useMemo(() => {
    const qq = appliedQ.trim().toLowerCase();
    return products.filter(p => {
      const okType = type === "all" ? true : p.type === type;
      const okQ = qq ? p.title.toLowerCase().includes(qq) : true;
      return okType && okQ;
    });
  }, [products, appliedQ, type]);

  const onSearch = () => {
    const uk = q.trim().toLowerCase();
    setAppliedQ(uk);

    if (uk) {
      const next = [uk, ...history.filter(x => x !== uk)].slice(0, 8);
      setHistory(next);
      writeHistory(next);
    }
  };

  const addToCart = (slug: string) => {
    const qty = Math.max(1, Math.min(999, qtyBySlug[slug] ?? 1));
    const cart = readCart();
    cart[slug] = (cart[slug] ?? 0) + qty;
    writeCart(cart);
    alert(`Додано в кошик: ${qty} шт ✅`);
  };

  return (
    <>
      {/* Search + filter */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук українською: Антонівка, Гала, Ноябрська..."
          style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", outline: "none" }}
          onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
        />

        <button
          onClick={onSearch}
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--accent)", color: "white", cursor: "pointer" }}
        >
          Пошук
        </button>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "white" }}
        >
          <option value="all">Усі</option>
          <option value="apple">Яблуня</option>
          <option value="pear">Груша</option>
          <option value="plum">Слива</option>
          <option value="peach">Персик</option>
        </select>
      </div>

      {/* Search history */}
      {history.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {history.map((h) => (
            <button
              key={h}
              onClick={() => { setQ(h); setAppliedQ(h); }}
              style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--panel2)", cursor: "pointer" }}
            >
              {h}
            </button>
          ))}
          <button
            onClick={() => { setHistory([]); writeHistory([]); }}
            style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid var(--border)", background: "white", cursor: "pointer" }}
          >
            очистити
          </button>
        </div>
      )}

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
            <div style={{ position: "relative", height: 150, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
              {p.imagePath ? (
                <Image src={p.imagePath} alt={p.title} fill style={{ objectFit: "cover" }} />
              ) : (
                <div style={{ height: "100%", background: "linear-gradient(180deg, #ffffff, #eef3ea)" }} />
              )}
            </div>

            <div style={{ marginTop: 10 }}>
              <Link href={`/product/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
  <div style={{ fontWeight: 700 }}>{p.title}</div>
</Link>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.price} UAH</div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>К-сть:</span>
              <input
                type="number"
                min={1}
                value={qtyBySlug[p.slug] ?? 1}
                onChange={(e) => setQtyBySlug(x => ({ ...x, [p.slug]: Number(e.target.value) }))}
                style={{ width: 80, padding: "8px 10px", borderRadius: 10, border: "1px solid var(--border)" }}
              />
              <span style={{ fontSize: 12, color: "var(--muted)" }}>шт</span>
            </div>

            <button
              onClick={() => addToCart(p.slug)}
              style={{ marginTop: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--accent)", color: "white", cursor: "pointer" }}
            >
              Додати в кошик
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
