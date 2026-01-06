export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { 
  UserGroupIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

/* ======================================================
   GESTIÓN DE CLIENTES
   ====================================================== */

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = supabaseAdmin();

  const searchQuery = searchParams?.q as string;

  // Obtener todos los clientes
  let query = supabase
    .from("clients")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("email", `%${searchQuery}%`);
  }

  const { data: clients } = await query;

  // Obtener casos para cada cliente
  const clientStats = new Map();
  
  if (clients && clients.length > 0) {
    const clientIds = clients.map(c => c.id);
    
    // Obtener todos los casos de estos clientes
    const { data: cases } = await supabase
      .from("cases")
      .select("id, client_id, status, created_at")
      .in("client_id", clientIds);

    // Calcular estadísticas por cliente
    clients.forEach(client => {
      const clientCases = cases?.filter(c => c.client_id === client.id) || [];
      
      clientStats.set(client.id, {
        total: clientCases.length,
        pending: clientCases.filter(c => c.status === 'pending').length,
        in_review: clientCases.filter(c => c.status === 'in_review').length,
        favorable: clientCases.filter(c => c.status === 'favorable').length,
        not_favorable: clientCases.filter(c => c.status === 'not_favorable').length,
        lastCase: clientCases.length > 0 
          ? new Date(Math.max(...clientCases.map(c => new Date(c.created_at).getTime())))
          : null
      });
    });
  }

  // Estadísticas generales
  const totalClients = clients?.length || 0;
  const activeClients = Array.from(clientStats.values()).filter(stats => stats.total > 0).length;
  const clientsWithPendingCases = Array.from(clientStats.values()).filter(stats => stats.pending > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <UserGroupIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Gestión de Clientes
                  </h1>
                  <p className="text-blue-200 text-sm mt-1">
                    Base de clientes • {totalClients} registrados
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">
                  {activeClients} clientes activos
                </p>
                <p className="text-xs text-blue-300">
                  {clientsWithPendingCases} con casos pendientes
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
        {/* Barra de búsqueda */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <form className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  name="q"
                  placeholder="Buscar cliente por email..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={searchQuery || ''}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                Buscar
              </button>
              
              <Link
                href="/admin/clients"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium"
              >
                Limpiar
              </Link>
            </div>
          </form>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Clientes totales</p>
                <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Con casos activos</p>
                <p className="text-3xl font-bold text-gray-900">{activeClients}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Con casos pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{clientsWithPendingCases}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Resueltos favorables</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Array.from(clientStats.values()).filter(stats => stats.favorable > 0).length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Casos
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estadísticas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Último caso
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {clients && clients.length > 0 ? (
                  clients.map(client => {
                    const stats = clientStats.get(client.id) || {
                      total: 0,
                      pending: 0,
                      in_review: 0,
                      favorable: 0,
                      not_favorable: 0,
                      lastCase: null
                    };

                    return (
                      <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {client.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                Registrado: {new Date(client.created_at).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                              {stats.total}
                            </p>
                            <p className="text-xs text-gray-500">casos totales</p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {stats.pending > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                  {stats.pending} pendientes
                                </span>
                              </div>
                            )}
                            {stats.in_review > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                  {stats.in_review} en revisión
                                </span>
                              </div>
                            )}
                            {stats.favorable > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                  {stats.favorable} favorables
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {stats.lastCase ? (
                            <div className="text-sm text-gray-600">
                              {stats.lastCase.toLocaleDateString('es-ES')}
                              <p className="text-xs text-gray-400">
                                hace {Math.floor((new Date().getTime() - stats.lastCase.getTime()) / (1000 * 60 * 60 * 24))} días
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Sin casos</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/cases?client=${client.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Ver casos
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <UserGroupIcon className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          {searchQuery ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                        </h3>
                        <p className="text-gray-500">
                          {searchQuery ? 'Intenta con otra búsqueda' : 'Los clientes aparecerán al crear casos'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {clients && clients.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando {clients.length} de {totalClients} clientes
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}