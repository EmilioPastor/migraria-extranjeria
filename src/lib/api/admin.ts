// src/lib/api/admin.ts

// Definir tipos primero
export interface CaseFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  tramite?: string;
  [key: string]: string | undefined;
}

export interface TramiteData {
  label: string;
  key: string;
  description?: string;
  active?: boolean;
  required_docs?: string[];
}

export interface UpdateTramiteData extends Partial<TramiteData> {
  id: string;
}

// Helper para hacer requests a los endpoints admin
export const adminApi = {
  // Documentos
  async downloadDocument(documentId: string) {
    const response = await fetch(`/api/admin/documents/download?id=${documentId}`);
    if (!response.ok) throw new Error('Error al descargar documento');
    return await response.blob();
  },

  async downloadCaseDocuments(caseId: string) {
    const response = await fetch(`/api/admin/documents/download?caseId=${caseId}`);
    return await response.json();
  },

  // Exportación
  async exportCases(format: 'csv' | 'json' = 'csv', filters?: CaseFilters) {
    const params = new URLSearchParams({ format, ...filters });
    const response = await fetch(`/api/admin/export/cases?${params}`);
    if (!response.ok) throw new Error('Error al exportar casos');
    return await response.blob();
  },

  async exportClients() {
    const response = await fetch('/api/admin/export/clients');
    if (!response.ok) throw new Error('Error al exportar clientes');
    return await response.blob();
  },

  // Calendario
  async getCalendarEvents(month?: string, year?: string) {
    const params = new URLSearchParams();
    if (month) params.set('month', month);
    if (year) params.set('year', year);
    
    const response = await fetch(`/api/admin/calendar/events?${params}`);
    return await response.json();
  },

  // Búsqueda
  async searchCases(query: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await fetch(`/api/admin/cases/search?${params}`);
    return await response.json();
  },

  // Trámites
  async getTramites() {
    const response = await fetch('/api/admin/tramites');
    return await response.json();
  },

  async createTramite(data: TramiteData) {
    const response = await fetch('/api/admin/tramites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  async updateTramite(id: string, data: UpdateTramiteData) {
    const response = await fetch(`/api/admin/tramites/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  async deleteTramite(id: string) {
    const response = await fetch(`/api/admin/tramites/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  }
};

// Helper para descargar blobs
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};