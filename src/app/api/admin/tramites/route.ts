import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

// GET: Obtener todos los trámites
export async function GET() {
  try {
    const supabase = supabaseAdmin();
    
    const { data: tramites, error } = await supabase
      .from('tramites')
      .select('*')
      .order('label', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(tramites);
  } catch (error) {
    console.error('Error al obtener trámites:', error);
    return NextResponse.json(
      { error: 'Error al obtener trámites' },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo trámite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label, key, description, active, required_docs } = body;

    // Validaciones
    if (!label || !key) {
      return NextResponse.json(
        { error: 'Label y key son requeridos' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // 1. Crear el trámite
    const { data: tramite, error: tramiteError } = await supabase
      .from('tramites')
      .insert({
        label,
        key,
        description,
        active: active !== undefined ? active : true,
      })
      .select()
      .single();

    if (tramiteError) {
      // Si es error de duplicado
      if (tramiteError.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe un trámite con esta clave' },
          { status: 409 }
        );
      }
      throw tramiteError;
    }

    // 2. Si hay documentos requeridos, crearlos
    if (required_docs && Array.isArray(required_docs) && required_docs.length > 0) {
      const docsToInsert = required_docs.map((doc_type: string) => ({
        tramite: key,
        document_type: doc_type,
      }));

      const { error: docsError } = await supabase
        .from('tramite_required_documents')
        .insert(docsToInsert);

      if (docsError) {
        // Rollback: eliminar el trámite creado
        await supabase.from('tramites').delete().eq('id', tramite.id);
        throw docsError;
      }
    }

    return NextResponse.json(tramite, { status: 201 });
  } catch (error) {
    console.error('Error al crear trámite:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error al crear trámite';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}