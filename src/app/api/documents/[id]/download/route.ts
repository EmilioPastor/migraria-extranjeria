import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logAdminAction } from "@/lib/logAdminAction";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = supabaseAdmin();
  const documentId = params.id;

  if (!documentId) {
    return NextResponse.json(
      { error: "ID requerido" },
      { status: 400 }
    );
  }

  const { data: doc, error } = await supabase
    .from("case_documents")
    .select("file_path, file_name, mime_type")
    .eq("id", documentId)
    .maybeSingle();

  if (error || !doc) {
    return NextResponse.json(
      { error: "Documento no encontrado" },
      { status: 404 }
    );
  }

  const { data: fileData, error: downloadError } =
    await supabase.storage
      .from("case-documents")
      .download(doc.file_path);

  if (downloadError || !fileData) {
    return NextResponse.json(
      { error: "Error descargando archivo" },
      { status: 500 }
    );
  }

  await logAdminAction(
    "admin@migraria.es",
    "DOCUMENT_DOWNLOADED",
    documentId,
    { path: doc.file_path }
  );

  const headers = new Headers();
  headers.set(
    "Content-Disposition",
    `attachment; filename="${doc.file_name ?? "documento"}"`
  );
  headers.set(
    "Content-Type",
    doc.mime_type ?? "application/octet-stream"
  );

  return new NextResponse(fileData.stream(), { headers });
}
