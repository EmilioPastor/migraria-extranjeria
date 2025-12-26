"use client";

import { useEffect, useState } from "react";
import PortalLayout from "@/components/portal/PortalLayout";
import CaseSteps from "@/components/portal/CaseSteps";
import CaseStatus from "@/components/portal/CaseStatus";
import DocumentUploadMock from "@/components/portal/DocumentUploadMock";

type CaseStatusType =
  | "in_review"
  | "favorable"
  | "not_favorable";

type CaseData = {
  tramite: string;
  status: CaseStatusType;
  message?: string;
};

export default function PortalPage() {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [docsComplete, setDocsComplete] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("migraria-demo-case");

    if (raw) {
      setCaseData(JSON.parse(raw));
    } else {
      setCaseData({
        tramite: "Arraigo social",
        status: "in_review",
      });
    }
  }, []);

  if (!caseData) return null;

  const step =
    caseData.status === "in_review" && !docsComplete
      ? 1
      : caseData.status === "in_review"
      ? 2
      : 3;

  return (
    <PortalLayout
      title="Área privada del cliente"
      statusLabel={caseData.status}
    >
      <CaseSteps step={step} />

      <CaseStatus status={caseData.status} />

      {caseData.status === "in_review" && !docsComplete && (
        <DocumentUploadMock
          tramite={caseData.tramite}
          onComplete={() => setDocsComplete(true)}
        />
      )}

      {caseData.status === "favorable" && (
        <p className="mt-6 text-green-700">
          Puedes solicitar cita para continuar el trámite.
        </p>
      )}

      {caseData.status === "not_favorable" && (
        <p className="mt-6 text-red-700">
          Te recomendamos solicitar asesoramiento personalizado.
        </p>
      )}
    </PortalLayout>
  );
}
