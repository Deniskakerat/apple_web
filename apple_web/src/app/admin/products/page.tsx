"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  type: string | null;
  description: string | null;
  imagePath: string | null;
  isActive: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    const res = await fetch("/api/admin/products", { cache: "no-store" });
    if (!res.ok) {
      setErr("Не вдалося завантажити товари. (Перевір, що ти ADMIN)");
      return;
    }
    const data = await res.json();
    setProducts(data.products ?? []);
  };

  useEffect(() => { load(); }, []);

  const patch = async (id: string, data: Partial<Product>) => {
    setErr(null);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setErr("Не вдалося оновити товар.");
      return;
    }
    await load();
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 16px" }}>Admin • Товари</h2>

      {err && (
        <div style={{ padding: 12, border: "1px solid #e99", color: "#b00", borderRadius: 10, marginBottom: 12 }}>
          {err}
        </div>
      )}

      {products.length === 0 ? (
        <p>Товарів немає.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {products.map((p) => (
            <div key={p.id} style={{ border: "1px solid #cfcfcf", borderRadius: 14, padding: 14, background: "#f6f2ea" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 140px 140px", gap: 10, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.title} <span style={{ opacity: 0.6, fontWeight: 400 }}>({p.slug})</span></div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>{p.type ?? "—"} • {p.isActive ? "Active" : "Disabled"}</div>
                </div>

                <input
                  defaultValue={p.price}
                  type="number"
                  min={0}
                  onBlur={(e) => patch(p.id, { price: Number(e.target.value) })}
                  style={{ padding: 8, borderRadius: 10, border: "1px solid #bbb" }}
                />

                <input
                  defaultValue={p.stock}
                  type="number"
                  min={0}
                  onBlur={(e) => patch(p.id, { stock: Number(e.target.value) })}
                  style={{ padding: 8, borderRadius: 10, border: "1px solid #bbb" }}
                />

                <input
                  defaultValue={p.type ?? ""}
                  placeholder="type: apple/pear..."
                  onBlur={(e) => patch(p.id, { type: e.target.value || null })}
                  style={{ padding: 8, borderRadius: 10, border: "1px solid #bbb" }}
                />

                <button
                  onClick={() => patch(p.id, { isActive: !p.isActive })}
                  style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #bbb", cursor: "pointer" }}
                >
                  {p.isActive ? "Disable" : "Enable"}
                </button>
              </div>

              <div style={{ marginTop: 10 }}>
                <textarea
                  defaultValue={p.description ?? ""}
                  placeholder="Опис..."
                  onBlur={(e) => patch(p.id, { description: e.target.value || null })}
                  style={{ width: "100%", minHeight: 70, padding: 10, borderRadius: 12, border: "1px solid #bbb" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
