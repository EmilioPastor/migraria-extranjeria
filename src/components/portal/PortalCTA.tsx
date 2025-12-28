import Link from "next/link";

export default function PortalCTA({
  status,
}: {
  status: "favorable" | "not_favorable";
}) {
  return (
    <div className="mt-10 border rounded-lg p-6 bg-white">
      <p className="text-sm text-gray-700 mb-4">
        Si deseas continuar, puedes solicitar una cita con nuestro equipo legal.
      </p>

      <Link
        href="/pedir-cita"
        className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded"
      >
        Solicitar cita
      </Link>
    </div>
  );
}
