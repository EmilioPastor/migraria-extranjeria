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
  const { id } = useParams();
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  /* 🔹 CARGAR CASO + DOCUMENTOS */
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

  const saveCase = async (
    status: "favorable" | "not_favorable"
  ) => {
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

    alert("Caso actualizado correctamente");
    router.push("/admin/cases");
  };

  if (loading || !caseData) return null;

  return (
    <section className="max-w-5xl mx-auto py-20 px-6 space-y-10">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-semibold">
          Evaluar caso – {caseData.tramite}
        </h1>
        <p className="text-gray-600">
          Estado actual: {caseData.status}
        </p>
      </header>

      {/* DOCUMENTOS */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">
          Documentación aportada
        </h2>

        {documents.length === 0 && (
          <p className="text-sm text-gray-500">
            El cliente aún no ha subido documentos.
          </p>
        )}

        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between border p-4 rounded"
          >
            <span>{doc.document_type}</span>

            <a
              href={`/api/documents/${doc.id}/download`}
              className="text-blue-600 underline"
            >
              Descargar
            </a>
          </div>
        ))}
      </div>

      {/* MENSAJE */}
      <div>
        <h2 className="text-lg font-medium mb-2">
          Mensaje para el cliente
        </h2>

        <textarea
          className="w-full border p-4 min-h-[120px]"
          placeholder="Mensaje orientativo que verá el cliente en su portal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* ACCIONES */}
      <div className="flex gap-4">
        <button
          onClick={() => saveCase("favorable")}
          className="px-6 py-3 bg-green-600 text-white rounded"
        >
          Marcar como favorable
        </button>

        <button
          onClick={() => saveCase("not_favorable")}
          className="px-6 py-3 bg-red-600 text-white rounded"
        >
          Marcar como no favorable
        </button>
      </div>
    </section>
  );
}
