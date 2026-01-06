import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

    // Obtener emails de clientes
    const clientIds = Array.from(
      new Set(
        (documents || [])
          .flatMap((doc: any) => 
            (doc.cases || []).map((c: any) => c?.client_id).filter(Boolean)
          )
      )
    );

    const clientsMap = new Map<string, string>();
    
    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from('clients')
        .select('id, email')
        .in('id', clientIds);

      clients?.forEach((c: any) => {
        clientsMap.set(c.id, c.email);
      });
    }

    // Procesar documentos
    const processedDocuments = (documents || []).map((doc: any) => {
      const firstCase = Array.isArray(doc.cases) ? doc.cases[0] : doc.cases;
      
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