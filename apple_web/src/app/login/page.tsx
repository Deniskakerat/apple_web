"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const router = useRouter();

  async function submit() {
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) router.push("/");
    else alert("Помилка авторизації");
  }

  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <h1>{mode === "login" ? "Вхід" : "Реєстрація"}</h1>

      {mode === "register" && (
        <input placeholder="Імʼя" value={name} onChange={e => setName(e.target.value)} />
      )}

      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />

      <button onClick={submit} style={{ width: "100%", marginTop: 10 }}>
        {mode === "login" ? "Увійти" : "Зареєструватись"}
      </button>

      <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ marginTop: 10 }}>
        {mode === "login" ? "Створити акаунт" : "Вже є акаунт"}
      </button>
    </div>
  );
}
