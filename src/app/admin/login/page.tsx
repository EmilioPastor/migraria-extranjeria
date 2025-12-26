"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error");
      return;
    }

    if (data.twoFactorRequired) {
      setStep("2fa");
      return;
    }

    window.location.href = "/admin";
  };

  const verify = async () => {
    setError("");
    const res = await fetch("/api/admin/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error");
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm border p-6 rounded space-y-4">
        <h1 className="text-xl font-semibold">Acceso interno</h1>

        {step === "login" && (
          <>
            <input
              className="w-full border p-2"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full border p-2"
              type="password"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={login}
              className="w-full bg-[var(--primary)] text-white py-2 rounded"
            >
              Entrar
            </button>
          </>
        )}

        {step === "2fa" && (
          <>
            <p className="text-sm text-gray-600">
              Introduce el código enviado a tu email
            </p>
            <input
              className="w-full border p-2"
              placeholder="Código 2FA"
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={verify}
              className="w-full bg-[var(--primary)] text-white py-2 rounded"
            >
              Verificar
            </button>
          </>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </section>
  );
}
