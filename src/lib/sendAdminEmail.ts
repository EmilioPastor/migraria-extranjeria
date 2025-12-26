export async function sendAdminEmail(
  to: string,
  subject: string,
  body: string
) {
  console.log("📧 EMAIL 2FA");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Body:", body);
}
