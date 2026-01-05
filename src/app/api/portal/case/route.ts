import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

  /* ===============================
     1️⃣ VALIDAR TOKEN
     =============================== */
  const { data: tokenData, error: tokenError } = await supabase
    .from("access_tokens")
    .select("case_id, expires_at, used")
    .eq("token", token)
    .single();

  console.log("TOKEN DATA 👉", tokenData);

  if (
    tokenError ||
    !tokenData ||
    tokenData.used ||
    (tokenData.expires_at &&
      new Date(tokenData.expires_at) < new Date())
  ) {
    return NextResponse.json(
      { error: "Token inválido o expirado" },
      { status: 401 }
    );
  }

  /* ===============================
     2️⃣ OBTENER CASO (SIN RELACIONES)
     =============================== */
  const { data: caseData, error: caseError } = await supabase
    .from("cases")
    .select("*")
    .eq("id", tokenData.case_id)
    .maybeSingle(); // 🔥 CLAVE

  console.log("CASE DATA 👉", caseData);

  if (caseError || !caseData) {
    return NextResponse.json(
      { error: "Caso no encontrado" },
      { status: 404 }
    );
  }

  /* ===============================
     3️⃣ RESPUESTA OK
     =============================== */
  return NextResponse.json(caseData);
}
