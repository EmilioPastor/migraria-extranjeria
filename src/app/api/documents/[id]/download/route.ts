import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logAdminAction } from "@/lib/logAdminAction";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = supabaseAdmin();
  const documentId = params.id;

  const { data: doc, error } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", documentId)
    .single();

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
    `attachment; filename="${doc.file_path.split("/").pop()}"`
  );
  headers.set("Content-Type", fileData.type);

  return new NextResponse(fileData.stream(), { headers });
}
