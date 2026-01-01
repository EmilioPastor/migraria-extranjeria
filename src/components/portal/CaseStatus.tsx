type Status =
  | "pending"
  | "in_review"
  | "favorable"
  | "not_favorable";

const STATUS_MAP: Record<
  Status,
  { title: string; color: string; description: string }
> = {
  pending: {
    title: "Pendiente de documentación",
    color: "border-blue-200 bg-blue-50",
    description: "Debes subir la documentación requerida.",
  },
  in_review: {
    title: "Documentación en revisión",
    color: "border-yellow-200 bg-yellow-50",
    description: "Nuestro equipo está revisando tu documentación.",
  },
  favorable: {
    title: "Resultado favorable",
    color: "border-green-200 bg-green-50",
    description: "El resultado de la evaluación es favorable.",
  },
  not_favorable: {
    title: "Resultado no favorable",
    color: "border-red-200 bg-red-50",
    description: "El resultado de la evaluación no es favorable.",
  },
};

export default function CaseStatus({
  status,
}: {
  status: Status;
}) {
  const s = STATUS_MAP[status];

  if (!s) {
    return (
      <div className="border rounded-lg p-6 border-gray-200 bg-gray-50">
        Estado desconocido
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-6 ${s.color}`}>
      <h2 className="text-lg font-semibold mb-2">{s.title}</h2>
      <p className="text-sm text-gray-700">{s.description}</p>
    </div>
  );
}
