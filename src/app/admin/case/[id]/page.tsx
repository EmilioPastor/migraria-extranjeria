"use client";

import EditClientModal from "@/components/admin/EditClientModal";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DocumentViewer from "@/components/admin/DocumentViewer";
import DeleteClientModal from "@/components/admin/DeleteClientModal";

/* ======================================================
   TIPOS (IGUAL)
   ====================================================== */

type CaseStatus =
  | "pending"
  | "in_review"
  | "favorable"
  | "not_favorable";

type CaseData = {
  id: string;
  tramite: string;
  tramite_key: string; // ✅ AÑADIDO
  status: CaseStatus;
  message: string | null;
  client?: {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
  } | null;
  created_at?: string;
  updated_at?: string;
};

type DocumentRow = {
  id: string;
  document_type: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  uploaded_at: string;
  created_at: string;
};

type CaseEvent = {
  id: string;
  type: string;
  description: string | null;
  created_at: string;
  user_name?: string | null;
};

/* ======================================================
   PAGE (Misma lógica, mejor diseño)
   ====================================================== */

export default function AdminCaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [decision, setDecision] = useState<
    "favorable" | "not_favorable" | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===============================
     CARGA INICIAL (IGUAL)
     =============================== */
  useEffect(() => {
    const load = async () => {
      try {
        const caseRes = await fetch(`/api/admin/case/get?id=${id}`);
        const caseJson = await caseRes.json();
        setCaseData(caseJson);
        setMessage(caseJson?.message ?? "");

        const docsRes = await fetch(
          `/api/admin/documents?caseId=${id}`
        );
        setDocuments(await docsRes.json());

        const eventsRes = await fetch(
          `/api/admin/case/events?caseId=${id}`
        );
        setEvents(await eventsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ===============================
     CONFIRMAR DECISIÓN (IGUAL)
     =============================== */
  const confirmDecision = async () => {
    if (!decision || !caseData) return;

    setSaving(true);
    setError(null);

    const res = await fetch(
      "/api/admin/case/update-status",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: id,
          status: decision,
          adminEmail: "admin@migraria.es",
          message,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data?.error || "Error guardando la decisión");
      setSaving(false);
      return;
    }

    router.push("/admin/cases");
  };

  if (loading || !caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Cargando expediente</h3>
          <p className="text-gray-500">Espere un momento por favor...</p>
        </div>
      </div>
    );
  }

  /* ======================================================
     UI MEJORADA
     ====================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/admin/cases"
                  className="text-blue-200 hover:text-white text-sm font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver a casos
                </Link>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Expediente #{id.slice(-8)}
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Detalle completo del trámite • Migraria Legal
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={caseData.status} />
              <button
                onClick={() => setEditOpen(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium"
              >
                Editar
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Eliminar cliente
              </button>

            </div>
          </div>
        </div>

      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Información del Caso */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Información del Trámite</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Tipo de Trámite</p>
                  <p className="font-medium text-gray-900">{caseData.tramite}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado Actual</p>
                  <StatusBadge status={caseData.status} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Creación</p>
                  <p className="font-medium text-gray-900">
                    {caseData.created_at ? new Date(caseData.created_at).toLocaleDateString('es-ES') : 'No disponible'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Información del Cliente</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium text-gray-900">
                    {caseData.client?.name || 'No especificado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {caseData.client?.email || 'No especificado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-900">
                    {caseData.client?.phone || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>


          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documentación Aportada */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Documentación Aportada
                    </h2>
                    <p className="text-sm text-gray-500">
                      {documents.length} documento{documents.length !== 1 ? 's' : ''} subido{documents.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {documents.length} archivos
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {documents.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Sin documentación
                    </h3>
                    <p className="text-gray-500">
                      El cliente aún no ha subido documentos.
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <DocumentViewer doc={doc} />
                    </div>
                  ))
                )}
              </div>

              {documents.length > 0 && (
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar todos los documentos
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Panel de Decisión */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="text-lg font-semibold text-gray-800">
                  Resolución del Expediente
                </h2>
                <p className="text-sm text-gray-500">
                  Toma una decisión final sobre este caso
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario para el cliente
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[140px]"
                    placeholder="Escribe aquí el mensaje que recibirá el cliente con la resolución..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Este mensaje será enviado al cliente junto con la resolución.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Selecciona la resolución
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDecision("favorable")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${decision === "favorable"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                        }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg className={`w-6 h-6 ${decision === "favorable" ? 'text-emerald-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">Favorable</span>
                        <span className="text-xs opacity-70">Aprobado</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setDecision("not_favorable")}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${decision === "not_favorable"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                        }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg className={`w-6 h-6 ${decision === "not_favorable" ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">No Favorable</span>
                        <span className="text-xs opacity-70">Denegado</span>
                      </div>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}

                <button
                  disabled={!decision || saving}
                  onClick={confirmDecision}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Guardando resolución...
                    </span>
                  ) : (
                    "Confirmar Resolución Final"
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Al confirmar, el cliente recibirá una notificación con el resultado.
                </p>
              </div>
            </div>

            {/* Mini Historial */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Actividad Reciente
                </h2>
              </div>

              <div className="p-1">
                {events.slice(0, 3).length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 text-sm">Sin actividad registrada</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {events.slice(0, 3).map((ev) => (
                      <div key={ev.id} className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-2 h-2 rounded-full ${ev.type.includes('created') ? 'bg-blue-500' :
                              ev.type.includes('updated') ? 'bg-amber-500' :
                                ev.type.includes('document') ? 'bg-emerald-500' : 'bg-gray-500'
                              }`}></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{ev.type}</p>
                            {ev.description && (
                              <p className="text-sm text-gray-600 mt-1">{ev.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {ev.user_name && (
                                <span className="text-xs text-gray-500">{ev.user_name}</span>
                              )}
                              <span className="text-xs text-gray-400">
                                {new Date(ev.created_at).toLocaleString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {events.length > 3 && (
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                  <Link
                    href={`/admin/case/${id}/history`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    Ver historial completo ({events.length} eventos)
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <EditClientModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        caseId={caseData.id}
        initialEmail={caseData.client?.email || ""}
        initialTramite={caseData.tramite}
        initialTramiteKey={caseData.tramite_key}
        onUpdated={({ email, tramite }) => {
          setCaseData((prev) =>
            prev
              ? {
                ...prev,
                tramite,
                client: {
                  ...prev.client,
                  email,
                },
              }
              : prev
          );
        }}
      />
      <DeleteClientModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        caseId={caseData.id}
        onDeleted={() => {
          setDeleteOpen(false);
          window.location.href = "/admin/cases";
        }}
      />


    </div>
  );
}

/* ======================================================
   COMPONENTES AUXILIARES MEJORADOS
   ====================================================== */


function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          label: "Pendiente",
          color: "bg-blue-100 text-blue-700",
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'in_review':
        return {
          label: "En Revisión",
          color: "bg-amber-100 text-amber-700",
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )
        };
      case 'favorable':
        return {
          label: "Favorable",
          color: "bg-emerald-100 text-emerald-700",
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'not_favorable':
        return {
          label: "No Favorable",
          color: "bg-red-100 text-red-700",
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-600",
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const config = getStatusConfig();


  return (



    <span className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
      ${config.color}
    `}>
      {config.icon}
      {config.label}
    </span>
  );
}