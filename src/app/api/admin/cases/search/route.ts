export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const status = searchParams.get('status');
    const clientEmail = searchParams.get('clientEmail');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const supabase = supabaseAdmin();

    let supabaseQuery = supabase
      .from('cases')
      .select(`
        id,
        tramite,
        status,
        created_at,
        updated_at,
        tramite_key,
        client_id,
        clients (
          email
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (query) {
      supabaseQuery = supabaseQuery.or(`tramite.ilike.%${query}%,tramite_key.ilike.%${query}%`);
    }

    if (status && status !== 'all') {
      supabaseQuery = supabaseQuery.eq('status', status);
    }

    // Búsqueda por email de cliente
    if (clientEmail) {
      const { data: clients } = await supabase
        .from('clients')
        .select('id')
        .ilike('email', `%${clientEmail}%`);

      const clientIds = clients?.map(c => c.id) || [];
      if (clientIds.length > 0) {
        supabaseQuery = supabaseQuery.in('client_id', clientIds);
      } else {
        // Si no hay clientes, devolver vacío
        return NextResponse.json({
          cases: [],
          total: 0,
          page,
          limit,
          pages: 0
        });
      }
    }

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    supabaseQuery = supabaseQuery.range(from, to);

    const { data: cases, error, count } = await supabaseQuery;

    if (error) {
      throw error;
    }

    // Procesar casos para obtener el email del cliente
    const processedCases = cases?.map(c => ({
      ...c,
      client_email: c.clients && c.clients.length > 0 ? c.clients[0].email : null
    })) || [];

    return NextResponse.json({
      cases: processedCases,
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return NextResponse.json(
      { error: 'Error en búsqueda' },
      { status: 500 }
    );
  }
}