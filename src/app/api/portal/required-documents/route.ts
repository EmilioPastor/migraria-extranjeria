import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tramiteKey = searchParams.get("tramite_key");

  if (!tramiteKey) {
    return NextResponse.json([]);
  }

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("tramite_required_documents")
    .select("document_type")
    .eq("tramite", tramiteKey);

  if (error) {
    console.error("REQUIRED DOCS ERROR:", error);
    return NextResponse.json([]);
  }

  return NextResponse.json(data ?? []);
}
