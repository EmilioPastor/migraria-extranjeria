"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PortalLayout from "@/components/portal/PortalLayout";
import CaseSteps from "@/components/portal/CaseSteps";
import CaseStatus from "@/components/portal/CaseStatus";
import DocumentUpload from "@/components/portal/DocumentUpload";

/* ===============================
   TIPOS
   =============================== */

export type CaseStatusType =
  | "pending"
  | "in_review"
  | "favorable"
  | "not_favorable";

type CaseData = {
  id: string;
  tramite: string;        // Nombre visible
  tramite_key: string;    // Clave lógica (CRÍTICA)
  status: CaseStatusType;
  message?: string | null;
};

type ApiError = {
  error: string;
};

/* ===============================
   COMPONENTE
   =============================== */

export default function PortalPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     CARGA DEL CASO POR TOKEN
     =============================== */
  useEffect(() => {
    if (!token) {
      setError("Token no proporcionado");
      setLoading(false);
      return;
    }

    const loadCase = async () => {
      try {
        const res = await fetch(`/api/portal/case?token=${token}`);

        if (!res.ok) {
          const err = (await res.json()) as ApiError;
          throw new Error(err?.error || "Acceso no válido");
        }

        const data = (await res.json()) as CaseData;
        setCaseData(data);
        setError(null);
      } catch (err) {
        setCaseData(null);
        setError(
          err instanceof Error
            ? err.message
            : "Error inesperado"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [token]);

  /* ===============================
     ESTADOS DE CARGA / ERROR
     =============================== */

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-500">
        Cargando información del caso…
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="py-24 text-center text-red-600">
        Enlace no válido, expirado o ya utilizado.
      </div>
    );
  }

  /* ===============================
     LÓGICA DE PASOS
     =============================== */

  const step: 1 | 2 | 3 =
    caseData.status === "pending"
      ? 1
      : caseData.status === "in_review"
      ? 2
      : 3;

  /* ===============================
     RENDER
     =============================== */

  return (
    <PortalLayout
      title="Área privada del cliente"
      statusLabel={caseData.status}
    >
      {/* PROGRESO */}
      <CaseSteps step={step} />

      {/* ESTADO ACTUAL */}
      <CaseStatus status={caseData.status} />

      {/* SUBIDA DE DOCUMENTOS */}
      {caseData.status === "pending" && (
        <DocumentUpload
          caseId={caseData.id}
          token={token}
          tramite={caseData.tramite_key}
        />
      )}

      {/* MENSAJE FINAL DEL ABOGADO */}
      {caseData.message && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5 text-gray-700">
          {caseData.message}
        </div>
      )}
    </PortalLayout>
  );
}
