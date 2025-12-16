"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteFrame from "@/components/SiteFrame";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 async function submit() {
  setMsg(null);

  const e = email.trim().toLowerCase();
  const p = password;

  if (!e || !p) {
    setMsg("Вкажіть email і пароль.");
    return;
  }
  if (mode === "register" && p.length < 8) {
    setMsg("Пароль має бути мінімум 8 символів.");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: e, password: p }),
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.error || "Помилка. Спробуйте ще раз.");
      return;
    }


router.replace("/");
router.refresh();
  } finally {
    setLoading(false);
  }

  }

  return (
    <SiteFrame title="Навігація">
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: "var(--dark)" }}>
          {mode === "login" ? "Log in" : "Register"}
        </div>
      </div>

      <div className="card" style={{ maxWidth: 360, margin: "0 auto", padding: 18 }}>
        {mode === "register" && (
          <>
            <label style={{ fontSize: 12, color: "var(--muted)" }}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Value"
              style={{ width: "100%", marginTop: 6, marginBottom: 12, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6 }}
            />
          </>
        )}

        <label style={{ fontSize: 12, color: "var(--muted)" }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Value"
          style={{ width: "100%", marginTop: 6, marginBottom: 12, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6 }}
        />

        <label style={{ fontSize: 12, color: "var(--muted)" }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Value"
          style={{ width: "100%", marginTop: 6, marginBottom: 12, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6 }}
        />

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 6,
            border: "1px solid #2a2a2a",
            background: "#2a2a2a",
            color: "white",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "..." : mode === "login" ? "Sign In" : "Create account"}
        </button>

        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setMsg(null); }}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)", textDecoration: "underline" }}
          >
            {mode === "login" ? "Реєстрація" : "Вже є акаунт? Log in"}
          </button>

          {/* Admin shortcut info */}
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            Admin: <b>admin</b> / <b>12345123</b>
          </span>
        </div>

        {msg && (
          <div style={{ marginTop: 12, padding: 10, borderRadius: 6, border: "1px solid var(--border)", background: "white", color: "#a00000", fontSize: 13 }}>
            {msg}
          </div>
        )}
      </div>
    </SiteFrame>
  );
}
