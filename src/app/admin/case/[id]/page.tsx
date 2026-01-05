"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DocumentViewer from "@/components/admin/DocumentViewer";

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
  tramite_key: string;
  status: CaseStatus;
  created_at: string;
  client: {
    email: string | null;
  };
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
};

/* ======================================================
   PAGE
   ====================================================== */

export default function AdminCaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
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
        const caseRes = await fetch(`/api/admin/case/get?id=${id}`, {
          cache: "no-store",
        });
        const caseJson = await caseRes.json();
        setCaseData(caseJson);

        const docsRes = await fetch(
          `/api/admin/documents?caseId=${id}`,
          { cache: "no-store" }
        );
        setDocuments(await docsRes.json());

        const eventsRes = await fetch(
          `/api/admin/case/events?caseId=${id}`,
          { cache: "no-store" }
        );
        setEvents(await eventsRes.json());
      } catch (e) {
        console.error("Error cargando detalle del caso", e);
      } finally {
        setLoading(false);
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
            ? "El expediente cumple los requisitos."
            : "El expediente no cumple los requisitos actuales."),
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
    <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/cases"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Volver a casos
        </Link>

        <StatusBadge status={caseData.status} />
      </div>

      {/* ================= HERO ================= */}
      <div className="bg-white border rounded-3xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {caseData.tramite}
            </h1>

            <p className="text-sm text-gray-600 mt-2">
              Cliente:&nbsp;
              <span className="font-medium text-gray-900">
                {caseData.client?.email ?? "—"}
              </span>
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Creado el{" "}
              {new Date(caseData.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoCard label="Estado" value={labelStatus(caseData.status)} />
            <InfoCard label="Documentos" value={documents.length.toString()} />
          </div>
        </div>
      </div>

      {/* ================= GRID PRINCIPAL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= DOCUMENTOS ================= */}
        <div className="lg:col-span-2 space-y-4">
          <SectionTitle title="Documentación del cliente" />

          <div className="bg-white border rounded-2xl shadow-sm divide-y">
            {documents.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                El cliente aún no ha subido documentación.
              </div>
            ) : (
              documents.map((doc) => (
                <DocumentViewer key={doc.id} doc={doc} />
              ))
            )}
          </div>
        </div>

        {/* ================= DECISIÓN ================= */}
        <div className="space-y-4">
          <SectionTitle title="Decisión del expediente" />

          <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-4">
            <textarea
              className="w-full border rounded-lg p-3 text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Mensaje interno para el cliente"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <button
                disabled={saving}
                onClick={() => updateStatus("favorable")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Marcar como favorable
              </button>

              <button
                disabled={saving}
                onClick={() => updateStatus("not_favorable")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Marcar como no favorable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HISTORIAL ================= */}
      <div className="space-y-4">
        <SectionTitle title="Historial del expediente" />

        <div className="bg-white border rounded-2xl shadow-sm divide-y">
          {events.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              Sin eventos registrados.
            </div>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="p-6 flex gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-600" />
                <div>
                  <p className="text-sm font-medium">
                    {humanEvent(ev.type)}
                  </p>
                  {ev.description && (
                    <p className="text-sm text-gray-600 mt-1">
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
   COMPONENTES UI
   ====================================================== */

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold tracking-tight">
      {title}
    </h2>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: CaseStatus }) {
  const styles: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700",
    in_review: "bg-yellow-100 text-yellow-700",
    favorable: "bg-green-100 text-green-700",
    not_favorable: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {labelStatus(status)}
    </span>
  );
}

function labelStatus(status: CaseStatus) {
  const map: Record<string, string> = {
    pending: "Pendiente",
    in_review: "En revisión",
    favorable: "Favorable",
    not_favorable: "No favorable",
  };

  return map[status];
}

function humanEvent(type: string) {
  const map: Record<string, string> = {
    CASE_CREATED: "Caso creado",
    DOCUMENT_UPLOADED: "Documento añadido",
    STATUS_CHANGED: "Cambio de estado",
  };

  return map[type] ?? type;
}
