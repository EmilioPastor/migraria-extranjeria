"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCasePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [tramite, setTramite] = useState("");
  const [tramiteKey, setTramiteKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setError(null);

    if (!email || !tramite || !tramiteKey) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);

    const res = await fetch(
      "/api/admin/create-client-case",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail: email,
          tramite,
          tramite_key: tramiteKey,
        }),
      }
    );

    const json = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Error inesperado");
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/admin/cases");
    }, 1500);
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-12 space-y-8">

      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-semibold">
          Nuevo caso
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Crear cliente, caso y acceso en un solo paso
        </p>
      </header>

      {/* FORM */}
      <div className="bg-white border rounded-xl p-6 space-y-5">

        <Field
          label="Email del cliente"
          value={email}
          onChange={setEmail}
          placeholder="cliente@email.com"
        />

        <Field
          label="Trámite"
          value={tramite}
          onChange={setTramite}
          placeholder="Arraigo social"
        />

        <Field
          label="Clave interna del trámite"
          value={tramiteKey}
          onChange={setTramiteKey}
          placeholder="arraigo_social"
        />

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600">
            Acceso enviado al cliente correctamente
          </p>
        )}

        <div className="flex justify-between items-center pt-4">
          <button
            onClick={() => router.push("/admin/cases")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Cancelar
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {loading ? "Creando..." : "Crear caso"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   COMPONENTE CAMPO
   ====================================================== */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}
