"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, 
  PlusCircleIcon, 
  UserCircleIcon,
  DocumentTextIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

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
      setError("Por favor, completa todos los campos requeridos");
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
     UI MEJORADA
     =============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <PlusCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Nuevo Expediente
                  </h1>
                  <p className="text-blue-200 text-sm mt-1">
                    Creación completa • Cliente + Caso + Acceso
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Volver
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Formulario principal */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Header del formulario */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
            <h2 className="text-xl font-bold text-gray-800">
              Información del Cliente y Trámite
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Completa los datos para crear un nuevo expediente automáticamente
            </p>
          </div>

          <div className="px-8 py-8 space-y-8">
            {/* Sección Email */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <label className="block text-base font-semibold text-gray-700">
                  Email del Cliente
                </label>
              </div>
              
              <div className="pl-12">
                <p className="text-sm text-gray-500 mb-3">
                  El cliente recibirá acceso al portal con este email
                </p>
                <div className="relative max-w-md">
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-xl px-5 py-3.5 pl-12 focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    placeholder="ejemplo@cliente.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <UserCircleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Sección Trámite */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <label className="block text-base font-semibold text-gray-700">
                  Seleccionar Trámite
                </label>
              </div>
              
              <div className="pl-12">
                {loadingTramites ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-500">
                      Cargando trámites disponibles...
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-3">
                      Selecciona el tipo de trámite para este expediente
                    </p>
                    <div className="relative max-w-md">
                      <select
                        className="w-full border border-gray-300 rounded-xl px-5 py-3.5 focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white transition-all duration-200"
                        value={tramiteId}
                        onChange={(e) => setTramiteId(e.target.value)}
                      >
                        <option value="">
                          — Selecciona un trámite —
                        </option>
                        {tramites.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {selectedTramite?.description && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-sm text-blue-700">
                          {selectedTramite.description}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="pl-12">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Resumen y acciones */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Resumen de creación</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${email ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={email ? 'text-gray-700' : 'text-gray-400'}>
                        {email || 'Email del cliente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedTramite ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={selectedTramite ? 'text-gray-700' : 'text-gray-400'}>
                        {selectedTramite?.label || 'Trámite seleccionado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Cancelar
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading || loadingTramites || !email || !selectedTramite}
                    className={`
                      px-8 py-3 rounded-xl font-medium transition-all duration-200 
                      flex items-center gap-2
                      ${!email || !selectedTramite
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Creando expediente...
                      </>
                    ) : (
                      <>
                        <PlusCircleIcon className="h-5 w-5" />
                        Crear Expediente
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCircleIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Cliente Nuevo</h3>
            </div>
            <p className="text-sm text-gray-600">
              Si el email no existe, se creará automáticamente un nuevo cliente con acceso al portal.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Expediente Único</h3>
            </div>
            <p className="text-sm text-gray-600">
              Cada expediente tiene un ID único y un espacio dedicado para documentos y seguimiento.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">Acceso Seguro</h3>
            </div>
            <p className="text-sm text-gray-600">
              El cliente recibirá credenciales seguras para acceder a su expediente personal.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}