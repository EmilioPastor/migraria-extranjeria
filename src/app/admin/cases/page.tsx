"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function AdminCasesPage() {
  const router = useRouter();

  const logout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <section className="max-w-6xl mx-auto py-20 px-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          Casos en evaluación
        </h1>

        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Trámite</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">Acción</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-4">cliente@email.com</td>
              <td className="p-4">Arraigo social</td>
              <td className="p-4">En revisión</td>
              <td className="p-4">
                <Link
                  href="/admin/case/demo-case"
                  className="text-blue-600 hover:underline"
                >
                  Revisar caso →
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
