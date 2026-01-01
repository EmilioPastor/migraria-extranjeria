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

  // 1️⃣ Buscar el token en BD
  const { data: tokenData, error: tokenError } = await supabase
    .from("access_tokens")
    .select("id, case_id, expires_at, used")
    .eq("token", token)
    .single();

  if (tokenError || !tokenData) {
    return NextResponse.json(
      { error: "Token inválido" },
      { status: 401 }
    );
  }

  // 2️⃣ Expirado o usado
  if (
    tokenData.used ||
    (tokenData.expires_at &&
      new Date(tokenData.expires_at) < new Date())
  ) {
    return NextResponse.json(
      { error: "Token expirado o usado" },
      { status: 401 }
    );
  }

  // 3️⃣ Obtener el caso
  const { data: caseData } = await supabase
    .from("cases")
    .select("id, status")
    .eq("id", tokenData.case_id)
    .single();

  // 4️⃣ Si el caso existe pero NO está en pending → ERROR DE FLUJO
  if (caseData && caseData.status !== "pending") {
    return NextResponse.json(
      {
        error:
          "El caso no está en estado válido para subir documentación",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    valid: true,
    caseId: tokenData.case_id,
  });
}
