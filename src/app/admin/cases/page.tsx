export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import LogoutButton from "./LogoutButton";

/* ======================================================
   TIPOS
   ====================================================== */

type CaseRow = {
  id: string;
  tramite: string;
  status: "pending" | "in_review" | "favorable" | "not_favorable";
  updated_at: string;
  client: {
    email: string | null;
  }[]; // 👈 SIEMPRE array en Supabase
};

/* ======================================================
   PAGE
   ====================================================== */

export default async function AdminCasesPage() {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("cases")
    .select(`
      id,
      tramite,
      status,
      updated_at,
      client:profiles(email)
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error cargando casos:", error);
  }

  const cases: CaseRow[] = data ?? [];

  /* KPIs */
  const total = cases.length;
  const pending = cases.filter(c => c.status === "pending").length;
  const inReview = cases.filter(c => c.status === "in_review").length;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Casos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Control completo de expedientes activos
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <LogoutButton />
        </div>
      </header>
      <Link
        href="/admin/cases/new"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
      >
        + Nuevo caso
      </Link>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Casos totales" value={total} />
        <SummaryCard label="Pendientes de documentación" value={pending} tone="info" />
        <SummaryCard label="En revisión" value={inReview} tone="warning" />
      </div>

      {/* TABLA */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">Listado de casos</h2>
          <span className="text-sm text-gray-500">
            Última actualización primero
          </span>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Trámite</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Actualizado</th>
              <th className="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>

          <tbody>
            {cases.length > 0 ? (
              cases.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {c.client[0]?.email ?? "Cliente sin email"}
                  </td>

                  <td className="px-6 py-4">
                    {c.tramite}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={c.status} />
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(c.updated_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/case/${c.id}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Revisar →
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No hay casos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ======================================================
   UI
   ====================================================== */

function SummaryCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "info" | "warning";
}) {
  const tones: Record<string, string> = {
    neutral: "border-gray-200",
    info: "border-blue-300",
    warning: "border-yellow-300",
  };

  return (
    <div className={`border rounded-lg p-5 bg-white ${tones[tone]}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: CaseRow["status"] }) {
  const styles: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700",
    in_review: "bg-yellow-100 text-yellow-700",
    favorable: "bg-green-100 text-green-700",
    not_favorable: "bg-red-100 text-red-700",
  };

  const labels: Record<string, string> = {
    pending: "Pendiente",
    in_review: "En revisión",
    favorable: "Favorable",
    not_favorable: "No favorable",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
