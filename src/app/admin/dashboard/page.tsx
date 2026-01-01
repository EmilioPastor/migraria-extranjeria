import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";

/* ======================================================
   DASHBOARD ADMIN — ERP LEGAL
   ====================================================== */

export default async function AdminDashboardPage() {
  const supabase = supabaseAdmin();

  /* ===============================
     KPIs
     =============================== */
  const [
    { count: activeCases },
    { count: pendingDocs },
    { count: inReview },
    { count: favorable },
    { count: notFavorable },
  ] = await Promise.all([
    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "in_review"]),

    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_review"),

    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .eq("status", "favorable"),

    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .eq("status", "not_favorable"),
  ]);

  /* ===============================
     CASOS PRIORITARIOS
     =============================== */
  const { data: priorityCases } = await supabase
    .from("cases")
    .select("id, tramite, status, updated_at, client_email")
    .eq("status", "in_review")
    .order("updated_at", { ascending: true })
    .limit(10);

  /* ===============================
     NOTIFICACIONES
     =============================== */
  const { data: notifications } = await supabase
    .from("admin_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  /* ===============================
     ACTIVIDAD RECIENTE
     =============================== */
  const { data: activity } = await supabase
    .from("admin_actions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* ======================================================
         HEADER
         ====================================================== */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Panel de control
        </h1>

        <Link
          href="/admin/cases"
          className="text-sm text-blue-600 hover:underline"
        >
          Ver todos los casos →
        </Link>
      </header>

      {/* ======================================================
         KPIs
         ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard title="Casos activos" value={activeCases ?? 0} />
        <KpiCard title="Pendientes docs" value={pendingDocs ?? 0} />
        <KpiCard title="En revisión" value={inReview ?? 0} highlight />
        <KpiCard title="Favorables" value={favorable ?? 0} />
        <KpiCard title="No favorables" value={notFavorable ?? 0} />
      </div>

      {/* ======================================================
         CASOS + NOTIFICACIONES
         ====================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* -------- CASOS PRIORITARIOS -------- */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Casos que requieren acción
          </h2>

          <div className="border rounded-lg overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Trámite</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Última act.</th>
                  <th className="p-3"></th>
                </tr>
              </thead>

              <tbody>
                {priorityCases?.length ? (
                  priorityCases.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="p-3">
                        {c.client_email ?? "—"}
                      </td>
                      <td className="p-3">{c.tramite}</td>
                      <td className="p-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="p-3">
                        {new Date(c.updated_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/admin/case/${c.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Revisar →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500"
                    >
                      No hay casos pendientes de revisión
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* -------- NOTIFICACIONES -------- */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Alertas
          </h2>

          <div className="space-y-3">
            {notifications?.length ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`border rounded p-4 text-sm ${
                    n.read
                      ? "bg-gray-50"
                      : "bg-yellow-50 border-yellow-300"
                  }`}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-gray-600">
                    {n.message}
                  </p>

                  {n.case_id && (
                    <Link
                      href={`/admin/case/${n.case_id}`}
                      className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                    >
                      Ver caso →
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                Sin notificaciones
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================
         ACTIVIDAD RECIENTE
         ====================================================== */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Actividad reciente
        </h2>

        <div className="border rounded-lg bg-white divide-y">
          {activity?.length ? (
            activity.map((a) => (
              <div key={a.id} className="p-4 text-sm">
                <p className="font-medium">
                  {a.action}
                </p>
                <p className="text-gray-500">
                  {new Date(a.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="p-6 text-gray-500 text-sm">
              Sin actividad reciente
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   COMPONENTES AUXILIARES
   ====================================================== */

function KpiCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border rounded-lg p-5 bg-white ${
        highlight ? "border-yellow-400" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700",
    in_review: "bg-yellow-100 text-yellow-700",
    favorable: "bg-green-100 text-green-700",
    not_favorable: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        map[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
