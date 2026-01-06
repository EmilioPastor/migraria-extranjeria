export const revalidate = 0;
export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";

/* ======================================================
   TIPOS
   ====================================================== */

type DocumentRow = {
  id: string;
  document_type: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  uploaded_at: string;
  created_at: string;
  case_id: string;
  case_data?: {
    tramite: string;
    client_id: string;
    client_email?: string | null;
    client_name?: string | null;
  } | null;
};

/* ======================================================
   PAGE - CORREGIDO
   ====================================================== */

export default async function AdminDocumentsPage() {
  const supabase = supabaseAdmin();

  // 1. Obtener documentos (SOLO datos de documentos primero)
  const { data: documentsRaw, error: documentsError } = await supabase
    .from("case_documents")
    .select(`
      id,
      document_type,
      file_path,
      file_name,
      mime_type,
      uploaded_at,
      created_at,
      case_id
    `)
    .order("uploaded_at", { ascending: false });

  if (documentsError) {
    console.error("Error cargando documentos:", documentsError);
  }

  const documents = documentsRaw || [];

  // 2. Obtener información de los casos relacionados
  const caseIds = Array.from(
    new Set(documents.map(d => d.case_id).filter(Boolean))
  );

  const casesMap = new Map<string, {
    tramite: string;
    client_id: string;
  }>();

  if (caseIds.length > 0) {
    const { data: casesData } = await supabase
      .from("cases")
      .select("id, tramite, client_id")
      .in("id", caseIds);

    casesData?.forEach(c => {
      casesMap.set(c.id, {
        tramite: c.tramite,
        client_id: c.client_id
      });
    });
  }

  // 3. Obtener información de clientes
  const clientIds = Array.from(
    new Set(Array.from(casesMap.values()).map(c => c.client_id).filter(Boolean))
  );

  const clientsMap = new Map<string, {
    email: string | null;
    name: string | null;
  }>();

  if (clientIds.length > 0) {
    const { data: clientsData } = await supabase
      .from("clients")
      .select("id, email, name")
      .in("id", clientIds);

    clientsData?.forEach(c => {
      clientsMap.set(c.id, {
        email: c.email,
        name: c.name
      });
    });
  }

  // 4. Combinar toda la información
  const documentsWithDetails: DocumentRow[] = documents.map(doc => {
    const caseInfo = doc.case_id ? casesMap.get(doc.case_id) : undefined;
    const clientInfo = caseInfo?.client_id ? clientsMap.get(caseInfo.client_id) : undefined;

    return {
      ...doc,
      case_data: caseInfo ? {
        tramite: caseInfo.tramite,
        client_id: caseInfo.client_id,
        client_email: clientInfo?.email || null,
        client_name: clientInfo?.name || null
      } : null
    };
  });

  // 5. Estadísticas
  const total = documentsWithDetails.length;
  const types = Array.from(new Set(documentsWithDetails.map(d => d.document_type)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Gestión Documental
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Centralización de documentos • Migraria Legal
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
              >
                ← Dashboard
              </Link>
              <Link
                href="/admin/documents/upload"
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Subir Documentos
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Barra de estadísticas */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Resumen Documental
              </h2>
              <p className="text-gray-600 text-sm">
                {total} documentos en el sistema
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <StatBadge 
                value={total}
                label="Total" 
                color="blue" 
              />
              <StatBadge 
                value={types.length}
                label="Tipos" 
                color="emerald" 
              />
              <StatBadge 
                value={documentsWithDetails.filter(d => d.mime_type === 'application/pdf').length}
                label="PDFs" 
                color="red" 
              />
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <form className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="search"
                      name="q"
                      placeholder="Buscar por nombre de archivo, tipo..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <select
                    name="type"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos los tipos</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filtrar
                  </button>
                  
                  <Link
                    href="/admin/documents"
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Limpiar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Tabla de Documentos */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Caso
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha de Subida
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {documentsWithDetails.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          No hay documentos
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Sube el primer documento para comenzar
                        </p>
                        <Link
                          href="/admin/documents/upload"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                          Subir Documento
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  documentsWithDetails.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.mime_type === 'application/pdf' 
                              ? 'bg-red-100 text-red-600' 
                              : doc.mime_type?.includes('image') 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {doc.mime_type === 'application/pdf' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            ) : doc.mime_type?.includes('image') ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-xs">
                              {doc.file_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {doc.mime_type || 'Sin tipo'}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {doc.document_type}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        {doc.case_data ? (
                          <Link
                            href={`/admin/case/${doc.case_id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {doc.case_data.tramite}
                          </Link>
                        ) : (
                          <span className="text-gray-500">Caso no encontrado</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        {doc.case_data?.client_email ? (
                          <div>
                            <p className="font-medium text-gray-900">
                              {doc.case_data.client_name || doc.case_data.client_email?.split('@')[0] || 'Cliente'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {doc.case_data.client_email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-500">Sin cliente</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(doc.uploaded_at).toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(doc.uploaded_at).toLocaleTimeString('es-ES')}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {doc.file_path && (
                            <>
                              <a
                                href={doc.file_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver documento"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </a>
                              
                              <button
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Descargar"
                                onClick={() => window.open(doc.file_path || '#', '_blank')}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            </>
                          )}
                          
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                            onClick={() => {
                              if (confirm('¿Estás seguro de eliminar este documento?')) {
                                // Aquí iría la lógica de eliminación
                              }
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {documentsWithDetails.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando {documentsWithDetails.length} de {total} documentos
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
                    1
                  </span>
                  <button
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={documentsWithDetails.length < 20}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ======================================================
   COMPONENTES AUXILIARES
   ====================================================== */

function StatBadge({ value, label, color }: { value: number; label: string; color: 'blue' | 'emerald' | 'red' | 'amber' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700'
  };

  return (
    <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${colorClasses[color]}`}>
      <span className="font-bold">{value}</span> {label}
    </div>
  );
}