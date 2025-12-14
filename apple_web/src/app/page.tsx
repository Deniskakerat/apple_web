import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ShopClient from "./shop/ShopClient";

export default async function Page() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, title: true, slug: true, price: true, stock: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ background: "var(--panel)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)" }} />
            <b>LD</b>
          </div>
          <nav style={{ display: "flex", gap: 18, color: "var(--muted)" }}>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>Магазин</Link>
            <Link href="/cart" style={{ textDecoration: "none", color: "inherit" }}>Кошик</Link>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Про нас</a>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Контакти</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "18px 16px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 18 }}>
        <aside style={{ background: "var(--panel2)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
          <h3 style={{ margin: 0, marginBottom: 10 }}>Фільтри</h3>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>
            <div style={{ marginBottom: 10 }}>
              <b style={{ color: "var(--text)" }}>Категорії</b>
              <ul style={{ marginTop: 8 }}>
                <li>Усі</li><li>Осінні яблука</li><li>Літні яблука</li><li>Зимові яблука</li>
              </ul>
            </div>
            <div>
              <b style={{ color: "var(--text)" }}>Ціна</b>
              <div style={{ marginTop: 8 }}>від 0 до 300 грн</div>
            </div>
          </div>
        </aside>

        <section>
          <h1 style={{ textAlign: "center", marginTop: 0 }}>Плодові саджанці</h1>
          <ShopClient products={products} />
        </section>
      </main>

      <footer style={{ marginTop: 28, background: "var(--panel)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div>About US</div><div>Навігація</div><div>Правила</div>
        </div>
      </footer>
    </div>
  );
}
