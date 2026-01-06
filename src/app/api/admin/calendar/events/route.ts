export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // YYYY-MM
    const year = searchParams.get('year');

    const supabase = supabaseAdmin();

    let query = supabase
      .from('cases')
      .select(`
        id,
        tramite,
        status,
        created_at,
        updated_at,
        clients (
          email
        )
      `)
      .order('created_at', { ascending: false });

    // Filtrar por mes/año si se especifica
    if (month && year) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(year), parseInt(month), 0)
        .toISOString()
        .split('T')[0];

      query = query
        .gte('created_at', `${startDate}T00:00:00`)
        .lte('created_at', `${endDate}T23:59:59`);
    } else {
      // Últimos 30 días por defecto
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      query = query.gte('created_at', thirtyDaysAgo.toISOString());
    }

    const { data: cases, error } = await query;

    if (error) {
      throw error;
    }

    // Formatear para calendario - CORRECCIÓN: clients es un array
    const events = cases?.map(c => {
      const clientEmail = c.clients && c.clients.length > 0 
        ? c.clients[0].email 
        : null;
      
      const date = new Date(c.created_at);
      return {
        id: c.id,
        title: `${c.tramite} - ${clientEmail?.split('@')[0] || 'Cliente'}`,
        start: date.toISOString(),
        end: date.toISOString(),
        allDay: true,
        color: 
          c.status === 'pending' ? '#3b82f6' : // blue
          c.status === 'in_review' ? '#f59e0b' : // amber
          c.status === 'favorable' ? '#10b981' : // emerald
          '#ef4444', // red
        extendedProps: {
          caseId: c.id,
          status: c.status,
          clientEmail: clientEmail,
          tramite: c.tramite,
        }
      };
    }) || [];

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error en calendario:', error);
    return NextResponse.json(
      { error: 'Error al obtener eventos' },
      { status: 500 }
    );
  }
}