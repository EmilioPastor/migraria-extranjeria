import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM!;
const ADMIN = process.env.ADMIN_EMAIL!;

export async function sendClientAccessEmail(
  to: string,
  token: string
) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/portal/${token}`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Accede a tu área privada",
    html: `
      <p>Ya puedes acceder a tu área privada para subir la documentación necesaria.</p>
      <p>
        <a href="${url}">
          Acceder a mi área privada
        </a>
      </p>
      <p>Si tienes cualquier duda, contacta con nosotros.</p>
    `,
  });
}

export async function sendClientInReviewEmail(
  to: string
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Documentación recibida",
    html: `
      <p>Hemos recibido toda la documentación necesaria.</p>
      <p>Tu caso está siendo revisado por nuestro equipo.</p>
    `,
  });
}

export async function sendAdminCaseReadyEmail(
  caseId: string
) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/case/${caseId}`;

  await resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: "Caso listo para revisión",
    html: `
      <p>Un caso ha pasado a estado <strong>en revisión</strong>.</p>
      <p>
        <a href="${url}">
          Revisar caso
        </a>
      </p>
    `,
  });
}
