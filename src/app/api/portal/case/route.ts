import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Token requerido" },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  // 1️⃣ TOKEN
  const { data: tokenRow } = await supabase
    .from("access_tokens")
    .select("case_id, expires_at, used")
    .eq("token", token)
    .maybeSingle();

  if (
    !tokenRow ||
    tokenRow.used ||
    (tokenRow.expires_at &&
      new Date(tokenRow.expires_at) < new Date())
  ) {
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 401 }
    );
  }

  // 2️⃣ CASO (🔥 FIX AQUÍ)
  const { data: caseData } = await supabase
    .from("cases")
    .select("*") // 👈 CLAVE
    .eq("id", tokenRow.case_id)
    .maybeSingle();

  if (!caseData) {
    return NextResponse.json(
      { error: "Caso no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(caseData);
}
