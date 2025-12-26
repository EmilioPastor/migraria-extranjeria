"use client";

import { useEffect, useState } from "react";
import { documentosPorTramite } from "@/data/documentos";

type Props = {
  tramite: string;
  onComplete: () => void;
};

export default function DocumentUploadMock({
  tramite,
  onComplete,
}: Props) {
  const documentos = documentosPorTramite[tramite] || [];
  const storageKey = `docs-${tramite.toLowerCase().replace(/\s+/g, "-")}`;

  const [uploaded, setUploaded] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setUploaded(JSON.parse(saved));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(uploaded));

    const allRequiredUploaded = documentos
      .filter((d) => d.required)
      .every((d) => uploaded[d.id]);

    if (allRequiredUploaded) {
      onComplete();
    }
  }, [uploaded, documentos, onComplete, storageKey]);

  const handleUpload = (id: string) => {
    setUploaded((prev) => ({ ...prev, [id]: true }));
  };

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
            <button
              onClick={() => handleUpload(doc.id)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Subir
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
