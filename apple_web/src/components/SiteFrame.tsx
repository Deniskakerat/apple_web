import Link from "next/link";
import AuthStatus from "@/components/AuthStatus";

export default function SiteFrame({
  children,
  title = "Плодові саджанці",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div>
      {/* TOP GREEN BAR */}
      <div
        style={{
          height: 44,
          background: "#0b3d2a",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 500,
        }}
      >
        Попередній запис відкрито  Встигни Забронювати
      </div>

      <div className="shell">
        {/* NAV STRIP */}
        <div
          style={{
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.35)",
            padding: "8px 10px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 120px",
              alignItems: "center",
            }}
          >
            {/* left logo */}
            <div className="logoBox" style={{ justifySelf: "start" }}>
              LD
            </div>

            {/* center menu */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 28,
                alignItems: "center",
                fontSize: 13,
              }}
            >
              <Link href="/" className="navLink" style={{ textDecoration: "none" }}>
                Main page
              </Link>

              <Link href="/cart" className="navLink" style={{ textDecoration: "none" }}>
                Cart
              </Link>

              {/* Admin link inside AuthStatus (if ADMIN) + Guest label */}
              <AuthStatus />
            </div>

            {/* right icons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 14 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: "rgba(160,190,150,0.55)",
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              />
              <div
                style={{
                  width: 22,
                  height: 22,
                  background: "rgba(160,190,150,0.55)",
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              />
            </div>
          </div>
        </div>

        {/* PAGE TITLE (big like screenshot) */}
        <div style={{ padding: "18px 0 0", textAlign: "center" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#0b3d2a" }}>
            {title}
          </div>
        </div>

        <div style={{ padding: "18px 0 0" }}>{children}</div>
      </div>

      <footer className="footer">
        <div className="shell">
          <div className="footerGrid">
            <div>About US</div>
            <div>Навігація</div>
            <div>Правила</div>
            <div>Зв’язок</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
