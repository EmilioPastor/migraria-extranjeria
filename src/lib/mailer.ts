import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.MAIL_FROM!;
const APP_URL = process.env.APP_URL!;

/* ===============================
   EMAIL NUEVO EXPEDIENTE
=============================== */
export async function sendNewCaseEmail({
  to,
  tramite,
  token,
}: {
  to: string;
  tramite: string;
  token: string;
}) {
  const portalUrl = `${APP_URL}/portal/${token}`;

  console.log("📧 ENVIANDO EMAIL A:", to);
  console.log("📧 DESDE:", FROM);

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to], // 👈 IMPORTANTE: array
    subject: "Su expediente ha sido creado – MIGRARIA",
    html: `
      <h2>Su expediente ha sido creado</h2>
      <p><strong>Trámite:</strong> ${tramite}</p>
      <p>Puede acceder a su portal personal aquí:</p>
      <p>
        <a href="${portalUrl}" target="_blank">
          Acceder a mi expediente
        </a>
      </p>
      <p>MIGRARIA Extranjería</p>
    `,
  });

  console.log("📨 RESEND DATA:", data);
  console.log("❌ RESEND ERROR:", error);

  if (error) {
    throw new Error("Error enviando email de nuevo expediente");
  }

  console.log("✅ EMAIL REGISTRADO EN RESEND:", data?.id);
}

/* ===============================
   EMAIL EVALUACIÓN
=============================== */
export async function sendEvaluationEmail({
  to,
  result,
  message,
  token,
}: {
  to: string;
  result: "favorable" | "not_favorable";
  message?: string | null;
  token: string;
}) {
  const portalUrl = `${APP_URL}/portal/${token}`;

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to], // 👈 IMPORTANTE
    subject: "Resolución de su expediente – MIGRARIA",
    html: `
      <h2>Resolución del expediente</h2>
      <p><strong>Resultado:</strong> ${
        result === "favorable" ? "Favorable" : "No favorable"
      }</p>
      ${
        message
          ? `<p><strong>Mensaje del equipo:</strong><br/>${message}</p>`
          : ""
      }
      <p>Puede consultar el detalle en su portal:</p>
      <p>
        <a href="${portalUrl}" target="_blank">
          Ver mi expediente
        </a>
      </p>
      <p>MIGRARIA Extranjería</p>
    `,
  });

  console.log("📨 RESEND DATA:", data);
  console.log("❌ RESEND ERROR:", error);

  if (error) {
    throw new Error("Error enviando email de evaluación");
  }

  console.log("✅ EMAIL REGISTRADO EN RESEND:", data?.id);
}
