import { NextResponse } from "next/server";
import { logAdminAction } from "@/lib/logAdminAction";

export async function POST(req: Request) {
  const { caseId, status, adminEmail } = await req.json();

  // 🔧 Aquí iría tu lógica real de actualización del caso
  // update case set status = ...

  await logAdminAction(
    adminEmail,
    "CASE_STATUS_CHANGED",
    caseId,
    { status }
  );

  return NextResponse.json({ ok: true });
}
