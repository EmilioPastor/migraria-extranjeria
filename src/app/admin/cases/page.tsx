export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import LogoutButton from "./LogoutButton";

/* ======================================================
   TIPOS (FORMA REAL DE SUPABASE)
   ====================================================== */

type CaseStatus =
  | "pending"
  | "in_review"
  | "favorable"
  | "not_favorable";

type CaseRow = {
  id: string;
  tramite: string;
  status: CaseStatus;
  updated_at: string;
  clients?: {
  email?: string | null;
} | null;
 // 👈 OBJETO, NO ARRAY
};

/* ======================================================
   PAGE
   ====================================================== */

export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    status?: CaseStatus;
  };
}) {
  const supabase = supabaseAdmin();

  const q = searchParams.q?.trim();
  const status = searchParams.status;

  let query = supabase
    .from("cases")
    .select(`
      id,
      tramite,
      status,
      updated_at,
      clients (
        email
      )
    `)
    .order("updated_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  // ⚠️ IMPORTANTE:
  // el filtro por email se hace DESPUÉS, no con ilike SQL,
  // porque la relación viene como objeto
  const { data, error } = await query;

  if (error) {
    console.error("Error cargando casos:", error);
  }

  let cases: CaseRow[] = (data ?? []) as CaseRow[];

  if (q) {
    cases = cases.filter(c =>
      c.clients?.email?.toLowerCase().includes(q.toLowerCase())
    );
  }

  /* KPIs */
  const total = cases.length;
  const pending = cases.filter(c => c.status === "pending").length;
  const inReview = cases.filter(c => c.status === "in_review").length;

  return (
    <section className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Casos</h1>
            <p className="text-sm text-gray-500">
              Gestión de expedientes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-sm">
              Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ACTION BAR */}
        <div className="flex justify-between items-center">
          <Link
            href="/admin/cases/new"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            + Nuevo caso
          </Link>

          <form className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar por email…"
              className="border rounded px-4 py-2 text-sm"
            />
            <select
              name="status"
              defaultValue={status ?? ""}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="in_review">En revisión</option>
              <option value="favorable">Favorable</option>
              <option value="not_favorable">No favorable</option>
            </select>
            <button className="px-4 py-2 bg-gray-900 text-white rounded text-sm">
              Filtrar
            </button>
          </form>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard label="Casos totales" value={total} />
          <SummaryCard label="Pendientes" value={pending} tone="info" />
          <SummaryCard label="En revisión" value={inReview} tone="warning" />
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Trámite</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Actualizado</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>

            <tbody>
              {cases.length ? (
                cases.map(c => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      {c.clients?.email ?? "Cliente sin email"}
                    </td>
                    <td className="px-6 py-4">{c.tramite}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(c.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/case/${c.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Abrir →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-500">
                    No hay resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: CaseStatus }) {
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
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
