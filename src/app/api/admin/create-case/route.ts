import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendClientAccessEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const {
      clientEmail,
      clientId,
      tramite,
      tramite_key,
    } = await req.json();

    if (!clientEmail || !clientId || !tramite || !tramite_key) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* ===============================
       CREAR CASO
       =============================== */
    const { data: caseData, error: caseError } =
      await supabase
        .from("cases")
        .insert({
          client_id: clientId,
          tramite,
          tramite_key,
          status: "pending",
        })
        .select()
        .single();

    if (caseError || !caseData) {
      console.error(caseError);
      return NextResponse.json(
        { error: "Error creando el caso" },
        { status: 500 }
      );
    }

    /* ===============================
       CREAR TOKEN (UUID NATIVO)
       =============================== */
    const token = crypto.randomUUID();

    const { error: tokenError } = await supabase
      .from("access_tokens")
      .insert({
        token,
        case_id: caseData.id,
        expires_at: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 7
        ),
      });

    if (tokenError) {
      console.error(tokenError);
      return NextResponse.json(
        { error: "Error creando token" },
        { status: 500 }
      );
    }

    /* ===============================
       EMAIL CLIENTE
       =============================== */
    await sendClientAccessEmail(clientEmail, token);

    return NextResponse.json({
      ok: true,
      caseId: caseData.id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
