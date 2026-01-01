import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendClientAccessEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const {
      clientEmail,
      tramite,
      tramite_key,
    } = await req.json();

    if (!clientEmail || !tramite || !tramite_key) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* ======================================================
       1️⃣ OBTENER O CREAR CLIENTE
       ====================================================== */
    const { data: existingClient } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", clientEmail)
      .single();

    let clientId = existingClient?.id;

    if (!clientId) {
      const { data: newClient, error: clientError } =
        await supabase
          .from("profiles")
          .insert({ email: clientEmail })
          .select()
          .single();

      if (clientError || !newClient) {
        console.error(clientError);
        return NextResponse.json(
          { error: "No se pudo crear el cliente" },
          { status: 500 }
        );
      }

      clientId = newClient.id;
    }

    /* ======================================================
       2️⃣ CREAR CASO
       ====================================================== */
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
        { error: "No se pudo crear el caso" },
        { status: 500 }
      );
    }

    /* ======================================================
       3️⃣ CREAR TOKEN DE ACCESO
       ====================================================== */
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
        { error: "No se pudo crear el acceso" },
        { status: 500 }
      );
    }

    /* ======================================================
       4️⃣ EMAIL AL CLIENTE
       ====================================================== */
    await sendClientAccessEmail(clientEmail, token);

    return NextResponse.json({
      ok: true,
      clientId,
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
