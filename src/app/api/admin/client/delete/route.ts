export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logAdminAction } from "@/lib/logAdminAction";

export async function DELETE(req: Request) {
  try {
    const { caseId, adminEmail } = await req.json();

    if (!caseId || !adminEmail) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* 1️⃣ Obtener case + client */
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("id, client_id")
      .eq("id", caseId)
      .single();

    if (caseError || !caseData?.client_id) {
      return NextResponse.json(
        { error: "Caso no encontrado" },
        { status: 404 }
      );
    }

    /* 2️⃣ Eliminar caso */
    const { error: caseDeleteError } = await supabase
      .from("cases")
      .delete()
      .eq("id", caseId);

    if (caseDeleteError) {
      return NextResponse.json(
        { error: "No se pudo eliminar el expediente" },
        { status: 500 }
      );
    }

    /* 3️⃣ Eliminar cliente */
    const { error: clientDeleteError } = await supabase
      .from("clients")
      .delete()
      .eq("id", caseData.client_id);

    if (clientDeleteError) {
      return NextResponse.json(
        { error: "No se pudo eliminar el cliente" },
        { status: 500 }
      );
    }

    /* 4️⃣ Log */
    await logAdminAction(
      adminEmail,
      "CLIENT_DELETED",
      caseId,
      {}
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CLIENT DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
