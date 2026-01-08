export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseService } from "@/lib/supabaseService";
import { logAdminAction } from "@/lib/logAdminAction";
import { requireAdminApi } from "@/lib/requireAdminApi";

export async function DELETE(req: Request) {
  try {
    /* 🔐 1️⃣ Verificación de admin REAL */
    const auth = await requireAdminApi(req);

    if ("error" in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const { user, admin } = auth;

    /* 📦 2️⃣ Body */
    const { caseId } = await req.json();

    if (!caseId) {
      return NextResponse.json(
        { error: "caseId requerido" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* 🔍 3️⃣ Obtener caso + cliente (lectura normal) */
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

    /* 🗑️ 4️⃣ Eliminar caso (SERVICE ROLE → bypass RLS) */
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

    /* 🗑️ 5️⃣ Eliminar cliente (SERVICE ROLE → bypass RLS) */
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

    /* 🧾 6️⃣ Log inmutable */
    await logAdminAction(
      user.email ?? "unknown",
      "CLIENT_DELETED",
      caseId,
      {
        role: admin.role,
      }
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
