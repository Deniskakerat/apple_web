"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  imagePath: string | null;
  description: string | null;
  type: string | null;
};

function readCart(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem("cart") || "{}"); } catch { return {}; }
}
function writeCart(cart: Record<string, number>) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export default function ProductClient({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);

  const canBuy = product.stock > 0;

  const inCart = useMemo(() => {
    const cart = readCart();
    return cart[product.slug] ?? 0;
  }, [product.slug]);

  const addToCart = () => {
    const cart = readCart();
    const nextQty = Math.min((cart[product.slug] ?? 0) + qty, product.stock);
    cart[product.slug] = nextQty;
    writeCart(cart);
    // легке підтвердження без UI бібліотек
    alert(`Додано в кошик: ${product.title} × ${qty}`);
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: 22,
          alignItems: "start",
        }}
      >
        {/* LEFT: image card */}
        <div
          style={{
            background: "rgba(120, 160, 120, 0.18)",
            borderRadius: 14,
            padding: 18,
            border: "1px solid var(--border)",
          }}
        >
          {product.imagePath ? (
            <img
              src={product.imagePath}
              alt={product.title}
              style={{
                width: "100%",
                height: 360,
                objectFit: "cover",
                borderRadius: 12,
                background: "white",
              }}
            />
          ) : (
            <div
              style={{
                height: 360,
                borderRadius: 12,
                border: "1px dashed var(--border)",
                display: "grid",
                placeItems: "center",
                color: "var(--muted)",
              }}
            >
              Немає фото
            </div>
          )}
        </div>

        {/* RIGHT: info */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            {product.title}
          </div>

          <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 6 }}>
            {product.price} UAH
          </div>

          <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 14 }}>
            Ціна за штуку саджанця · В наявності: <b>{product.stock}</b> · В кошику: <b>{inCart}</b>
          </div>

          {/* qty + buy */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: 10,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              style={{
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                background: "white",
              }}
              disabled={!canBuy}
            >
              {Array.from({ length: Math.max(1, Math.min(10, product.stock)) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} шт</option>
              ))}
            </select>

            <button
              onClick={addToCart}
              disabled={!canBuy}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid #2a2a2a",
                background: "#2a2a2a",
                color: "white",
                cursor: canBuy ? "pointer" : "not-allowed",
                opacity: canBuy ? 1 : 0.6,
              }}
            >
              Купити
            </button>
          </div>

          {/* description card */}
          <div
            style={{
              marginTop: 12,
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6 }}>Опис</div>
            <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>
              {product.description || "Опис буде додано пізніше."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
