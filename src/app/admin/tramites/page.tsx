export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { 
  CogIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

/* ======================================================
   CONFIGURACIÓN DE TRÁMITES - CORREGIDO
   ====================================================== */

export default async function AdminTramitesPage() {
  const supabase = supabaseAdmin();

  // Obtener todos los trámites
  const { data: tramites } = await supabase
    .from("tramites")
    .select("id, label, key, description, active")
    .order("label", { ascending: true });

  // Obtener documentos requeridos por trámite
  const { data: requiredDocs } = await supabase
    .from("tramite_required_documents")
    .select("tramite, document_type")
    .order("tramite", { ascending: true });

  // Agrupar documentos por trámite
  const docsByTramite: Record<string, string[]> = {};
  requiredDocs?.forEach(doc => {
    if (!docsByTramite[doc.tramite]) {
      docsByTramite[doc.tramite] = [];
    }
    docsByTramite[doc.tramite].push(doc.document_type);
  });

  // Obtener estadísticas de casos por trámite
  const { data: casesByTramite } = await supabase
    .from("cases")
    .select("tramite_key, status");

  // Calcular estadísticas - VERSIÓN CORREGIDA
  const statsByTramite: Record<string, {
    total: number;
    pending: number;
    in_review: number;
    favorable: number;
    not_favorable: number;
  }> = {};

  casesByTramite?.forEach(c => {
    if (!statsByTramite[c.tramite_key]) {
      statsByTramite[c.tramite_key] = {
        total: 0,
        pending: 0,
        in_review: 0,
        favorable: 0,
        not_favorable: 0
      };
    }
    
    const stats = statsByTramite[c.tramite_key];
    stats.total++;
    
    // Usar un switch para manejar los estados válidos
    switch(c.status) {
      case 'pending':
        stats.pending++;
        break;
      case 'in_review':
        stats.in_review++;
        break;
      case 'favorable':
        stats.favorable++;
        break;
      case 'not_favorable':
        stats.not_favorable++;
        break;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <CogIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Configuración de Trámites
                  </h1>
                  <p className="text-blue-200 text-sm mt-1">
                    Tipos de trámites y documentos requeridos
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">
                  {tramites?.length || 0} tipos de trámite
                </p>
                <p className="text-xs text-blue-300">
                  {Object.keys(docsByTramite).length} con documentos configurados
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
        {/* Barra de acciones */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Tipos de Trámites
              </h2>
              <p className="text-gray-600 text-sm">
                Configure los diferentes tipos de trámites y sus documentos requeridos
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Nuevo Trámite
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2">
                <ArrowPathIcon className="h-5 w-5" />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de trámites */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trámite
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Documentos Requeridos
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estadísticas de Casos
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {tramites && tramites.length > 0 ? (
                  tramites.map(tramite => {
                    const stats = statsByTramite[tramite.key] || {
                      total: 0,
                      pending: 0,
                      in_review: 0,
                      favorable: 0,
                      not_favorable: 0
                    };
                    const requiredDocs = docsByTramite[tramite.key] || [];

                    return (
                      <tr key={tramite.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-gray-900">{tramite.label}</p>
                            <p className="text-sm text-gray-500">{tramite.key}</p>
                            {tramite.description && (
                              <p className="text-sm text-gray-600 mt-1">{tramite.description}</p>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {requiredDocs.length > 0 ? (
                            <div className="space-y-1">
                              {requiredDocs.slice(0, 3).map((doc, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-700">{doc}</span>
                                </div>
                              ))}
                              {requiredDocs.length > 3 && (
                                <p className="text-xs text-gray-500">
                                  +{requiredDocs.length - 3} más
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Sin documentos configurados</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          {stats.total > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total:</span>
                                <span className="font-medium">{stats.total}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Activos:</span>
                                <span className="font-medium text-blue-600">
                                  {stats.pending + stats.in_review}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Favorables:</span>
                                <span className="font-medium text-green-600">
                                  {stats.favorable}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Sin casos</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {tramite.active ? (
                              <>
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-green-700">Activo</span>
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="h-5 w-5 text-red-500" />
                                <span className="text-sm text-red-700">Inactivo</span>
                              </>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CogIcon className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          No hay trámites configurados
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Configure los tipos de trámites para comenzar
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                          <PlusIcon className="h-5 w-5" />
                          Crear Primer Trámite
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-4">
              Tipos de documento más comunes
            </h3>
            <div className="space-y-3">
              {(() => {
                // Contar frecuencia de documentos requeridos
                const docCounts: Record<string, number> = {};
                requiredDocs?.forEach(doc => {
                  docCounts[doc.document_type] = (docCounts[doc.document_type] || 0) + 1;
                });
                
                const sortedDocs = Object.entries(docCounts)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5);
                
                return sortedDocs.map(([doc, count]) => (
                  <div key={doc} className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">{doc}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {count} trámites
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6">
            <h3 className="font-semibold text-green-900 mb-4">
              Trámites más utilizados
            </h3>
            <div className="space-y-3">
              {tramites?.map(tramite => {
                const stats = statsByTramite[tramite.key];
                if (!stats || stats.total === 0) return null;
                
                return (
                  <div key={tramite.id} className="flex items-center justify-between">
                    <span className="text-sm text-green-800">{tramite.label}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {stats.total} casos
                    </span>
                  </div>
                );
              }).filter(Boolean).slice(0, 5)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}