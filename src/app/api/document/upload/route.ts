import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer(); // ✅ instancia correcta

    const formData = await req.formData();

    const token = formData.get("token") as string | null;
    const caseId = formData.get("caseId") as string | null;
    const documentType = formData.get("documentType") as string | null;
    const file = formData.get("file") as File | null;

    if (!token || !caseId || !documentType || !file) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // 1️⃣ Validar token
    const { data: tokenData } = await supabase
      .from("access_tokens")
      .select("id, expires_at, used")
      .eq("token", token)
      .single();

    if (
      !tokenData ||
      tokenData.used ||
      new Date(tokenData.expires_at) < new Date()
    ) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    // 2️⃣ Subir archivo a Storage privado
    const filePath = `${caseId}/${documentType}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("case-documents")
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      return NextResponse.json(
        { error: "Error subiendo archivo" },
        { status: 500 }
      );
    }

    // 3️⃣ Guardar referencia en DB
    const { error: dbError } = await supabase
      .from("documents")
      .insert({
        case_id: caseId,
        document_type: documentType,
        file_path: filePath,
      });

    if (dbError) {
      return NextResponse.json(
        { error: "Error guardando documento" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Error inesperado" },
      { status: 500 }
    );
  }
}
