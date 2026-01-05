import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");

  if (!caseId) {
    return NextResponse.json(
      { error: "caseId requerido" },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("case_documents")
    .select("document_type")
    .eq("case_id", caseId);

  if (error) {
    return NextResponse.json(
      { error: "Error cargando documentos subidos" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}
