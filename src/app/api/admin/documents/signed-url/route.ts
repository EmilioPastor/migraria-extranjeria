import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { filePath } = await req.json();

  console.log("SIGNED URL BODY 👉", { filePath });

  if (!filePath) {
    return NextResponse.json(
      { error: "filePath requerido" },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  const { data, error } = await supabase.storage
    .from("case-documents")
    .createSignedUrl(filePath, 60);

  if (error || !data?.signedUrl) {
    console.error("Error creando signed URL:", error);
    return NextResponse.json(
      { error: "No se pudo abrir el archivo" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.signedUrl });
}
