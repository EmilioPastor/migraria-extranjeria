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

  const upload = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("caseId", caseId);
    form.append("token", token);
    form.append("documentType", "general");

    await fetch("/api/document/upload", {
      method: "POST",
      body: form,
    });

    setDone(true);
  };

  return (
    <div className="mt-6 space-y-4">
      <p>
        Sube la documentación para el trámite de{" "}
        <strong>{tramite}</strong>
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
            className="px-6 py-2 bg-[var(--primary)] text-white rounded"
          >
            Subir documento
          </button>
        </>
      ) : (
        <p className="text-green-700">
          ✔ Documento enviado correctamente
        </p>
      )}
    </div>
  );
}
