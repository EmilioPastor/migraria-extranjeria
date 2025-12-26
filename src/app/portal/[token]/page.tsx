"use client";

import { useEffect, useState } from "react";
import DocumentUploadMock from "@/components/DocumentUploadMock";

type CaseStatus = "in_review" | "favorable" | "not_favorable";

type CaseData = {
  tramite: string;
  status: CaseStatus;
  message?: string;
};

function parseCaseData(raw: string | null): CaseData {
  if (!raw) {
    return {
      tramite: "Arraigo social",
      status: "in_review",
    };
  }

  const parsed = JSON.parse(raw);

  // Normalización defensiva
  const status: CaseStatus =
    parsed.status === "favorable" || parsed.status === "not_favorable"
      ? parsed.status
      : "in_review";

  return {
    tramite: parsed.tramite ?? "Arraigo social",
    status,
    message: parsed.message,
  };
}

export default function PortalPage() {
  const [ready, setReady] = useState(false);
  const [docsComplete, setDocsComplete] = useState(false);
  const [caseData, setCaseData] = useState<CaseData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("migraria-demo-case");
    setCaseData(parseCaseData(stored));
    setReady(true);
  }, []);

  if (!ready || !caseData) return null;

  const submitForReview = () => {
    const updated: CaseData = {
      ...caseData,
      status: "in_review",
    };

    localStorage.setItem("migraria-demo-case", JSON.stringify(updated));
    setCaseData(updated);
    alert("Documentación enviada a evaluación");
  };

  return (
    <section className="max-w-3xl mx-auto py-20 px-6 space-y-10">
      <div>
        <h1 className="text-3xl font-semibold mb-2">
          Evaluación preliminar
        </h1>
        <p className="text-gray-600">
          Trámite: <strong>{caseData.tramite}</strong>
        </p>
      </div>

      {/* DOCUMENTOS SOLO SI NO HAY RESULTADO */}
      {caseData.status === "in_review" && !docsComplete && (
        <>
          <h2 className="text-xl font-semibold">
            Documentación requerida
          </h2>

          <DocumentUploadMock
            tramite={caseData.tramite}
            onComplete={() => setDocsComplete(true)}
          />
        </>
      )}

      {docsComplete && caseData.status === "in_review" && (
        <button
          onClick={submitForReview}
          className="px-6 py-3 bg-[var(--primary)] text-white rounded"
        >
          Enviar a evaluación
        </button>
      )}

      {caseData.status === "favorable" && (
        <div className="text-green-700">
          <p className="font-semibold mb-2">
            Evaluación favorable
          </p>
          <p>{caseData.message}</p>
        </div>
      )}

      {caseData.status === "not_favorable" && (
        <div className="text-red-700">
          <p className="font-semibold mb-2">
            Evaluación no favorable
          </p>
          <p>{caseData.message}</p>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Esta evaluación es orientativa y no vinculante.
      </p>
    </section>
  );
}
