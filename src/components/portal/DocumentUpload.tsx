"use client";

import { useState } from "react";

export default function DocumentUpload({
  caseId,
  token,
  tramite,
}: {
  caseId: string;
  token: string;
  tramite: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return;

    setLoading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("caseId", caseId);
    form.append("token", token);
    form.append("documentType", "general");

    await fetch("/api/document/upload", {
      method: "POST",
      body: form,
    });

    setLoading(false);
    setDone(true);
  };

  return (
    <div className="mt-8 space-y-4">
      <p className="text-sm text-gray-700">
        Sube la documentación necesaria para el trámite de{" "}
        <strong>{tramite}</strong>.
      </p>

      <p className="text-xs text-gray-500">
        Los documentos se tratan de forma confidencial conforme a la normativa vigente.
      </p>

      {!done ? (
        <>
          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <button
            onClick={upload}
            disabled={loading}
            className="px-6 py-2 bg-[var(--primary)] text-white rounded disabled:opacity-60"
          >
            {loading ? "Subiendo..." : "Enviar documento"}
          </button>
        </>
      ) : (
        <p className="text-green-700 text-sm">
          ✔ Documento enviado correctamente
        </p>
      )}
    </div>
  );
}
