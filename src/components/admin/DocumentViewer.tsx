"use client";

import { useState } from "react";

type Doc = {
  id: string;
  document_type: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  created_at: string;
};

export default function DocumentViewer({ doc }: { doc: Doc }) {
  const [loading, setLoading] = useState(false);

  const openDocument = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/documents/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: doc.file_path }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      alert("No se pudo abrir el archivo");
    } finally {
      setLoading(false);
    }
  };

  const isPreviewable =
    doc.mime_type?.includes("pdf") ||
    doc.mime_type?.includes("image");

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="font-medium">{doc.document_type}</p>
        <p className="text-xs text-gray-500">
          {doc.file_name} ·{" "}
          {new Date(doc.created_at).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={openDocument}
        disabled={loading}
        className="px-3 py-1.5 text-sm rounded border hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Abriendo…" : isPreviewable ? "Ver" : "Descargar"}
      </button>
    </div>
  );
}
