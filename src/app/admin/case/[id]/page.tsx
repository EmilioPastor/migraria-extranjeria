"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Document = {
  id: string;
  document_type: string;
};

export default function AdminCasePage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);

  // 🔹 MOCK: documentos del caso (luego vendrán de API real)
  useEffect(() => {
    setDocuments([
      { id: "doc-1", document_type: "Pasaporte" },
      { id: "doc-2", document_type: "Empadronamiento" },
    ]);
  }, []);

  const logout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/admin/login");
  };

  const saveCase = (status: "favorable" | "not_favorable") => {
    // ⚠️ Aún mock — se conectará a backend
    const data = {
      tramite: "Arraigo social",
      status,
      message:
        message ||
        (status === "favorable"
          ? "El caso cumple los requisitos."
          : "El caso no cumple los requisitos actualmente."),
    };

    localStorage.setItem("migraria-demo-case", JSON.stringify(data));
    alert(`Caso marcado como ${status.toUpperCase()}`);
  };

  return (
    <section className="max-w-4xl mx-auto py-20 px-6 space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Evaluar caso – Arraigo social
          </h1>
          <p className="text-gray-600">
            Documentación aportada por el cliente
          </p>
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>

      {/* 📂 DOCUMENTOS */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between border p-4 rounded"
          >
            <span>{doc.document_type}</span>

            <a
              href={`/api/documents/${doc.id}/download`}
              className="text-blue-600 underline"
            >
              Descargar
            </a>
          </div>
        ))}
      </div>

      {/* 📝 MENSAJE */}
      <textarea
        className="w-full border p-4"
        placeholder="Mensaje para el cliente"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* ⚖️ ACCIONES */}
      <div className="flex gap-4">
        <button
          onClick={() => saveCase("favorable")}
          className="px-6 py-3 bg-green-600 text-white rounded"
        >
          Favorable
        </button>

        <button
          onClick={() => saveCase("not_favorable")}
          className="px-6 py-3 bg-red-600 text-white rounded"
        >
          No favorable
        </button>
      </div>
    </section>
  );
}
