import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const supabase = supabaseAdmin();
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

    if (tokenRow.case_id !== caseId) {
      return NextResponse.json(
        { error: "Token no válido para este caso" },
        { status: 403 }
      );
    }

    /* ===============================
       2️⃣ NORMALIZAR NOMBRE
       =============================== */
    const safeFileName = file.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9._-]/g, "_");

    const timestamp = Date.now();
    const filePath = `${caseId}/${timestamp}-${safeFileName}`;

    /* ===============================
       3️⃣ MIME TYPE
       =============================== */
    const mimeType =
      file.type ||
      (safeFileName.endsWith(".pdf") && "application/pdf") ||
      (safeFileName.endsWith(".jpg") && "image/jpeg") ||
      (safeFileName.endsWith(".jpeg") && "image/jpeg") ||
      (safeFileName.endsWith(".png") && "image/png") ||
      (safeFileName.endsWith(".docx") &&
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
      "application/octet-stream";

    /* ===============================
       4️⃣ SUBIR A STORAGE
       =============================== */
    const { error: uploadError } = await supabase.storage
      .from("case-documents")
      .upload(filePath, file, {
        upsert: false,
        contentType: mimeType,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Error subiendo archivo" },
        { status: 500 }
      );
    }

    /* ===============================
       5️⃣ GUARDAR DOCUMENTO
       =============================== */
    const { error: dbError } = await supabase
      .from("case_documents")
      .insert({
        case_id: caseId,
        document_type: documentType,
        file_path: filePath,
        file_name: safeFileName,
        mime_type: mimeType,
      });

    if (dbError) {
      return NextResponse.json(
        { error: "Error guardando documento" },
        { status: 500 }
      );
    }

    /* ===============================
       6️⃣ EVENTO HISTORIAL
       =============================== */
    const { error: eventError } = await supabase
      .from("case_events")
      .insert({
        case_id: caseId,
        type: "DOCUMENT_UPLOADED",
        description: `Documento subido: ${documentType}`,
      });

    if (eventError) {
      return NextResponse.json(
        { error: "Error registrando evento" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("UPLOAD ERROR:", e);
    return NextResponse.json(
      { error: "Error inesperado" },
      { status: 500 }
    );
  }
}
