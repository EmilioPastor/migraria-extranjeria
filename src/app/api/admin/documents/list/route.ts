import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

// Definir tipos para los documentos
type DocumentWithCase = {
  id: string;
  file_name: string;
  document_type: string;
  uploaded_at: string;
  mime_type: string;
  file_path: string;
  case_id: string;
  cases: Array<{
    tramite: string;
    client_id: string;
  }> | null;
};

type Client = {
  id: string;
  email: string;
};

type ProcessedDocument = {
  id: string;
  file_name: string;
  document_type: string;
  uploaded_at: string;
  mime_type: string;
  file_path: string;
  case_id: string;
  case: {
    tramite: string;
    client_email: string | undefined;
    created_at: string;
  };
};

export async function GET() { // Removido 'request' si no lo usas
  try {
    const supabase = supabaseAdmin();

    // Obtener documentos con información de caso
    const { data: documents, error } = await supabase
      .from('case_documents')
      .select(`
        id,
        file_name,
        document_type,
        uploaded_at,
        mime_type,
        file_path,
        case_id,
        cases (
          tramite,
          client_id
        )
      `)
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Cast a nuestro tipo definido
    const typedDocuments = (documents || []) as DocumentWithCase[];

    // Obtener emails de clientes
    const clientIds = Array.from(
      new Set(
        typedDocuments
          .flatMap(doc => 
            (doc.cases || []).map(caseItem => caseItem?.client_id).filter(Boolean) as string[]
          )
      )
    );

    const clientsMap = new Map<string, string>();
    
    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from('clients')
        .select('id, email')
        .in('id', clientIds);

      (clients || []).forEach((client: Client) => {
        clientsMap.set(client.id, client.email);
      });
    }

    // Procesar documentos
    const processedDocuments: ProcessedDocument[] = typedDocuments.map(doc => {
      const firstCase = Array.isArray(doc.cases) && doc.cases.length > 0 
        ? doc.cases[0] 
        : null;
      
      return {
        id: doc.id,
        file_name: doc.file_name,
        document_type: doc.document_type,
        uploaded_at: doc.uploaded_at,
        mime_type: doc.mime_type,
        file_path: doc.file_path,
        case_id: doc.case_id,
        case: {
          tramite: firstCase?.tramite || 'Sin trámite',
          client_email: firstCase?.client_id ? clientsMap.get(firstCase.client_id) : undefined,
          created_at: doc.uploaded_at
        }
      };
    });

    return NextResponse.json(processedDocuments);
  } catch (error) {
    console.error('Error al listar documentos:', error);
    return NextResponse.json(
      { error: 'Error al obtener documentos' },
      { status: 500 }
    );
  }
}