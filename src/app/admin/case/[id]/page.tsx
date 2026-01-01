"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Document = {
  id: string;
  document_type: string;
};

type CaseData = {
  id: string;
  tramite: string;
  status: "in_review" | "favorable" | "not_favorable";
};

export default function AdminCasePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ======================================================
     CARGA INICIAL
     ====================================================== */
  useEffect(() => {
    const load = async () => {
      const caseRes = await fetch(`/api/admin/case/get?id=${id}`);
      const caseJson = await caseRes.json();
      setCaseData(caseJson);

      const docsRes = await fetch(
        `/api/admin/documents?caseId=${id}`
      );
      const docsJson = await docsRes.json();
      setDocuments(docsJson);

      setLoading(false);
    };

    load();
  }, [id]);

  /* ======================================================
     GUARDAR DECISIÓN
     ====================================================== */
  const saveCase = async (
    status: "favorable" | "not_favorable"
  ) => {
    setSaving(true);

    await fetch("/api/admin/case/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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

    setSaving(false);
    router.push("/admin/cases");
  };

  if (loading || !caseData) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 space-y-12">

      {/* ======================================================
         HEADER · IDENTIDAD DEL CASO
         ====================================================== */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Evaluación del caso
          </h1>
          <p className="text-gray-500 mt-1">
            {caseData.tramite}
          </p>
        </div>

        <StatusPill status={caseData.status} />
      </header>

      {/* ======================================================
         BLOQUE DOCUMENTOS
         ====================================================== */}
      <section className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Documentación aportada
        </h2>

        {documents.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <DocumentIcon />
                  <span className="font-medium">
                    {humanize(doc.document_type)}
                  </span>
                </div>

                <a
                  href={`/api/documents/${doc.id}/download`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Descargar →
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ======================================================
         MENSAJE AL CLIENTE
         ====================================================== */}
      <section className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-2">
          Mensaje para el cliente
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Este mensaje se mostrará en el área privada del cliente.
        </p>

        <textarea
          className="w-full border rounded-lg p-4 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Redacta aquí un mensaje claro y orientativo para el cliente…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </section>

      {/* ======================================================
         ACCIONES FINALES
         ====================================================== */}
      <section className="flex items-center justify-between bg-gray-50 border rounded-xl p-6">
        <button
          onClick={() => router.push("/admin/cases")}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver a casos
        </button>

        <div className="flex gap-4">
          <button
            disabled={saving}
            onClick={() => saveCase("not_favorable")}
            className="px-6 py-3 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition"
          >
            No favorable
          </button>

          <button
            disabled={saving}
            onClick={() => saveCase("favorable")}
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Marcar como favorable
          </button>
        </div>
      </section>
    </section>
  );
}

/* ======================================================
   COMPONENTES AUXILIARES
   ====================================================== */

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    in_review: "bg-yellow-100 text-yellow-800",
    favorable: "bg-green-100 text-green-800",
    not_favorable: "bg-red-100 text-red-800",
  };

  const labels: Record<string, string> = {
    in_review: "En revisión",
    favorable: "Favorable",
    not_favorable: "No favorable",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
        styles[status]
      }`}
    >
      {labels[status]}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed rounded-lg p-8 text-center text-gray-500">
      El cliente aún no ha subido documentación.
    </div>
  );
}

function DocumentIcon() {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
      📄
    </span>
  );
}

function humanize(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
