export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { caseId, status, message } = body;

    if (!caseId || !status) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* ACTUALIZAR CASO */
    const { error: updateError } = await supabase
      .from("cases")
      .update({
        status,
        message: message ?? null,
      })
      .eq("id", caseId);

    if (updateError) {
      console.error("UPDATE CASE ERROR:", updateError);
      return NextResponse.json(
        { error: "Error actualizando el caso" },
        { status: 500 }
      );
    }

    /* EVENTO */
    const { error: eventError } = await supabase
      .from("case_events")
      .insert({
        case_id: caseId,
        type: "STATUS_CHANGED",
        description: message ?? null,
      });

    if (eventError) {
      console.error("EVENT ERROR:", eventError);
    }

    /* INVALIDAR CACHE */
    revalidatePath("/admin/cases");
    revalidatePath(`/admin/case/${caseId}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CASE UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
