export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token requerido" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* 1️⃣ Resolver token → case_id */
    const { data: tokenData, error: tokenError } = await supabase
      .from("access_tokens")
      .select("case_id")
      .eq("token", token)
      .single();

    if (tokenError || !tokenData?.case_id) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 404 }
      );
    }

    const caseId = tokenData.case_id;

    /* 2️⃣ Obtener el caso */
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select(`
        id,
        tramite,
        tramite_key,
        status,
        created_at,
        updated_at
      `)
      .eq("id", caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: "Expediente no encontrado" },
        { status: 404 }
      );
    }

    /* 3️⃣ Última evaluación (si existe) */
    const { data: evaluation } = await supabase
      .from("evaluations")
      .select("result, message, evaluated_at")
      .eq("case_id", caseId)
      .order("evaluated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      case: {
        ...caseData,
        evaluation: evaluation || null,
      },
    });
  } catch (err) {
    console.error("PORTAL CASE ERROR:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
