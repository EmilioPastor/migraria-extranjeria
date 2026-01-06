export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { 
  ClipboardDocumentCheckIcon,
  ClockIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  // XCircleIcon,
  UserGroupIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon,
  // CalendarDaysIcon,
  DocumentMagnifyingGlassIcon,
  DocumentTextIcon,
  // UsersIcon,
  // FlagIcon,
  ScaleIcon
} from "@heroicons/react/24/outline";

/* ======================================================
   DASHBOARD MEJORADO — DATOS REALES DE TU BBDD
   ====================================================== */

export default async function AdminDashboardPage() {
  const supabase = supabaseAdmin();

  /* ===============================
     CONSULTAS PARALELAS SEGURAS
     =============================== */
  
  // 1. Estadísticas de casos (MISMA lógica que ya tienes)
  const [
    { count: activeCases },
    { count: pendingDocs },
    { count: inReview },
    { count: favorable },
    { count: notFavorable },
    { data: priorityCasesRaw },
    { data: notifications },
    { data: activity },
    { count: totalClients },
    { count: totalDocuments }
  ] = await Promise.all([
    // Casos activos (pending + in_review)
    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "in_review"]),

    // Pendientes de documentación
    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),

    // En revisión
    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_review"),

    // Favorables
    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .eq("status", "favorable"),

    // No favorables
    supabase
      .from("cases")
      .select("*", { count: "exact", head: true })
      .eq("status", "not_favorable"),

    // Casos prioritarios (últimos 8 casos en revisión o pendientes)
    supabase
      .from("cases")
      .select("id, tramite, status, updated_at, client_id")
      .in("status", ["in_review", "pending"])
      .order("updated_at", { ascending: true })
      .limit(8),

    // Notificaciones no leídas
    supabase
      .from("admin_notifications")
      .select("*")
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(5),

    // Actividad reciente
    supabase
      .from("admin_actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),

    // Total de clientes
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true }),

    // Total de documentos
    supabase
      .from("case_documents")
      .select("*", { count: "exact", head: true })
  ]);

  /* ===============================
     PROCESAMIENTO SEGURO (igual que en /admin/cases)
     =============================== */
  
  // Obtener emails de clientes para los casos prioritarios
  const clientIds = Array.from(
    new Set(priorityCasesRaw?.map(c => c.client_id).filter(Boolean))
  );

  const clientsMap = new Map<string, string>();

  if (clientIds.length > 0) {
    const { data: clients } = await supabase
      .from("clients")
      .select("id, email")
      .in("id", clientIds);

    clients?.forEach(c => {
      if (c.email) clientsMap.set(c.id, c.email);
    });
  }

  // Casos prioritarios mapeados
  const priorityCases = priorityCasesRaw?.map(c => ({
    id: c.id,
    tramite: c.tramite,
    status: c.status,
    updated_at: c.updated_at,
    client_email: clientsMap.get(c.client_id) || null,
  })) || [];

  /* ===============================
     CÁLCULOS ADICIONALES
     =============================== */
  
  const today = new Date().toISOString().split('T')[0];
  const { count: todayCases } = await supabase
    .from("cases")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today)
    .lt("created_at", new Date(new Date(today).getTime() + 86400000).toISOString());

  // Tasa de éxito
  const totalResolved = (favorable || 0) + (notFavorable || 0);
  const successRate = totalResolved > 0 
    ? Math.round(((favorable || 0) / totalResolved) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Panel de Control Migraria
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Sistema de Gestión de Extranjería • {todayCases || 0} casos hoy
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
              
              <Link
                href="/admin/cases"
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
              >
                <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                Ver todos los casos
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* KPIs con datos reales */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <KpiCard 
              title="Casos Activos" 
              value={activeCases || 0}
              icon={<UserGroupIcon className="h-6 w-6" />}
              color="blue"
              description="En trámite"
            />
            
            <KpiCard 
              title="Pendientes" 
              value={pendingDocs || 0}
              icon={<ClipboardDocumentCheckIcon className="h-6 w-6" />}
              color="amber"
              description="Esperando docs"
            />
            
            <KpiCard 
              title="En Revisión" 
              value={inReview || 0}
              icon={<ScaleIcon className="h-6 w-6" />}
              color="purple"
              description="Prioritarios"
              highlight
            />
            
            <KpiCard 
              title="Resueltos" 
              value={(favorable || 0) + (notFavorable || 0)}
              icon={<DocumentCheckIcon className="h-6 w-6" />}
              color="gray"
              description="Finalizados"
            />
            
            <KpiCard 
              title="Tasa de Éxito" 
              value={successRate}
              suffix="%"
              icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
              color="green"
              description="Favorables"
            />
            
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Documentos totales</p>
                  <p className="text-3xl font-bold mt-1">{totalDocuments || 0}</p>
                  <p className="text-xs opacity-75 mt-2">
                    {totalClients || 0} clientes registrados
                  </p>
                </div>
                <DocumentTextIcon className="h-8 w-8 opacity-80" />
              </div>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Casos Prioritarios */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Casos que Requieren Atención
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                    {priorityCases.length} urgentes
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {priorityCases.length > 0 ? (
                  priorityCases.map((c) => (
                    <div key={c.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {c.client_email || "Cliente no asignado"}
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {c.tramite}
                                  </p>
                                </div>
                                <StatusBadge status={c.status} />
                              </div>
                              
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <ClockIcon className="h-4 w-4" />
                                  <span>
                                    Actualizado: {new Date(c.updated_at).toLocaleDateString('es-ES')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Link
                          href={`/admin/case/${c.id}`}
                          className="ml-4 text-blue-600 hover:text-blue-800 font-medium text-sm whitespace-nowrap"
                        >
                          Revisar →
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Todo bajo control
                    </h3>
                    <p className="text-gray-500">
                      No hay casos que requieran atención inmediata
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notificaciones */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <BellAlertIcon className="h-5 w-5 text-gray-700" />
                  <h2 className="font-semibold text-gray-800">
                    Notificaciones
                  </h2>
                </div>
              </div>
              
              <div className="p-1">
                {notifications && notifications.length > 0 ? (
                  <div className="space-y-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 border-l-4 ${
                          n.priority === 'high'
                            ? 'border-l-red-500 bg-red-50'
                            : 'border-l-blue-500 bg-blue-50'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{n.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {new Date(n.created_at).toLocaleTimeString('es-ES')}
                          </span>
                          {n.case_id && (
                            <Link
                              href={`/admin/case/${n.case_id}`}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              Ver caso
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <BellAlertIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No hay notificaciones</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actividad Reciente */}
            {/* <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">
                  Actividad Reciente
                </h2>
              </div>
              
              <div className="p-1">
                {activity && activity.length > 0 ? (
                  <div className="space-y-0">
                    {activity.map((a) => (
                      <div key={a.id} className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{a.action}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-gray-500">
                                {a.user_name || "Sistema"}
                              </p>
                              {a.case_reference && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  #{a.case_reference}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(a.created_at).toLocaleString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 text-sm">Sin actividad reciente</p>
                  </div>
                )}
              </div>
            </div> */}

            {/* Acciones Rápidas */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
              <h3 className="font-bold mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/cases/new"
                  className="block bg-white text-blue-700 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  + Nuevo Expediente
                </Link>
                <Link
                  href="/admin/documents"
                  className="block bg-blue-800 hover:bg-blue-900 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  📄 Gestión Documental
                </Link>
                <Link
                  href="/admin/calendar"
                  className="block bg-blue-800 hover:bg-blue-900 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
                >
                  📅 Calendario
                </Link>
              </div>
            </div>
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
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'purple' | 'green' | 'gray';
  description?: string;
  suffix?: string;
  highlight?: boolean;
}

function KpiCard({ title, value, icon, color, description, suffix = '', highlight }: KpiCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700'
  };

  const iconClasses = {
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  return (
    <div className={`
      border rounded-xl p-5
      ${colorClasses[color]}
      ${highlight ? 'ring-2 ring-purple-400' : ''}
      transition-all duration-200 hover:shadow-md
    `}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value.toLocaleString()}{suffix}
          </p>
          {description && (
            <p className="text-xs opacity-70 mt-2">{description}</p>
          )}
        </div>
        
        <div className={`p-2.5 rounded-lg ${iconClasses[color]}`}>
          <div className="h-5 w-5">
            {icon}
          </div>
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