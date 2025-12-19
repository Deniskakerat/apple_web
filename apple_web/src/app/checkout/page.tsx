"use client";

import { useEffect, useMemo, useState } from "react";
import SiteFrame from "@/components/SiteFrame";
import { useRouter } from "next/navigation";

type CartMap = Record<string, number>;

function readCart(): CartMap {
  try { return JSON.parse(localStorage.getItem("cart") || "{}"); } catch { return {}; }
}
function clearCart() {
  localStorage.removeItem("cart");
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartMap>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => setCart(readCart()), []);

  const items = useMemo(() => Object.entries(cart).map(([slug, qty]) => ({ slug, qty })), [cart]);
  const isEmpty = items.length === 0;

  async function placeOrder() {
    setMsg(null);

    if (isEmpty) {
      setMsg("Кошик порожній.");
      return;
    }
    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setMsg("Заповніть імʼя, телефон, місто та адресу доставки.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          address: address.trim(),
          comment: comment.trim() || null,
          items,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.error ?? "Не вдалося оформити замовлення.");
        return;
      }

      clearCart();
      router.replace("/");
      router.refresh();
      alert("Замовлення оформлено! Адміністратор отримає його в панелі.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteFrame title="Оформлення замовлення">
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
        {isEmpty ? (
          <div style={{ color: "var(--muted)" }}>
            Кошик порожній. Поверніться в магазин і додайте товари.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "start" }}>
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Дані доставки</div>

              <div style={{ display: "grid", gap: 10 }}>
                <input placeholder="Імʼя" value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input placeholder="Місто" value={city} onChange={(e) => setCity(e.target.value)} />
                <input placeholder="Адреса (вулиця, будинок, кв.)" value={address} onChange={(e) => setAddress(e.target.value)} />
                <textarea placeholder="Коментар (необовʼязково)" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
              </div>

              {msg && (
                <div style={{ marginTop: 12, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "white", color: "#a00000" }}>
                  {msg}
                </div>
              )}
            </div>

            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Ваше замовлення</div>

              <div style={{ display: "grid", gap: 8, color: "var(--muted)", fontSize: 13 }}>
                {items.map((it) => (
                  <div key={it.slug} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{it.slug}</span>
                    <b>x{it.qty}</b>
                  </div>
                ))}
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                style={{
                  marginTop: 14,
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #2a2a2a",
                  background: "#2a2a2a",
                  color: "white",
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "..." : "Оформити замовлення"}
              </button>

              <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 12 }}>
                Оплата буде додана пізніше. Зараз ми лише передаємо замовлення адміну.
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteFrame>
  );
}
