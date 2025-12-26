"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      setError("Credenciales incorrectas");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm border p-6 rounded space-y-4">
        <h1 className="text-xl font-semibold">Acceso interno</h1>

        <input
          className="w-full border p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-[var(--primary)] text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Accediendo..." : "Entrar"}
        </button>

        <p className="text-xs text-gray-500">
          Acceso restringido a personal autorizado.
        </p>
      </div>
    </section>
  );
}
