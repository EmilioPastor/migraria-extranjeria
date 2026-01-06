export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server'; // Removido NextRequest
import { createObjectCsvStringifier } from 'csv-writer';

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    // Obtener clientes con estadísticas
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, email, created_at')
      .order('created_at', { ascending: false });

    if (clientsError) throw clientsError;

    // Obtener casos por cliente
    const clientIds = clients?.map(c => c.id) || [];
    const { data: cases } = await supabase
      .from('cases')
      .select('client_id, status')
      .in('client_id', clientIds);

    // Procesar estadísticas
    const exportData = clients?.map(client => {
      const clientCases = cases?.filter(c => c.client_id === client.id) || [];
      const stats = {
        total: clientCases.length,
        pending: clientCases.filter(c => c.status === 'pending').length,
        in_review: clientCases.filter(c => c.status === 'in_review').length,
        favorable: clientCases.filter(c => c.status === 'favorable').length,
        not_favorable: clientCases.filter(c => c.status === 'not_favorable').length,
      };

      return {
        id: client.id,
        email: client.email,
        fecha_registro: new Date(client.created_at).toLocaleString('es-ES'),
        total_casos: stats.total,
        casos_pendientes: stats.pending,
        casos_revision: stats.in_review,
        casos_favorables: stats.favorable,
        casos_no_favorables: stats.not_favorable,
        tasa_exito: stats.total > 0 ? ((stats.favorable / stats.total) * 100).toFixed(2) + '%' : '0%'
      };
    }) || [];

    // CSV
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'email', title: 'Email' },
        { id: 'fecha_registro', title: 'Fecha Registro' },
        { id: 'total_casos', title: 'Total Casos' },
        { id: 'casos_pendientes', title: 'Casos Pendientes' },
        { id: 'casos_favorables', title: 'Casos Favorables' },
        { id: 'tasa_exito', title: 'Tasa de Éxito' },
      ]
    });

    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(exportData);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="clientes.csv"',
      },
    });
  } catch (error) {
    console.error('Error en exportación de clientes:', error);
    return NextResponse.json(
      { error: 'Error al exportar clientes' },
      { status: 500 }
    );
  }
}