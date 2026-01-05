import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get("caseId");

    if (!caseId) {
      return NextResponse.json([], { status: 200 });
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("case_documents")
      .select("document_type")
      .eq("case_id", caseId);

    if (error) {
      console.error("FETCH DOCS ERROR:", error);
      return NextResponse.json([], { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("DOCUMENTS API CRASH:", err);
    return NextResponse.json([], { status: 500 });
  }
}
