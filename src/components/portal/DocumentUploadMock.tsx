"use client";

import { useState } from "react";

export default function DocumentUploadMock({
  tramite,
  onComplete,
}: {
  tramite: string;
  onComplete: () => void;
}) {
  const [uploaded, setUploaded] = useState(false);

  const upload = () => {
    setUploaded(true);
    setTimeout(onComplete, 800);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Sube la documentación necesaria para el trámite de{" "}
        <strong>{tramite}</strong>.
      </p>

      {!uploaded ? (
        <button
          onClick={upload}
          className="px-6 py-3 bg-[var(--primary)] text-white rounded"
        >
          Subir documentación
        </button>
      ) : (
        <p className="text-green-700">
          ✔ Documentación cargada correctamente
        </p>
      )}
    </div>
  );
}
