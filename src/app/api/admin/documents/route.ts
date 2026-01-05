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
    .select(`
      id,
      document_type,
      file_path,
      file_name,
      mime_type,
      uploaded_at
    `)
    .eq("case_id", caseId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("DOCUMENTS ERROR:", error);
    return NextResponse.json(
      { error: "Error cargando documentos" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? [], {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
