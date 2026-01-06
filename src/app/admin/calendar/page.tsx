  export const dynamic = "force-dynamic";

  import { supabaseAdmin } from "@/lib/supabaseAdmin";
  import Link from "next/link";
  import { 
    CalendarDaysIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    // UserGroupIcon,
    ClockIcon,
    ArrowTrendingUpIcon
  } from "@heroicons/react/24/outline";

  /* ======================================================
    CALENDARIO DE CASOS - BASADO EN FECHAS DE CREACIÓN
    ====================================================== */

  export default async function AdminCalendarPage() {
    const supabase = supabaseAdmin();

    // Obtener casos del mes actual
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data: cases } = await supabase
      .from("cases")
      .select("id, tramite, status, created_at, client_id")
      .gte("created_at", firstDay.toISOString())
      .lte("created_at", lastDay.toISOString())
      .order("created_at", { ascending: false });

    // Obtener clientes para los casos
    const clientIds = Array.from(
      new Set(cases?.map(c => c.client_id).filter(Boolean))
    );

    const clientsMap = new Map<string, string>();
    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from("clients")
        .select("id, email")
        .in("id", clientIds);

      clients?.forEach(c => {
        clientsMap.set(c.id, c.email);
      });
    }

    // Organizar casos por día
    const casesByDay: Record<string, Array<{
      id: string;
      tramite: string;
      status: string;
      client_email: string | null;
    }>> = {};

    cases?.forEach(c => {
      const date = new Date(c.created_at).toISOString().split('T')[0];
      if (!casesByDay[date]) {
        casesByDay[date] = [];
      }
      casesByDay[date].push({
        id: c.id,
        tramite: c.tramite,
        status: c.status,
        client_email: c.client_id ? clientsMap.get(c.client_id) || null : null,
      });
    });

    // Estadísticas
    const today = new Date().toISOString().split('T')[0];
    const casesToday = casesByDay[today]?.length || 0;
    const totalThisMonth = cases?.length || 0;

    // Generar días del mes actual
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();
    
    // Días del mes
    const daysInMonth = lastDay.getDate();
    const firstDayOfMonth = firstDay.getDay(); // 0 = Domingo

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CalendarDaysIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      Calendario de Casos
                    </h1>
                    <p className="text-blue-200 text-sm mt-1">
                      Distribución mensual • {currentMonth} {currentYear}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-blue-200">
                    {totalThisMonth} casos este mes
                  </p>
                  <p className="text-xs text-blue-300">
                    {casesToday} creados hoy
                  </p>
                </div>
                
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                >
                  ← Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Barra de control del mes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentMonth} {currentYear}
                </h2>
                <p className="text-gray-600">
                  Vista mensual de creación de casos
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                  Hoy
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 gap-2">
              {/* Días de la semana */}
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                <div key={day} className="text-center py-2 font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* Espacios vacíos al inicio */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-32 border border-gray-100 rounded-lg bg-gray-50"></div>
              ))}
              
              {/* Días del mes */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const date = new Date(currentYear, now.getMonth(), day);
                const dateString = date.toISOString().split('T')[0];
                const dayCases = casesByDay[dateString] || [];
                
                return (
                  <div 
                    key={day} 
                    className={`min-h-32 border rounded-lg p-2 ${
                      dateString === today 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-medium ${
                        dateString === today 
                          ? 'text-blue-700' 
                          : day === now.getDate() 
                            ? 'text-blue-600' 
                            : 'text-gray-700'
                      }`}>
                        {day}
                      </span>
                      {dayCases.length > 0 && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {dayCases.length}
                        </span>
                      )}
                    </div>
                    
                    {/* Casos del día */}
                    <div className="space-y-1 overflow-y-auto max-h-24">
                      {dayCases.slice(0, 3).map(c => (
                        <Link
                          key={c.id}
                          href={`/admin/case/${c.id}`}
                          className="block text-xs p-1.5 bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                          <div className="font-medium truncate">{c.tramite}</div>
                          <div className="text-gray-500 truncate">
                            {c.client_email?.split('@')[0] || 'Cliente'}
                          </div>
                        </Link>
                      ))}
                      {dayCases.length > 3 && (
                        <div className="text-xs text-gray-500 text-center pt-1">
                          +{dayCases.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estadísticas del mes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Casos este mes</p>
                  <p className="text-3xl font-bold text-gray-900">{totalThisMonth}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {cases?.filter(c => c.status === 'pending').length || 0} pendientes
                  </p>
                </div>
                <DocumentTextIcon className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Casos hoy</p>
                  <p className="text-3xl font-bold text-gray-900">{casesToday}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
                  </p>
                </div>
                <ClockIcon className="h-10 w-10 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Días con actividad</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Object.keys(casesByDay).length}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    de {daysInMonth} días del mes
                  </p>
                </div>
                <ArrowTrendingUpIcon className="h-10 w-10 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Casos recientes */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Casos Creados Recientemente
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {cases?.slice(0, 10).map(c => (
                <div key={c.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{c.tramite}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500">
                            {clientsMap.get(c.client_id) || 'Cliente no asignado'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            c.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                            c.status === 'in_review' ? 'bg-amber-100 text-amber-700' :
                            c.status === 'favorable' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {c.status === 'pending' ? 'Pendiente' :
                            c.status === 'in_review' ? 'En revisión' :
                            c.status === 'favorable' ? 'Favorable' : 'No favorable'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(c.created_at).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(c.created_at).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {cases?.length === 0 && (
                <div className="p-8 text-center">
                  <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Sin casos este mes
                  </h3>
                  <p className="text-gray-500">
                    No se han creado casos en {currentMonth}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }