import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    const caseId = searchParams.get('caseId');

    if (!documentId && !caseId) {
      return NextResponse.json(
        { error: 'ID de documento o caso requerido' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    if (documentId) {
      // Descargar documento específico
      const { data: document, error } = await supabase
        .from('case_documents')
        .select('file_path, file_name, mime_type')
        .eq('id', documentId)
        .single();

      if (error || !document) {
        return NextResponse.json(
          { error: 'Documento no encontrado' },
          { status: 404 }
        );
      }

      // Descargar del storage
      const { data: file, error: downloadError } = await supabase
        .storage
        .from('case-documents') // Ajusta el bucket según tu configuración
        .download(document.file_path);

      if (downloadError || !file) {
        return NextResponse.json(
          { error: 'Error al descargar archivo' },
          { status: 500 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': document.mime_type || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${document.file_name}"`,
        },
      });
    } else if (caseId) {
      // Descargar todos los documentos de un caso (ZIP)
      const { data: documents, error } = await supabase
        .from('case_documents')
        .select('file_path, file_name, mime_type')
        .eq('case_id', caseId);

      if (error || !documents || documents.length === 0) {
        return NextResponse.json(
          { error: 'No hay documentos para este caso' },
          { status: 404 }
        );
      }

      // Nota: Para crear ZIP necesitarías una biblioteca como jszip
      // Por ahora devolvemos la lista de documentos
      return NextResponse.json({
        caseId,
        documents,
        count: documents.length,
        message: 'Para descargar múltiples documentos, implementa compresión ZIP'
      });
    }

    return NextResponse.json(
      { error: 'Parámetros inválidos' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error en download endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}