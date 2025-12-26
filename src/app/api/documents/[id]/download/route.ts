import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseServer(); // ✅ instancia correcta
    const documentId = params.id;

    // 1️⃣ Obtener documento
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

    // 2️⃣ Descargar archivo desde Storage (privado)
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

    // 3️⃣ Enviar archivo como stream
    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${doc.file_path.split("/").pop()}"`
    );
    headers.set("Content-Type", fileData.type);

    return new NextResponse(fileData.stream(), { headers });
  } catch {
    return NextResponse.json(
      { error: "Error inesperado" },
      { status: 500 }
    );
  }
}
