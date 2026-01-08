export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseService } from "@/lib/supabaseService";
import { logAdminAction } from "@/lib/logAdminAction";

export async function DELETE(req: Request) {
  try {
    /* 📦 Body */
    const { caseId } = await req.json();

    if (!caseId) {
      return NextResponse.json(
        { error: "caseId requerido" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* 🔍 1️⃣ Obtener caso + cliente */
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

    /* 🗑️ 2️⃣ Eliminar caso */
    const { error: caseDeleteError } = await supabaseService
      .from("cases")
      .delete()
      .eq("id", caseId);

    if (caseDeleteError) {
      console.error("CASE DELETE ERROR:", caseDeleteError);
      return NextResponse.json(
        { error: "No se pudo eliminar el expediente" },
        { status: 500 }
      );
    }

    /* 🗑️ 3️⃣ Eliminar cliente */
    const { error: clientDeleteError } = await supabaseService
      .from("clients")
      .delete()
      .eq("id", caseData.client_id);

    if (clientDeleteError) {
      console.error("CLIENT DELETE ERROR:", clientDeleteError);
      return NextResponse.json(
        { error: "No se pudo eliminar el cliente" },
        { status: 500 }
      );
    }

    /* 🧾 4️⃣ Log (sin email por ahora) */
    await logAdminAction(
      "admin",
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
