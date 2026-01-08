export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { sendNewCaseEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientEmail, tramite, tramite_key } = body;

    if (!clientEmail || !tramite || !tramite_key) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* ===============================
       CLIENTE
    =============================== */
    let clientId: string;

    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("email", clientEmail)
      .maybeSingle();

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: newClient, error } = await supabase
        .from("clients")
        .insert({ email: clientEmail })
        .select("id")
        .single();

      if (error || !newClient) {
        return NextResponse.json(
          { error: "Error creando cliente" },
          { status: 500 }
        );
      }

      clientId = newClient.id;
    }

    /* ===============================
       CASO
    =============================== */
    const { data: newCase, error: caseError } = await supabase
      .from("cases")
      .insert({
        client_id: clientId,
        tramite,
        tramite_key,
        status: "pending",
      })
      .select()
      .single();

    if (caseError || !newCase) {
      return NextResponse.json(
        { error: "Error creando el caso" },
        { status: 500 }
      );
    }

    /* ===============================
       TOKEN
    =============================== */
    const token = randomUUID();

    const { error: tokenError } = await supabase
      .from("access_tokens")
      .insert({
        token,
        case_id: newCase.id,
        used: false,
        expires_at: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 7
        ).toISOString(),
      });

    if (tokenError) {
      return NextResponse.json(
        { error: "Error creando token" },
        { status: 500 }
      );
    }

    /* ===============================
       EVENTO
    =============================== */
    await supabase.from("case_events").insert({
      case_id: newCase.id,
      type: "CASE_CREATED",
      description: "Caso creado por el administrador",
    });

    /* ===============================
       EMAIL CLIENTE (PORTAL)
    =============================== */
    try {
      await sendNewCaseEmail({
        to: clientEmail,
        tramite,
        token,
      });
    } catch (e) {
      console.error("EMAIL NEW CASE ERROR:", e);
    }

    revalidatePath("/admin/cases");

    return NextResponse.json({
      ok: true,
      caseId: newCase.id,
      token,
    });
  } catch {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
