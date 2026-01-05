import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tramite = searchParams.get("tramite");

  if (!tramite) {
    return NextResponse.json(
      { error: "Trámite requerido" },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("tramite_required_documents")
    .select("document_type")
    .eq("tramite", tramite);

  if (error) {
    console.error("Error cargando documentos requeridos:", error);
    return NextResponse.json(
      { error: "Error cargando documentos" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}
