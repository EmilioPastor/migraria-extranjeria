import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { createObjectCsvStringifier } from 'csv-writer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    const supabase = supabaseAdmin();

    // Construir query
    let query = supabase
      .from('cases')
      .select(`
        id,
        tramite,
        tramite_key,
        status,
        created_at,
        updated_at,
        clients (
          email
        )
      `)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (startDate) {
      query = query.gte('created_at', `${startDate}T00:00:00`);
    }
    if (endDate) {
      query = query.lte('created_at', `${endDate}T23:59:59`);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: cases, error } = await query;

    if (error) {
      throw error;
    }

    // Transformar datos
    const exportData = cases?.map(c => {
      const clientEmail = c.clients && c.clients.length > 0 
        ? c.clients[0].email 
        : 'N/A';
      
      return {
        id: c.id,
        tramite: c.tramite,
        tramite_key: c.tramite_key,
        status: c.status,
        cliente_email: clientEmail,
        fecha_creacion: new Date(c.created_at).toLocaleString('es-ES'),
        fecha_actualizacion: new Date(c.updated_at).toLocaleString('es-ES'),
        estado_formateado: 
          c.status === 'pending' ? 'Pendiente' :
          c.status === 'in_review' ? 'En revisión' :
          c.status === 'favorable' ? 'Favorable' : 'No favorable'
      };
    }) || [];

    if (format === 'json') {
      return NextResponse.json(exportData, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="casos.json"',
        },
      });
    }

    // CSV
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'tramite', title: 'Trámite' },
        { id: 'tramite_key', title: 'Clave Trámite' },
        { id: 'estado_formateado', title: 'Estado' },
        { id: 'cliente_email', title: 'Email Cliente' },
        { id: 'fecha_creacion', title: 'Fecha Creación' },
        { id: 'fecha_actualizacion', title: 'Fecha Actualización' },
      ]
    });

    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(exportData);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="casos.csv"',
      },
    });
  } catch (error) {
    console.error('Error en exportación de casos:', error);
    return NextResponse.json(
      { error: 'Error al exportar casos' },
      { status: 500 }
    );
  }
}