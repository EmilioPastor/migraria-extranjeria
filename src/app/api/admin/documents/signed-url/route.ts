import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "filePath requerido" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .storage
      .from("case-documents")
      .createSignedUrl(filePath, 60 * 5); // 5 minutos

    if (error || !data?.signedUrl) {
      console.error("SIGNED URL ERROR:", error);
      return NextResponse.json(
        { error: "No se pudo generar la URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
