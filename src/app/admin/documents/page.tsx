"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  DocumentTextIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CalendarDaysIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { adminApi, downloadBlob } from "@/lib/api/admin";

/* ======================================================
   GESTIÓN DOCUMENTAL COMPLETA
   ====================================================== */

type DocumentWithCase = {
  id: string;
  file_name: string;
  document_type: string;
  uploaded_at: string;
  mime_type: string;
  file_path: string;
  case_id: string;
  case?: {
    tramite: string;
    client_email?: string;
    created_at: string;
  };
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentWithCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // En un caso real, aquí llamarías a tu API
      // Por ahora simulamos datos
      const response = await fetch('/api/admin/documents/list'); // Necesitarías crear este endpoint
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error cargando documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      const blob = await adminApi.downloadDocument(documentId);
      downloadBlob(blob, filename);
    } catch (error) {
      alert('Error al descargar el documento');
      console.error(error);
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedDocuments.size === 0) {
      alert('Selecciona al menos un documento');
      return;
    }

    if (selectedDocuments.size === 1) {
      const docId = Array.from(selectedDocuments)[0];
      const doc = documents.find(d => d.id === docId);
      if (doc) {
        await handleDownload(doc.id, doc.file_name);
      }
      return;
    }

    // Para múltiples documentos, podrías implementar ZIP
    alert(`Funcionalidad de descarga múltiple (ZIP) para ${selectedDocuments.size} documentos`);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.case?.tramite.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || doc.document_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const documentTypes = Array.from(new Set(documents.map(d => d.document_type)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Gestión Documental
                  </h1>
                  <p className="text-blue-200 text-sm mt-1">
                    {documents.length} documentos • Control completo
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">
                  {selectedDocuments.size} seleccionados
                </p>
                <p className="text-xs text-blue-300">
                  {documentTypes.length} tipos de documento
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
        {/* Barra de herramientas */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Buscar por nombre, tipo, trámite..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <select
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">Todos los tipos</option>
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={handleDownloadSelected}
                    disabled={selectedDocuments.size === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    Descargar ({selectedDocuments.size})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de documentos */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedDocuments.size === documents.length && documents.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocuments(new Set(documents.map(d => d.id)));
                        } else {
                          setSelectedDocuments(new Set());
                        }
                      }}
                    />
                  </th>
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
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <DocumentTextIcon className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          {searchQuery || filterType !== 'all' ? 'No se encontraron documentos' : 'No hay documentos'}
                        </h3>
                        <p className="text-gray-500">
                          {searchQuery || filterType !== 'all' ? 'Intenta con otros filtros' : 'Los documentos aparecerán cuando se suban'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedDocuments.has(doc.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedDocuments);
                            if (e.target.checked) {
                              newSelected.add(doc.id);
                            } else {
                              newSelected.delete(doc.id);
                            }
                            setSelectedDocuments(newSelected);
                          }}
                        />
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {doc.file_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {doc.mime_type}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {doc.document_type}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        {doc.case ? (
                          <div>
                            <p className="font-medium text-gray-900">
                              {doc.case.tramite}
                            </p>
                            {doc.case.client_email && (
                              <p className="text-sm text-gray-500">
                                {doc.case.client_email}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Sin caso</span>
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
                          <button
                            onClick={() => handleDownload(doc.id, doc.file_name)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Descargar"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                          
                          <Link
                            href={`/admin/case/${doc.case_id}`}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Ver caso"
                          >
                            <EyeIcon className="h-5 w-5" />
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

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Documentos totales</p>
                <p className="text-3xl font-bold text-blue-900">
                  {documents.length}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  {documentTypes.length} tipos diferentes
                </p>
              </div>
              <DocumentTextIcon className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Espacio utilizado</p>
                <p className="text-3xl font-bold text-green-900">
                  {Math.round(documents.length * 2.5)} MB
                </p>
                <p className="text-xs text-green-600 mt-2">
                  ~2.5 MB por documento
                </p>
              </div>
              <DocumentArrowDownIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Último mes</p>
                <p className="text-3xl font-bold text-purple-900">
                  {documents.filter(d => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return new Date(d.uploaded_at) > monthAgo;
                  }).length}
                </p>
                <p className="text-xs text-purple-600 mt-2">
                  documentos subidos
                </p>
              </div>
              <CalendarDaysIcon className="h-10 w-10 text-purple-500" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}