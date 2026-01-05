import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("CREATE CASE BODY 👉", body);

  const { clientEmail, tramite, tramite_key } = body;

  if (!clientEmail || !tramite || !tramite_key) {
    return NextResponse.json(
      { error: "Datos incompletos", body },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  // CLIENTE
  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("email", clientEmail)
    .single();

  let clientId = existing?.id;

  if (!clientId) {
    const { data: newClient } = await supabase
      .from("clients")
      .insert({ email: clientEmail })
      .select()
      .single();

    clientId = newClient.id;
  }

  // CASO
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

  if (caseError) {
    return NextResponse.json(
      { error: "Error creando caso" },
      { status: 500 }
    );
  }

  // TOKEN
  const token = randomUUID();

  await supabase.from("access_tokens").insert({
    token,
    case_id: caseData.id,
    expires_at: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    ),
  });

  return NextResponse.json({ ok: true });
}
