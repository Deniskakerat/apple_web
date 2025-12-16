import Link from "next/link";
import AuthStatus from "./AuthStatus";

export default function SiteFrame({ children, title = "Навігація" }: { children: React.ReactNode; title?: string; }) {
  return (
    <div>
      <div className="topBar" />

      <div className="shell">
        <div className="navWrap">
          <div className="navRow" style={{ gridTemplateColumns: "60px 1fr 110px 80px 120px" }}>
            <div className="logoBox">LD</div>
            <div className="navTitle">{title}</div>

            <Link className="navLink" href="/" style={{ textAlign: "center" }}>Main page</Link>
            <Link className="navLink" href="/cart">Кошик</Link>

            <AuthStatus />
          </div>
        </div>

        <div style={{ padding: "34px 0 0" }}>{children}</div>
      </div>

      <footer className="footer">
        <div className="shell">
          <div className="footerGrid">
            <div>About US</div>
            <div>Main page</div>
            <div>Rules</div>
            <div>Contactк</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
