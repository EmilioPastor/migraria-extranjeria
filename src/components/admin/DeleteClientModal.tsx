"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Props = {
  open: boolean;
  onClose: () => void;
  caseId: string;
  onDeleted: () => void;
};

export default function DeleteClientModal({
  open,
  onClose,
  caseId,
  onDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Cliente Supabase correcto (frontend)
      const supabase = supabaseBrowser();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Sesión no válida");
      }

      const res = await fetch("/api/admin/client/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ caseId }),
      });

      const json: { error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Error al eliminar");
      }

      onDeleted();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-red-700 mb-4">
          Eliminar cliente
        </h2>

        <p className="text-gray-700">
          Esta acción <strong>eliminará definitivamente</strong>:
        </p>

        <ul className="list-disc ml-6 my-3 text-gray-700">
          <li>El expediente</li>
          <li>El cliente</li>
          <li>Todos los datos asociados</li>
        </ul>

        <p className="text-sm text-gray-500">
          Esta acción no se puede deshacer.
        </p>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border"
          >
            Cancelar
          </button>

          <button
            onClick={confirmDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar definitivamente"}
          </button>
        </div>
      </div>
    </div>
  );
}
