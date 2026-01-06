export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logAdminAction } from "@/lib/logAdminAction";
import { documentosPorTramite } from "@/data/documentos";

export async function POST(req: Request) {
  try {
    const { caseId, status, adminEmail } = await req.json();

    if (!caseId || !status || !adminEmail) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* 1️⃣ Obtener el caso */
    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("id, tramite_key")
      .eq("id", caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: "Caso no encontrado" },
        { status: 404 }
      );
    }

    /* 2️⃣ Si se quiere pasar a in_review, comprobar documentos */
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
          {
            error:
              "No se pueden revisar documentos: faltan obligatorios",
          },
          { status: 400 }
        );
      }
    }

    /* 3️⃣ ACTUALIZAR ESTADO */
    const { error: updateError } = await supabase
      .from("cases")
      .update({ status })
      .eq("id", caseId);

    if (updateError) {
      return NextResponse.json(
        { error: "No se pudo actualizar el caso" },
        { status: 500 }
      );
    }

    /* 4️⃣ LOG */
    await logAdminAction(
      adminEmail,
      "CASE_STATUS_CHANGED",
      caseId,
      { status }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CASE STATUS ERROR:", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
