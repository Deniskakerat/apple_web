"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteFrame from "@/components/SiteFrame";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  imagePath: string | null;
  type: string | null;        // apple/pear/plum/peach...
  categoryId?: string | null; // якщо є
  category?: { name: string } | null; // якщо підтягуєш
};

export default function HomePage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1) грузимо товари з API (зроби /api/products або використай свій)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        setProducts(Array.isArray(data?.products) ? data.products : (Array.isArray(data) ? data : []));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) список категорій по type
  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) if (p.type) set.add(p.type);
    return ["all", ...Array.from(set)];
  }, [products]);

  // 3) фільтрація
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);

    return products.filter((p) => {
      const inText =
        !qq ||
        p.title.toLowerCase().includes(qq) ||
        p.slug.toLowerCase().includes(qq);

      const inType = type === "all" ? true : p.type === type;
      const inPrice = p.price >= min && p.price <= max;

      return inText && inType && inPrice;
    });
  }, [products, q, type, minPrice, maxPrice]);

  return (
    <SiteFrame title="Плодові саджанці">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* LEFT FILTERS */}
        <aside
          style={{
            borderRight: "1px solid var(--border)",
            paddingRight: 14,
          }}
        >
          <h3 style={{ margin: "0 0 12px" }}>Фільтри</h3>

          {/* Search */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
              Пошук
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Напр. Антонівка…"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            />
          </div>

          {/* Category (type) */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
              Категорія
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {typeOptions.map((t) => (
                <label key={t} style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="type"
                    checked={type === t}
                    onChange={() => setType(t)}
                  />
                  <span>
                    {t === "all" ? "Усі" : t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
              Ціна (UAH)
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="від"
                inputMode="numeric"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="до"
                inputMode="numeric"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              setQ("");
              setType("all");
              setMinPrice("");
              setMaxPrice("");
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "white",
              cursor: "pointer",
            }}
          >
            Скинути фільтри
          </button>
        </aside>

        {/* RIGHT GRID */}
        <section>
          {loading ? (
            <div style={{ color: "var(--muted)" }}>Завантаження…</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: "var(--muted)" }}>Нічого не знайдено.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  style={{
                    display: "block",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    background: "var(--card)",
                    padding: 12,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {p.imagePath ? (
                    <img
                      src={p.imagePath}
                      alt={p.title}
                      style={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                    />
                  ) : null}

                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
                    {p.price} UAH
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </SiteFrame>
  );
}
