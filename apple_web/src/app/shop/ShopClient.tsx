"use client";

type Product = { id: string; title: string; slug: string; price: number; stock: number };

function getCart(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem("cart") || "{}"); } catch { return {}; }
}

function setCart(cart: Record<string, number>) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export default function ShopClient({ products }: { products: Product[] }) {
  const add = (slug: string) => {
    const cart = getCart();
    cart[slug] = (cart[slug] ?? 0) + 1;
    setCart(cart);
    alert("Додано в кошик ✅");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {products.map((p) => (
        <div key={p.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
          <div style={{ height: 140, borderRadius: 10, border: "1px solid var(--border)", background: "linear-gradient(180deg, #ffffff, #eef3ea)" }} />
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.price} UAH</div>
          </div>
          <button
            onClick={() => add(p.slug)}
            style={{
              marginTop: 10, width: "100%", padding: "10px 12px",
              borderRadius: 10, border: "1px solid var(--border)",
              background: "var(--accent)", color: "white", cursor: "pointer"
            }}
          >
            В кошик
          </button>
        </div>
      ))}
    </div>
  );
}
