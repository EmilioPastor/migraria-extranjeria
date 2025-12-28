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

type ApiError = {
  error: string;
};

export default function PortalPage() {
  const { token } = useParams<{ token: string }>();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/portal/case?token=${token}`)
      .then(async (r) => {
        if (!r.ok) {
          const err = (await r.json()) as ApiError;
          throw new Error(err?.error || "Token inválido");
        }
        return r.json();
      })
      .then((data: CaseData) => {
        setCaseData(data);
        setError(null);
      })
      .catch((err) => {
        setCaseData(null);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  /* ---------- ESTADOS DE CARGA / ERROR ---------- */

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Cargando información del caso…
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="p-10 text-center text-red-600">
        Enlace no válido, expirado o ya utilizado.
      </div>
    );
  }

  /* ---------- UI NORMAL ---------- */

  const step = caseData.status === "in_review" ? 2 : 3;

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
          token={token}
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
