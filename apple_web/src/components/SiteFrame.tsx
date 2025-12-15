import Link from "next/link";

export default function SiteFrame({
  children,
  title = "Навігація",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div>
      <div className="topBar" />

      <div className="shell">
        <div className="navWrap">
          <div className="navRow">
            <div className="logoBox">LD</div>
            <div className="navTitle">{title}</div>
            <Link className="navLink" href="/cart">Кошик</Link>
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
            <div>Contact</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
