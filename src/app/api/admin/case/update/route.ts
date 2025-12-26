import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { caseId, status, message } = await req.json();
  const supabase = supabaseAdmin();

  await supabase
    .from("cases")
    .update({ status, message })
    .eq("id", caseId);

  return NextResponse.json({ ok: true });
}
