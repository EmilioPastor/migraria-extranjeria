import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
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

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `${caseId}/${fileName}`; // 🔥 ESTA ES LA RUTA ÚNICA

  const { error: uploadError } = await supabase.storage
    .from("case-documents")
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error(uploadError);
    return NextResponse.json(
      { error: "Error subiendo archivo" },
      { status: 500 }
    );
  }

  await supabase.from("documents").insert({
    case_id: caseId,
    document_type: documentType,
    file_path: filePath, // 🔥 MISMA RUTA
  });

  return NextResponse.json({ ok: true });
}
