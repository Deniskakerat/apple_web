"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  const router = useRouter();
  const sp = useSearchParams();
  const nextUrl = sp.get("next") || "/";

async function submit() {
  const res = await fetch(`/api/auth/${mode}`, {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    alert(data?.error ?? `Помилка: ${res.status}`);
    return;
  }

const nextUrl = sp.get("next") || "/";

// не дозволяємо редірект у /login або /api
const safeNext =
  nextUrl.startsWith("/login") || nextUrl.startsWith("/api")
    ? "/"
    : nextUrl;

router.replace(safeNext);
router.refresh();

}

  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <h1>{mode === "login" ? "Вхід" : "Реєстрація"}</h1>

      {mode === "register" && (
        <input
          placeholder="Імʼя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={submit} style={{ width: "100%", marginTop: 10 }}>
        {mode === "login" ? "Увійти" : "Зареєструватись"}
      </button>

      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        style={{ marginTop: 10 }}
      >
        {mode === "login" ? "Створити акаунт" : "Вже є акаунт"}
      </button>
    </div>
  );
}
