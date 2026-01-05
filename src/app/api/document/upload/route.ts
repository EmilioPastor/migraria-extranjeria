import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
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

    /* ===============================
       1️⃣ VALIDAR TOKEN
       =============================== */
    const { data: tokenData, error: tokenError } = await supabase
      .from("access_tokens")
      .select("id, expires_at, used")
      .eq("token", token)
      .single();

    if (
      tokenError ||
      !tokenData ||
      tokenData.used ||
      new Date(tokenData.expires_at) < new Date()
    ) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    /* ===============================
       2️⃣ SUBIR ARCHIVO
       =============================== */
    const filePath = `${caseId}/${documentType}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("case-documents")
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      console.error("UPLOAD ERROR:", uploadError);
      return NextResponse.json(
        { error: "Error subiendo archivo" },
        { status: 500 }
      );
    }

    /* ===============================
       3️⃣ GUARDAR EN DB (TABLA CORRECTA)
       =============================== */
    const { error: dbError } = await supabase
      .from("case_documents")
      .insert({
        case_id: caseId,
        document_type: documentType,
        file_path: filePath,
        file_name: file.name,
        mime_type: file.type,
      });

    if (dbError) {
      console.error("DB ERROR:", dbError);
      return NextResponse.json(
        { error: "Error guardando documento" },
        { status: 500 }
      );
    }

    /* ===============================
       4️⃣ EVENTO + CAMBIO DE ESTADO
       =============================== */
    await supabase.from("case_events").insert({
      case_id: caseId,
      type: "DOCUMENT_UPLOADED",
      description: `Documento ${documentType} subido por el cliente`,
    });

    await supabase
      .from("cases")
      .update({ status: "in_review" })
      .eq("id", caseId)
      .eq("status", "pending");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Error inesperado" },
      { status: 500 }
    );
  }
}
