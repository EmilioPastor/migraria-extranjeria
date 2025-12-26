import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");

  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("documents")
    .select("id, document_type")
    .eq("case_id", caseId);

  return NextResponse.json(data || []);
}
