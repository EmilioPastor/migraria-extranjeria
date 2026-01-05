"use client";

import { useEffect, useState } from "react";

type RequiredDocument = {
  id: string;
  document_type: string;
};

type UploadedDocument = {
  id: string;
  document_type: string;
};

type Props = {
  caseId: string;
  token: string;
  tramite: string; // 👈 AQUÍ VA tramite_key (ej: arraigo_social)
};

export default function DocumentUpload({
  caseId,
  token,
  tramite,
}: Props) {
  const [requiredDocs, setRequiredDocs] = useState<RequiredDocument[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  /* =====================================================
     1️⃣ CARGAR DOCUMENTOS REQUERIDOS + SUBIDOS
     ===================================================== */
  useEffect(() => {
    const load = async () => {
      try {
        setError(null);

        // 🔹 Documentos requeridos según trámite
        const reqRes = await fetch(
          `/api/portal/required-documents?tramite=${tramite}`
        );
        const reqData = await reqRes.json();

        // 🔹 Documentos ya subidos
        const upRes = await fetch(
          `/api/portal/uploaded-documents?caseId=${caseId}`
        );
        const upData = await upRes.json();

        setRequiredDocs(reqData);
        setUploadedDocs(upData);
      } catch (e) {
        setError("Error cargando documentación");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [caseId, tramite]);

  /* =====================================================
     2️⃣ SUBIR DOCUMENTO
     ===================================================== */
  const handleUpload = async (
    file: File,
    documentType: string
  ) => {
    setUploading(documentType);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseId", caseId);
      formData.append("token", token);
      formData.append("documentType", documentType);

      const res = await fetch("/api/portal/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Error subiendo archivo");
      }

      // 🔹 Refrescar documentos subidos
      const upRes = await fetch(
        `/api/portal/uploaded-documents?caseId=${caseId}`
      );
      const upData = await upRes.json();
      setUploadedDocs(upData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado"
      );
    } finally {
      setUploading(null);
    }
  };

  /* =====================================================
     UI
     ===================================================== */

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Cargando documentación…
      </p>
    );
  }

  if (requiredDocs.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No hay documentos configurados para este trámite.
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">
          {error}
        </div>
      )}

      {requiredDocs.map((doc) => {
        const uploaded = uploadedDocs.some(
          (u) => u.document_type === doc.document_type
        );

        return (
          <div
            key={doc.id}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <div>
              <p className="font-medium">{doc.document_type}</p>
              <p className="text-sm text-gray-500">
                Obligatorio
              </p>
            </div>

            {uploaded ? (
              <span className="text-green-600 font-semibold">
                Subido
              </span>
            ) : (
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleUpload(
                        e.target.files[0],
                        doc.document_type
                      );
                    }
                  }}
                  disabled={uploading !== null}
                />
                <span className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">
                  {uploading === doc.document_type
                    ? "Subiendo…"
                    : "Subir archivo"}
                </span>
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
}
