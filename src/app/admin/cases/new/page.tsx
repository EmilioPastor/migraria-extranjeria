"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Tramite = {
  id: string;
  label: string;
  key: string;
  description?: string;
  active: boolean;
};

export default function NewCasePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [tramiteId, setTramiteId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [loadingTramites, setLoadingTramites] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedTramite = tramites.find(
    (t) => t.id === tramiteId
  );

  /* ===============================
     CARGAR TRÁMITES
     =============================== */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/tramites");
        const data = await res.json();
        setTramites(data);
      } catch {
        setError("Error cargando trámites");
      } finally {
        setLoadingTramites(false);
      }
    };

    load();
  }, []);

  /* ===============================
     CREAR CASO
     =============================== */
  const handleSubmit = async () => {
    setError(null);

    if (!email || !selectedTramite) {
      setError("Datos incompletos");
      return;
    }

    const payload = {
      clientEmail: email,
      tramite: selectedTramite.label,
      tramite_key: selectedTramite.key,
    };

    console.log("PAYLOAD 👉", payload);

    setLoading(true);

    try {
      const res = await fetch("/api/admin/create-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Error creando el caso");
      }

      router.push("/admin/cases");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
     =============================== */
  return (
    <section className="max-w-xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-semibold mb-2">
        Nuevo caso
      </h1>
      <p className="text-gray-600 mb-8">
        Crear cliente, caso y acceso en un solo paso
      </p>

      <div className="rounded-xl border bg-white p-6 space-y-6">
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email del cliente
          </label>
          <input
            type="email"
            className="w-full border rounded px-4 py-2"
            placeholder="cliente@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* TRÁMITE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Trámite
          </label>

          {loadingTramites ? (
            <p className="text-sm text-gray-500">
              Cargando trámites…
            </p>
          ) : (
            <select
              className="w-full border rounded px-4 py-2"
              value={tramiteId}
              onChange={(e) =>
                setTramiteId(e.target.value)
              }
            >
              <option value="">
                Selecciona un trámite
              </option>
              {tramites.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          )}

          {selectedTramite?.description && (
            <p className="mt-2 text-sm text-gray-500">
              {selectedTramite.description}
            </p>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* ACCIONES */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || loadingTramites}
            className="px-6 py-3 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Creando…" : "Crear caso"}
          </button>
        </div>
      </div>
    </section>
  );
}
