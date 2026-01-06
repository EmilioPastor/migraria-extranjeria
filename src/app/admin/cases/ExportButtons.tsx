'use client';

import { DocumentArrowDownIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ExportButtons() {
  const [exportLoading, setExportLoading] = useState<null | 'csv' | 'json'>(null);

  // Función para descargar el blob
  // const downloadBlob = (blob: Blob, filename: string) => {
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = filename;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   window.URL.revokeObjectURL(url);
  // };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExportLoading(format);
      // Aquí debes usar tu adminApi real
      // const blob = await adminApi.exportCases(format);
      // downloadBlob(blob, `casos-${new Date().toISOString().split('T')[0]}.${format}`);
      
      // Por ahora, solo muestra un mensaje
      alert(`Función de exportación ${format.toUpperCase()} en desarrollo. Implementa adminApi.exportCases()`);
    } catch (error) {
      console.error(`Error al exportar ${format}:`, error);
      alert(`Error al exportar ${format.toUpperCase()}`);
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleExport('csv')}
        disabled={exportLoading === 'csv'}
        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
      >
        <DocumentArrowDownIcon className="h-5 w-5" />
        {exportLoading === 'csv' ? 'Exportando...' : 'Exportar CSV'}
      </button>
      
      <button
        onClick={() => handleExport('json')}
        disabled={exportLoading === 'json'}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
      >
        <DocumentTextIcon className="h-5 w-5" />
        {exportLoading === 'json' ? 'Exportando...' : 'Exportar JSON'}
      </button>
    </div>
  );
}