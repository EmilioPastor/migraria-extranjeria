import Link from "next/link";

export default function PortalCTA({
  status,
}: {
  status: "favorable" | "not_favorable";
}) {
  const text =
    status === "favorable"
      ? "Tu resultado es favorable. Puedes continuar con el proceso legal."
      : "Aunque el resultado no es favorable, podemos revisar tu caso.";

  return (
    <div className="mt-10 border rounded-lg p-6 bg-white">
      <p className="text-sm text-gray-700 mb-4">{text}</p>

      <Link
        href="/pedir-cita"
        className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded"
      >
        Solicitar cita
      </Link>
    </div>
  );
}
