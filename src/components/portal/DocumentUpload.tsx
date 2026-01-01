"use client";

import { useEffect, useState } from "react";
import { documentosPorTramite } from "@/data/documentos";

type Documento = {
  id: string;
  label: string;
  required: boolean;
};

type TramiteKey = keyof typeof documentosPorTramite;

type Props = {
  caseId: string;
  tramite: string;
  token: string;
};

export default function DocumentUpload({
  caseId,
  tramite,
}: Props) {
  const tramiteKey = tramite
    .toLowerCase()
    .replace(/\s+/g, "_")
    .trim() as TramiteKey;

  const documentos: Documento[] =
    documentosPorTramite[tramiteKey] ?? [];

  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  /* ===============================
     CARGAR DOCUMENTOS YA SUBIDOS
     =============================== */
  useEffect(() => {
    fetch(`/api/portal/documents?caseId=${caseId}`)
      .then((r) => r.json())
      .then((docs) => {
        const map: Record<string, boolean> = {};
        docs.forEach((d: { document_type: string }) => {
          map[d.document_type] = true;
        });
        setUploaded(map);
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  /* ===============================
     SUBIDA REAL DE ARCHIVO
     =============================== */
  const handleUpload = async (
    documentType: string,
    file?: File
  ) => {
    if (!file) return;

    setUploading(documentType);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caseId", caseId);
    formData.append("documentType", documentType);

    const res = await fetch("/api/portal/upload-file", {
      method: "POST",
      body: formData,
    });

    setUploading(null);

    if (!res.ok) {
      alert("Error subiendo el archivo");
      return;
    }

    setUploaded((prev) => ({
      ...prev,
      [documentType]: true,
    }));
  };

  /* ===============================
     ESTADOS
     =============================== */
  if (loading) {
    return <p className="text-gray-500">Cargando documentos…</p>;
  }

  if (documentos.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-red-50 text-red-700">
        No hay documentos configurados para este trámite.
      </div>
    );
  }

  /* ===============================
     RENDER
     =============================== */
  return (
    <div className="space-y-6">
      {documentos.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between border p-4 rounded"
        >
          <div>
            <p className="font-medium">{doc.label}</p>
            <p className="text-sm text-gray-500">
              {doc.required ? "Obligatorio" : "Opcional"}
            </p>
          </div>

          {uploaded[doc.id] ? (
            <span className="text-green-600 font-semibold">
              Subido
            </span>
          ) : (
            <label className="px-4 py-2 border rounded cursor-pointer hover:bg-gray-50">
              {uploading === doc.id
                ? "Subiendo…"
                : "Subir archivo"}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) =>
                  handleUpload(doc.id, e.target.files?.[0])
                }
              />
            </label>
          )}
        </div>
      ))}
    </div>
  );
}
