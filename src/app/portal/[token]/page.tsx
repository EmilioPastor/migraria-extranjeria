"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PortalLayout from "@/components/portal/PortalLayout";
import CaseSteps from "@/components/portal/CaseSteps";
import CaseStatus from "@/components/portal/CaseStatus";
import DocumentUpload from "@/components/portal/DocumentUpload";

type CaseData = {
  id: string;
  tramite: string;
  status: "in_review" | "favorable" | "not_favorable";
  message?: string;
};

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
    caseData.status === "in_review" ? 2 : 3;

  return (
    <PortalLayout
      title="Área privada del cliente"
      statusLabel={caseData.status}
    >
      <CaseSteps step={step} />
      <CaseStatus status={caseData.status} />

      {caseData.status === "in_review" && (
        <DocumentUpload
          caseId={caseData.id}
          token={token as string}
          tramite={caseData.tramite}
        />
      )}

      {caseData.message && (
        <p className="mt-6 text-gray-700">
          {caseData.message}
        </p>
      )}
    </PortalLayout>
  );
}
