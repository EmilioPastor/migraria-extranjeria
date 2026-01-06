export const revalidate = 0;
export const dynamic = "force-dynamic";

import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import LogoutButton from "./LogoutButton";
import ExportButtons from "./ExportButtons"; // Componente separado para los botones

/* ======================================================
   TIPOS
   ====================================================== */

type CaseRow = {
  id: string;
  tramite: string;
  tramite_key: string;
  status: "pending" | "in_review" | "favorable" | "not_favorable";
  created_at: string;
  updated_at: string;
  client_email: string | null;
};

/* ======================================================
   PAGE
   ====================================================== */

export default async function AdminCasesPage() {
  const supabase = supabaseAdmin();

  /* 1️⃣ CASOS */
  const { data: casesRaw, error: casesError } = await supabase
    .from("cases")
    .select("id, tramite, tramite_key, status, created_at, updated_at, client_id")
    .order("created_at", { ascending: false });

  if (casesError) {
    console.error("Error cargando casos:", casesError);
  }

  const cases = casesRaw ?? [];

  /* 2️⃣ CLIENTES */
  const clientIds = Array.from(
    new Set(cases.map(c => c.client_id).filter(Boolean))
  );

  const clientsMap = new Map<string, string | null>();

  if (clientIds.length > 0) {
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("id, email")
      .in("id", clientIds);

    if (clientsError) {
      console.error("Error cargando clientes:", clientsError);
    }

    clients?.forEach(c => {
      clientsMap.set(c.id, c.email);
    });
  }

  /* 3️⃣ MERGE FINAL */
  const rows: CaseRow[] = cases.map(c => ({
    id: c.id,
    tramite: c.tramite,
    tramite_key: c.tramite_key,
    status: c.status,
    created_at: c.created_at,
    updated_at: c.updated_at,
    client_email: clientsMap.get(c.client_id) ?? null,
  }));

  /* KPIs */
  const total = rows.length;
  const pending = rows.filter(c => c.status === "pending").length;
  const inReview = rows.filter(c => c.status === "in_review").length;
  const favorable = rows.filter(c => c.status === "favorable").length;
  const notFavorable = rows.filter(c => c.status === "not_favorable").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Gestión de Expedientes
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Panel completo de casos • Migraria Legal
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
              >
                ← Dashboard
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Barra de Acciones */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Todos los Expedientes
            </h2>
            <p className="text-gray-600 text-sm">
              {total} casos registrados en el sistema
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Botones de Exportación - Ahora como componente separado */}
            <ExportButtons />
            
            <Link
              href="/admin/cases/new"
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Expediente
            </Link>
            
            <button className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtrar
            </button>
          </div>
        </div>

        {/* Resto del código permanece exactamente igual */}
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard 
            title="Total" 
            value={total}
            color="blue"
            description="Expedientes totales"
          />
          
          <KpiCard 
            title="Pendientes" 
            value={pending}
            color="amber"
            description="Esperando documentación"
          />
          
          <KpiCard 
            title="En Revisión" 
            value={inReview}
            color="purple"
            description="En proceso legal"
            highlight
          />
          
          <KpiCard 
            title="Favorables" 
            value={favorable}
            color="emerald"
            description="Resueltos positivamente"
          />
          
          <KpiCard 
            title="No Favorables" 
            value={notFavorable}
            color="red"
            description="Requieren apelación"
          />
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trámite
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Clave
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actualizado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          No hay expedientes registrados
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Comienza creando tu primer caso
                        </p>
                        <Link
                          href="/admin/cases/new"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                          Crear Primer Expediente
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {c.client_email?.split('@')[0] || "Cliente"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {c.client_email || "Sin email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {c.tramite}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {c.tramite_key}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600">
                            {new Date(c.created_at).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-600">
                            {new Date(c.updated_at).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/case/${c.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                          >
                            Ver
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                          
                          <Link
                            href={`/admin/case/${c.id}/edit`}
                            className="text-gray-600 hover:text-gray-900 text-sm"
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ======================================================
   COMPONENTES AUXILIARES
   ====================================================== */

interface KpiCardProps {
  title: string;
  value: number;
  color: 'blue' | 'amber' | 'purple' | 'emerald' | 'red' | 'gray';
  description?: string;
  highlight?: boolean;
}

function KpiCard({ title, value, color, description, highlight }: KpiCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700'
  };

  const iconColors = {
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    purple: 'text-purple-600',
    emerald: 'text-emerald-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  };

  return (
    <div className={`
      border rounded-xl p-5
      ${colorClasses[color]}
      ${highlight ? 'ring-2 ring-purple-400 ring-offset-2' : ''}
      transition-all duration-200 hover:shadow-md
    `}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
          {description && (
            <p className="text-xs opacity-70 mt-2">{description}</p>
          )}
        </div>
        
        <div className={`p-2 rounded-lg bg-opacity-20 ${iconColors[color]} bg-${color.split('-')[0]}-100`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700",
    in_review: "bg-amber-100 text-amber-700",
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
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}