"use client";

import Image from "next/image";
import { useState } from "react";
import SiteFrame from "../../../components/SiteFrame";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  imagePath: string | null;
  description: string | null;
};

function readCart(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem("cart") || "{}"); } catch { return {}; }
}
function writeCart(cart: Record<string, number>) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export default function ProductClient({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);

  const buy = () => {
    const q = Math.max(1, Math.min(999, qty));
    const cart = readCart();
    cart[product.slug] = (cart[product.slug] ?? 0) + q;
    writeCart(cart);
    alert(`Додано: ${q} шт ✅`);
  };

  return (
    <SiteFrame title="Навігація">
      <div style={{ display: "grid", gridTemplateColumns: "430px 1fr", gap: 28, alignItems: "start" }}>
        {/* left image card */}
        <div style={{ background: "var(--panel2)", padding: 20, borderRadius: 2, width: "fit-content" }}>
          <div style={{ position: "relative", width: 280, height: 330, background: "#fff", border: "1px solid var(--border)" }}>
            {product.imagePath ? (
              <Image src={product.imagePath} alt={product.title} fill style={{ objectFit: "cover" }} />
            ) : null}
          </div>
        </div>

        {/* right info */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{product.title}</div>

          <div style={{ marginTop: 6, fontSize: 34, fontWeight: 800 }}>
            {product.price} UAH
          </div>

          <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 12 }}>
            Ціна за штуку саджанця
          </div>

          {/* quantity + buy */}
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Кількість</div>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "white",
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Наявність</div>
              <div className="card" style={{ padding: "10px 12px" }}>
                {product.stock} шт
              </div>
            </div>
          </div>

          <button
            onClick={buy}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 6,
              border: "1px solid #2a2a2a",
              background: "#2a2a2a",
              color: "white",
              cursor: "pointer",
            }}
          >
            Купити
          </button>

          {/* description block */}
          <div className="card" style={{ marginTop: 14, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Опис</div>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
              {product.description ?? "Опис відсутній."}
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}
