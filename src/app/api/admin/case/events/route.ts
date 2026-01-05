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
    .from("case_events")
    .select(`
      id,
      type,
      description,
      created_at
    `)
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("EVENTS ERROR:", error);
    return NextResponse.json(
      { error: "Error cargando eventos" },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? [], {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
