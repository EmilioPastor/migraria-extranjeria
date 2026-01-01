import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  sendClientInReviewEmail,
  sendAdminCaseReadyEmail,
} from "@/lib/email";

/**
 * POST /api/portal/upload
 * Marca un documento como entregado (sin archivo).
 * - Guarda en case_documents
 * - Comprueba documentos obligatorios (BD)
 * - Cambia automáticamente a in_review
 * - Genera logs
 * - Genera notificación admin
 * - Envía emails
 */
export async function POST(req: Request) {
  try {
    const { caseId, documentType } = (await req.json()) as {
      caseId?: string;
      documentType?: string;
    };

    /* ===============================
       VALIDACIONES
       =============================== */
    if (!caseId || !documentType) {
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
       2️⃣ REGISTRAR DOCUMENTO (SIN ARCHIVO)
       =============================== */
    const { error: upsertError } = await supabase
      .from("case_documents")
      .upsert(
        {
          case_id: caseId,
          document_type: documentType,
        },
        { onConflict: "case_id,document_type" }
      );

    if (upsertError) {
      console.error("UPSERT DOC ERROR:", upsertError);
      return NextResponse.json(
        { error: "No se pudo registrar el documento" },
        { status: 500 }
      );
    }

    /* 🔔 LOG: DOCUMENTO ENTREGADO */
    await supabase.from("admin_actions").insert({
      admin_email: "system",
      action: "DOCUMENT_UPLOADED",
      target: caseId,
      meta: { document: documentType },
    });

    /* ===============================
       3️⃣ DOCUMENTOS OBLIGATORIOS (BD)
       =============================== */
    const { data: requiredDocs, error: reqErr } = await supabase
      .from("tramite_required_documents")
      .select("document_type")
      .eq("tramite", caseData.tramite_key);

    if (reqErr) {
      console.error("REQUIRED DOCS ERROR:", reqErr);
      return NextResponse.json(
        { error: "Error comprobando documentos" },
        { status: 500 }
      );
    }

    const required =
      requiredDocs?.map((d) => d.document_type) ?? [];

    /* ===============================
       4️⃣ DOCUMENTOS YA REGISTRADOS
       =============================== */
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
       5️⃣ CAMBIO AUTOMÁTICO A in_review
       =============================== */
    if (allRequiredUploaded) {
      await supabase
        .from("cases")
        .update({ status: "in_review" })
        .eq("id", caseId);

      /* 🔔 LOG */
      await supabase.from("admin_actions").insert({
        admin_email: "system",
        action: "CASE_AUTO_IN_REVIEW",
        target: caseId,
        meta: {
          required_documents: required,
          uploaded_documents: uploaded,
        },
      });

      /* 🔔 NOTIFICACIÓN ADMIN */
      await supabase.from("admin_notifications").insert({
        type: "case_ready_for_review",
        title: "Caso listo para revisión",
        message:
          "Un cliente ha entregado toda la documentación obligatoria.",
        case_id: caseId,
      });

      /* 📧 EMAILS */
      if (caseData.client_email) {
        await sendClientInReviewEmail(caseData.client_email);
      }
      await sendAdminCaseReadyEmail(caseId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
