"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

/* ======================================================
   TIPOS
   ====================================================== */

type CaseStatus =
  | "pending"
  | "in_review"
  | "favorable"
  | "not_favorable";

type CaseData = {
  id: string;
  tramite: string;
  status: CaseStatus;
  message: string | null;
  updated_at: string;
  clients?: {
    email?: string | null;
  } | null;
};

type DocumentRow = {
  id: string;
  document_type: string;
  file_path?: string;
  uploaded_at: string;
};

type CaseEvent = {
  id: string;
  type: string;
  description: string | null;
  created_at: string;
};

/* ======================================================
   PAGE
   ====================================================== */

export default function AdminCaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseData | null>(null);

  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState<string | null>(null);

  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ===============================
     CARGA INICIAL
     =============================== */
  useEffect(() => {
    const load = async () => {
      try {
        /* ---- CASE ---- */
        const caseRes = await fetch(`/api/admin/case/get?id=${id}`);
        const caseJson = await caseRes.json();
        setCaseData(caseJson);
        setMessage(caseJson?.message ?? "");

        /* ---- DOCUMENTS (ROBUSTO) ---- */
        setDocsLoading(true);
        setDocsError(null);

        const docsRes = await fetch(
          `/api/admin/documents?caseId=${id}`
        );
        const docsJson = await docsRes.json();

        if (!Array.isArray(docsJson)) {
          console.error("Respuesta inválida documentos:", docsJson);
          setDocuments([]);
        } else {
          setDocuments(docsJson);
        }

        setDocsLoading(false);

        /* ---- EVENTS ---- */
        const eventsRes = await fetch(
          `/api/admin/case/events?caseId=${id}`
        );
        const eventsJson = await eventsRes.json();
        setEvents(Array.isArray(eventsJson) ? eventsJson : []);
      } catch (e) {
        console.error("Error cargando detalle del caso", e);
        setDocsError("Error cargando documentación");
      } finally {
        setLoading(false);
        setDocsLoading(false);
      }
    };

    load();
  }, [id]);

  const updateStatus = async (status: CaseStatus) => {
    if (!caseData) return;

    setSaving(true);

    await fetch("/api/admin/case/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseId: id,
        status,
        message:
          message ||
          (status === "favorable"
            ? "El caso cumple los requisitos según la documentación aportada."
            : "Con la documentación actual, el trámite presenta dificultades."),
      }),
    });

    router.push("/admin/cases");
  };

  if (loading || !caseData) {
    return (
      <div className="p-20 text-center text-gray-500">
        Cargando expediente…
      </div>
    );
  }

  /* ======================================================
     UI
     ====================================================== */

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 space-y-12">

      {/* ================= HEADER ================= */}
      <header className="space-y-2">
        <Link
          href="/admin/cases"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Volver a casos
        </Link>

        <h1 className="text-3xl font-semibold">
          Caso · {caseData.tramite}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            Cliente:{" "}
            <strong>
              {caseData.clients?.email ?? "—"}
            </strong>
          </span>
          <StatusBadge status={caseData.status} />
        </div>
      </header>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= DOCUMENTOS ================= */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">
            Documentación aportada
          </h2>

          <div className="bg-white border rounded-xl divide-y">
            {docsLoading ? (
              <div className="p-6 text-sm text-gray-500">
                Cargando documentos…
              </div>
            ) : docsError ? (
              <div className="p-6 text-sm text-red-600">
                {docsError}
              </div>
            ) : documents.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                El cliente aún no ha subido documentos.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {doc.document_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      Subido el{" "}
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>

                  {doc.file_path ? (
                    <button
                      onClick={async () => {
                        const res = await fetch(
                          "/api/admin/documents/signed-url",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              filePath: doc.file_path,
                            }),
                          }
                        );

                        const data = await res.json();

                        if (data?.url) {
                          window.open(data.url, "_blank");
                        } else {
                          alert("No se pudo abrir el archivo");
                        }
                      }}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Ver archivo →
                    </button>

                  ) : (
                    <span className="text-xs text-gray-400">
                      Archivo no disponible
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= DECISIÓN ================= */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Decisión del caso
          </h2>

          <div className="bg-white border rounded-xl p-4 space-y-4">
            <textarea
              className="w-full border rounded p-3 text-sm min-h-[120px]"
              placeholder="Mensaje que verá el cliente"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <button
                disabled={saving}
                onClick={() => updateStatus("favorable")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Marcar como favorable
              </button>

              <button
                disabled={saving}
                onClick={() => updateStatus("not_favorable")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Marcar como no favorable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TIMELINE ================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Historial del expediente
        </h2>

        <div className="bg-white border rounded-xl divide-y">
          {events.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              Sin eventos registrados.
            </div>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 flex gap-4"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />

                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {humanEvent(ev.type)}
                  </p>

                  {ev.description && (
                    <p className="text-sm text-gray-600">
                      {ev.description}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(ev.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   UI HELPERS
   ====================================================== */

function StatusBadge({ status }: { status: CaseStatus }) {
  const styles: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700",
    in_review: "bg-yellow-100 text-yellow-700",
    favorable: "bg-green-100 text-green-700",
    not_favorable: "bg-red-100 text-red-700",
  };

  const labels: Record<string, string> = {
    pending: "Pendiente",
    in_review: "En revisión",
    favorable: "Favorable",
    not_favorable: "No favorable",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function humanEvent(type: string) {
  const map: Record<string, string> = {
    CASE_CREATED: "Caso creado",
    DOCUMENT_UPLOADED: "Documento subido",
    STATUS_CHANGED: "Cambio de estado",
    MESSAGE_SENT: "Mensaje al cliente",
  };

  return map[type] ?? type;
}
