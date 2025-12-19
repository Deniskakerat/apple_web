"use client";

import { useEffect, useState } from "react";

type OrderItem = { id: string; title: string; slug: string; price: number; qty: number };
type Order = {
  id: string;
  orderNumber: string;
  status: "NEW" | "CONFIRMED" | "DECLINED";
  customerName: string;
  phone: string;
  city: string;
  address: string;
  comment: string | null;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    if (!res.ok) {
      setErr("Не вдалося завантажити замовлення. (Перевір, що ти ADMIN)");
      return;
    }
    const data = await res.json();
    setOrders(data.orders ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: "CONFIRMED" | "DECLINED") => {
    setErr(null);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setErr("Не вдалося змінити статус замовлення.");
      return;
    }
    await load();
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 16px" }}>Admin • Замовлення</h2>

      {err && (
        <div style={{ padding: 12, border: "1px solid #e99", color: "#b00", borderRadius: 10, marginBottom: 12 }}>
          {err}
        </div>
      )}

      {orders.length === 0 ? (
        <p>Замовлень немає.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o) => (
            <div key={o.id} style={{ border: "1px solid #cfcfcf", borderRadius: 14, padding: 14, background: "#f6f2ea" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    № {o.orderNumber} • {o.status}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setStatus(o.id, "CONFIRMED")}
                    style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #bbb", cursor: "pointer" }}
                  >
                    Підтвердити
                  </button>
                  <button
                    onClick={() => setStatus(o.id, "DECLINED")}
                    style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #bbb", cursor: "pointer" }}
                  >
                    Відхилити
                  </button>
                </div>
              </div>

              <hr style={{ margin: "12px 0", opacity: 0.3 }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div><b>Клієнт:</b> {o.customerName}</div>
                  <div><b>Тел:</b> {o.phone}</div>
                  <div><b>Місто:</b> {o.city}</div>
                  <div><b>Адреса:</b> {o.address}</div>
                  {o.comment ? <div><b>Коментар:</b> {o.comment}</div> : null}
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Склад замовлення</div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {o.items.map((it) => (
                      <div key={it.id} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{it.title}</span>
                        <span>x{it.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, fontWeight: 700 }}>
                    Разом: {o.total} грн
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
