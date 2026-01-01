import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  sendClientInReviewEmail,
  sendAdminCaseReadyEmail,
} from "@/lib/email";

/**
 * POST /api/portal/upload-file
 * Subida REAL de archivos para un caso.
 *
 * Flujo:
 * 1) Valida caso y estado
 * 2) Sube archivo a Supabase Storage (privado)
 * 3) Guarda metadatos en case_documents
 * 4) Log de subida
 * 5) Comprueba documentos obligatorios (BD)
 * 6) Cambia a in_review si procede
 * 7) Logs + notificación + emails
 */
export async function POST(req: Request) {
  try {
    /* ===============================
       LEER FORMDATA
       =============================== */
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const caseId = formData.get("caseId") as string | null;
    const documentType = formData.get("documentType") as string | null;

    if (!file || !caseId || !documentType) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* ===============================
       1️⃣ VALIDAR CASO
       =============================== */
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("id, status, tramite_key, client_email")
      .eq("id", caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: "Caso no encontrado" },
        { status: 404 }
      );
    }

    if (caseData.status !== "pending") {
      return NextResponse.json(
        { error: "El caso no admite más documentos" },
        { status: 403 }
      );
    }

    /* ===============================
       2️⃣ SUBIR A STORAGE (PRIVADO)
       =============================== */
    const ext = file.name.split(".").pop();
    const filePath = `${caseId}/${documentType}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: storageError } = await supabase
      .storage
      .from("case-documents")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (storageError) {
      console.error("STORAGE ERROR:", storageError);
      return NextResponse.json(
        { error: "Error subiendo archivo" },
        { status: 500 }
      );
    }

    /* ===============================
       3️⃣ GUARDAR METADATOS EN BD
       =============================== */
    const { error: docError } = await supabase
      .from("case_documents")
      .upsert(
        {
          case_id: caseId,
          document_type: documentType,
          file_path: filePath,
          file_name: file.name,
          mime_type: file.type,
        },
        { onConflict: "case_id,document_type" }
      );

    if (docError) {
      console.error("DOC METADATA ERROR:", docError);
      return NextResponse.json(
        { error: "Error guardando metadatos" },
        { status: 500 }
      );
    }

    /* ===============================
       4️⃣ LOG: DOCUMENTO SUBIDO
       =============================== */
    await supabase.from("admin_actions").insert({
      admin_email: "system",
      action: "DOCUMENT_FILE_UPLOADED",
      target: caseId,
      meta: {
        document: documentType,
        file: file.name,
      },
    });

    /* ===============================
       5️⃣ COMPROBAR DOCUMENTOS OBLIGATORIOS
       =============================== */
    const { data: requiredDocs } = await supabase
      .from("tramite_required_documents")
      .select("document_type")
      .eq("tramite", caseData.tramite_key);

    const required =
      requiredDocs?.map((d) => d.document_type) ?? [];

    const { data: uploadedDocs } = await supabase
      .from("case_documents")
      .select("document_type")
      .eq("case_id", caseId);

    const uploaded =
      uploadedDocs?.map((d) => d.document_type) ?? [];

    const allRequiredUploaded =
      required.length === 0 ||
      required.every((doc) => uploaded.includes(doc));

    /* ===============================
       6️⃣ CAMBIO AUTOMÁTICO A in_review
       =============================== */
    if (allRequiredUploaded) {
      await supabase
        .from("cases")
        .update({ status: "in_review" })
        .eq("id", caseId);

      /* LOG */
      await supabase.from("admin_actions").insert({
        admin_email: "system",
        action: "CASE_AUTO_IN_REVIEW",
        target: caseId,
        meta: {
          required_documents: required,
          uploaded_documents: uploaded,
        },
      });

      /* NOTIFICACIÓN ADMIN */
      await supabase.from("admin_notifications").insert({
        type: "case_ready_for_review",
        title: "Caso listo para revisión",
        message:
          "Un cliente ha subido toda la documentación obligatoria.",
        case_id: caseId,
      });

      /* EMAILS */
      if (caseData.client_email) {
        await sendClientInReviewEmail(caseData.client_email);
      }

      await sendAdminCaseReadyEmail(caseId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("UPLOAD-FILE ERROR:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
