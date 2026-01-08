export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logAdminAction } from "@/lib/logAdminAction";
import { documentosPorTramite } from "@/data/documentos";
import { sendEvaluationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { caseId, status, adminEmail, message } = body;

    if (!caseId || !status) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* 1️⃣ Obtener caso */
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("id, tramite_key, client_id")
      .eq("id", caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: "Caso no encontrado" },
        { status: 404 }
      );
    }

    /* 2️⃣ Validación documentos */
    if (status === "in_review") {
      const tramiteKey =
        caseData.tramite_key as keyof typeof documentosPorTramite;

      const requiredDocs =
        documentosPorTramite[tramiteKey]
          ?.filter((d) => d.required)
          .map((d) => d.id) ?? [];

      const { data: uploadedDocs } = await supabase
        .from("case_documents")
        .select("document_type")
        .eq("case_id", caseId);

      const uploaded =
        uploadedDocs?.map((d) => d.document_type) ?? [];

      const allRequiredUploaded = requiredDocs.every((doc) =>
        uploaded.includes(doc)
      );

      if (!allRequiredUploaded) {
        return NextResponse.json(
          { error: "Faltan documentos obligatorios" },
          { status: 400 }
        );
      }
    }

    /* 3️⃣ Actualizar estado */
    const { error: updateError } = await supabase
      .from("cases")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", caseId);

    if (updateError) {
      return NextResponse.json(
        { error: "No se pudo actualizar el caso" },
        { status: 500 }
      );
    }

    /* 4️⃣ Guardar evaluación */
    let evaluationInserted = false;

    if (status === "favorable" || status === "not_favorable") {
      const { error } = await supabase
        .from("evaluations")
        .insert({
          case_id: caseId,
          result: status,
          message: message || null,
          evaluated_at: new Date().toISOString(),
        });

      if (error) {
        console.error("❌ EVALUATION ERROR:", error);
        return NextResponse.json(
          { error: "No se pudo guardar la evaluación" },
          { status: 500 }
        );
      }

      evaluationInserted = true;
    }

    /* 5️⃣ Email del cliente */
    const { data: clientData } = await supabase
      .from("clients")
      .select("email")
      .eq("id", caseData.client_id)
      .single();

    /* 6️⃣ Token activo (SIN order by) */
    const { data: tokenData } = await supabase
      .from("access_tokens")
      .select("token")
      .eq("case_id", caseId)
      .eq("used", false)
      .limit(1)
      .maybeSingle();

    console.log("DEBUG evaluationInserted:", evaluationInserted);
    console.log("DEBUG clientEmail:", clientData?.email);
    console.log("DEBUG token:", tokenData?.token);

    /* 7️⃣ Enviar email */
    if (
      evaluationInserted &&
      clientData?.email &&
      tokenData?.token
    ) {
      console.log("📧 ENVIANDO EMAIL EVALUACIÓN A:", clientData.email);

      await sendEvaluationEmail({
        to: clientData.email,
        result: status,
        message,
        token: tokenData.token,
      });

      console.log("✅ EMAIL DE EVALUACIÓN ENVIADO");
    }

    /* 8️⃣ Log admin */
    if (adminEmail) {
      await logAdminAction(
        adminEmail,
        "CASE_STATUS_CHANGED",
        caseId,
        { status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ CASE STATUS ERROR:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
