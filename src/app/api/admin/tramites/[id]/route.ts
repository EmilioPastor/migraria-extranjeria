export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

// PUT: Actualizar trámite
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { label, key, description, active, required_docs } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de trámite requerido' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // 1. Obtener trámite actual para saber su key
    const { data: existingTramite, error: fetchError } = await supabase
      .from('tramites')
      .select('key')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Trámite no encontrado' },
        { status: 404 }
      );
    }

    // 2. Actualizar trámite
    const { data: updatedTramite, error: updateError } = await supabase
      .from('tramites')
      .update({
        label,
        key: key || existingTramite.key,
        description,
        active,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // 3. Actualizar documentos requeridos si se proporcionan
    if (required_docs && Array.isArray(required_docs)) {
      const newKey = key || existingTramite.key;
      
      // Eliminar documentos antiguos
      await supabase
        .from('tramite_required_documents')
        .delete()
        .eq('tramite', newKey);

      // Insertar nuevos documentos si hay
      if (required_docs.length > 0) {
        const docsToInsert = required_docs.map((doc_type: string) => ({
          tramite: newKey,
          document_type: doc_type,
        }));

        const { error: docsError } = await supabase
          .from('tramite_required_documents')
          .insert(docsToInsert);

        if (docsError) {
          throw docsError;
        }
      }
    }

    return NextResponse.json(updatedTramite);
  } catch (error) {
    console.error('Error al actualizar trámite:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error al actualizar trámite';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar trámite
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de trámite requerido' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Obtener key del trámite primero
    const { data: tramiteData, error: tramiteError } = await supabase
      .from('tramites')
      .select('key')
      .eq('id', id)
      .single();

    if (tramiteError) {
      throw tramiteError;
    }

    if (!tramiteData) {
      return NextResponse.json(
        { error: 'Trámite no encontrado' },
        { status: 404 }
      );
    }

    // 1. Verificar si hay casos usando este trámite
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id')
      .eq('tramite_key', tramiteData.key)
      .limit(1);

    if (casesError) {
      throw casesError;
    }

    if (cases && cases.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar el trámite porque hay casos que lo usan' },
        { status: 409 }
      );
    }

    // 2. Eliminar documentos requeridos primero
    await supabase
      .from('tramite_required_documents')
      .delete()
      .eq('tramite', tramiteData.key);

    // 3. Eliminar trámite
    const { error: deleteError } = await supabase
      .from('tramites')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar trámite:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error al eliminar trámite';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}