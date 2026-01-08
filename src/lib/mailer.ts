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

    const {  error } = await resend.emails.send({
        from: FROM,
        to: [to], // 👈 IMPORTANTE: array
        subject: "Su expediente ha sido creado – MIGRARIA",
        html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f5f7fa; padding:40px 0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden;">
      
      <div style="background:#0f2a44; padding:24px;">
        <h1 style="color:#ffffff; margin:0; font-size:20px;">
          MIGRARIA · Extranjería
        </h1>
      </div>

      <div style="padding:32px; color:#1f2937;">
        <p style="font-size:15px;">
          Estimado/a cliente,
        </p>

        <p style="font-size:15px; line-height:1.6;">
          Le informamos de que su expediente ha sido <strong>creado correctamente</strong> en
          <strong>MIGRARIA Extranjería</strong>.
        </p>

        <p style="font-size:15px; line-height:1.6;">
          <strong>Trámite solicitado:</strong><br/>
          ${tramite}
        </p>

        <p style="font-size:15px; line-height:1.6;">
          A partir de ahora podrá consultar el estado de su expediente, subir documentación
          y recibir comunicaciones oficiales a través de su portal personal.
        </p>

        <div style="text-align:center; margin:32px 0;">
          <a href="${portalUrl}"
             style="background:#2563eb; color:#ffffff; padding:14px 28px;
                    text-decoration:none; border-radius:6px; font-weight:bold;">
            Acceder a mi expediente
          </a>
        </div>

        <p style="font-size:14px; color:#4b5563;">
          Por motivos de seguridad, este enlace es personal y no debe compartirse.
        </p>

        <p style="font-size:15px; margin-top:32px;">
          Atentamente,<br/>
          <strong>Equipo Legal MIGRARIA</strong><br/>
          Departamento de Extranjería
        </p>
      </div>

      <div style="background:#f3f4f6; padding:16px; text-align:center; font-size:12px; color:#6b7280;">
        © MIGRARIA Extranjería · Comunicación confidencial
      </div>
    </div>
  </div>
`

    });



    if (error) {
        throw new Error("Error enviando email de nuevo expediente");
    }

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

    const { error } = await resend.emails.send({
        from: FROM,
        to: [to], // 👈 IMPORTANTE
        subject: "Resolución de su expediente – MIGRARIA",
        html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f5f7fa; padding:40px 0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden;">
      
      <div style="background:#0f2a44; padding:24px;">
        <h1 style="color:#ffffff; margin:0; font-size:20px;">
          MIGRARIA · Extranjería
        </h1>
      </div>

      <div style="padding:32px; color:#1f2937;">
        <p style="font-size:15px;">
          Estimado/a cliente,
        </p>

        <p style="font-size:15px; line-height:1.6;">
          Le comunicamos que su expediente ha sido <strong>evaluado por nuestro equipo jurídico</strong>.
        </p>

        <p style="font-size:15px; line-height:1.6;">
          <strong>Resultado de la evaluación:</strong><br/>
          ${result === "favorable"
                ? "<span style='color:#047857; font-weight:bold;'>Favorable</span>"
                : "<span style='color:#b91c1c; font-weight:bold;'>No favorable</span>"
            }
        </p>

        ${message
                ? `
              <div style="background:#f9fafb; border-left:4px solid #2563eb;
                          padding:16px; margin:24px 0;">
                <p style="margin:0; font-size:14px; line-height:1.6;">
                  <strong>Mensaje del equipo legal:</strong><br/>
                  ${message}
                </p>
              </div>
            `
                : ""
            }

        <p style="font-size:15px; line-height:1.6;">
          Puede consultar el detalle completo del expediente y los siguientes pasos
          accediendo a su portal personal.
        </p>

        <div style="text-align:center; margin:32px 0;">
          <a href="${portalUrl}"
             style="background:#2563eb; color:#ffffff; padding:14px 28px;
                    text-decoration:none; border-radius:6px; font-weight:bold;">
            Ver mi expediente
          </a>
        </div>

        <p style="font-size:15px; margin-top:32px;">
          Quedamos a su disposición para cualquier aclaración.<br/><br/>
          Atentamente,<br/>
          <strong>Equipo Legal MIGRARIA</strong><br/>
          Departamento de Extranjería
        </p>
      </div>

      <div style="background:#f3f4f6; padding:16px; text-align:center; font-size:12px; color:#6b7280;">
        © MIGRARIA Extranjería · Comunicación confidencial · No responder a este correo
      </div>
    </div>
  </div>
`
    });



    if (error) {
        throw new Error("Error enviando email de evaluación");
    }

}
