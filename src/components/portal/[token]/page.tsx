"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PortalLayout from "@/components/portal/PortalLayout";
import CaseSteps from "@/components/portal/CaseSteps";
import DocumentUpload from "@/components/portal/DocumentUpload";
import NextSteps from "@/components/portal/NextSteps";
import PortalCTA from "@/components/portal/PortalCTA";
import CaseStatus from "@/components/portal/CaseStatus";

type CaseData = {
  id: string;
  tramite: string;
  tramite_key: string;
  status: "pending" | "in_review" | "favorable" | "not_favorable";
  message?: string;
};
type CaseStatusType =
  | "pending"
  | "in_review"
  | "favorable"
  | "not_favorable";


export default function PortalPage() {
  const { token } = useParams();
  const [caseData, setCaseData] = useState<CaseData | null>(null);

  useEffect(() => {
    fetch(`/api/portal/case?token=${token}`)
      .then((r) => r.json())
      .then(setCaseData);
  }, [token]);

  if (!caseData) return null;

  const step =
    caseData.status === "pending"
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

      {caseData.status === "pending" && caseData.tramite_key && (
        <DocumentUpload
          caseId={caseData.id}
          token={token as string}
          tramite={caseData.tramite_key}
        />
      )}


      {caseData.message && (
        <div className="mt-6 text-sm text-gray-700">
          <strong>Mensaje del equipo legal:</strong>
          <p className="mt-1">{caseData.message}</p>
        </div>
      )}

      <NextSteps status={caseData.status} />

      {(caseData.status === "favorable" ||
        caseData.status === "not_favorable") && (
          <PortalCTA status={caseData.status} />
        )}
    </PortalLayout>
  );
}
