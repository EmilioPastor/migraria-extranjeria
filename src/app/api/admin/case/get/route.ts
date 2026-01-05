import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* 1️⃣ OBTENER CASO (SIN message) */
    const { data, error } = await supabase
      .from("cases")
      .select("id, tramite, tramite_key, status, client_id, created_at")
      .eq("id", id);

    if (error) {
      console.error("CASE ERROR:", error);
      return NextResponse.json(
        { error: "Error cargando caso" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Caso no encontrado" },
        { status: 404 }
      );
    }

    const caseData = data[0];

    /* 2️⃣ OBTENER EMAIL CLIENTE */
    let clientEmail: string | null = null;

    if (caseData.client_id) {
      const { data: clientData } = await supabase
        .from("clients")
        .select("email")
        .eq("id", caseData.client_id);

      if (clientData && clientData.length > 0) {
        clientEmail = clientData[0].email;
      }
    }

    /* 3️⃣ RESPUESTA FINAL */
    return NextResponse.json({
      id: caseData.id,
      tramite: caseData.tramite,
      tramite_key: caseData.tramite_key,
      status: caseData.status,
      created_at: caseData.created_at,
      client: {
        email: clientEmail,
      },
    });
  } catch (err) {
    console.error("GET CASE ERROR:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
