export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logAdminAction } from "@/lib/logAdminAction";

export async function POST(req: Request) {
    try {
        const { caseId, email, tramite, tramite_key, adminEmail } =
            await req.json();

        if (!caseId || !email || !tramite || !tramite_key || !adminEmail) {
            return NextResponse.json(
                { error: "Datos incompletos" },
                { status: 400 }
            );
        }

        const supabase = supabaseAdmin();

        /* 1️⃣ Obtener case + client */
        const { data: caseData, error: caseError } = await supabase
            .from("cases")
            .select("id, client_id")
            .eq("id", caseId)
            .single();

        if (caseError || !caseData?.client_id) {
            return NextResponse.json(
                { error: "Caso o cliente no encontrado" },
                { status: 404 }
            );
        }

        /* 2️⃣ Actualizar cliente */
        const { error: clientError } = await supabase
            .from("clients")
            .update({ email })
            .eq("id", caseData.client_id);

        if (clientError) {
            return NextResponse.json(
                { error: "No se pudo actualizar el cliente" },
                { status: 500 }
            );
        }

        /* 3️⃣ Actualizar trámite */
        const { error: caseUpdateError } = await supabase
            .from("cases")
            .update({
                tramite,
                tramite_key,
                updated_at: new Date().toISOString(),
            })
            .eq("id", caseId);

        if (caseUpdateError) {
            return NextResponse.json(
                { error: "No se pudo actualizar el trámite" },
                { status: 500 }
            );
        }

        /* 4️⃣ Log */
        await logAdminAction(
            adminEmail,
            "CLIENT_UPDATED",
            caseId,
            { email, tramite }
        );

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("CLIENT UPDATE ERROR:", err);
        return NextResponse.json(
            { error: "Error interno" },
            { status: 500 }
        );
    }
}
