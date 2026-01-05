import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { caseId, status, message } = await req.json();

  const supabase = supabaseAdmin();

  /* 1️⃣ Actualizar caso */
  await supabase
    .from("cases")
    .update({
      status,
      message,
      updated_at: new Date(),
    })
    .eq("id", caseId);

  /* 2️⃣ Registrar evento */
  await supabase.from("case_events").insert({
    case_id: caseId,
    type: "STATUS_CHANGED",
    description: `Estado cambiado a: ${status}`,
  });

  return NextResponse.json({ ok: true });
}
