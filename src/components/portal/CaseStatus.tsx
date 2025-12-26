export default function CaseStatus({
  status,
}: {
  status: "in_review" | "favorable" | "not_favorable";
}) {
  const map = {
    in_review: {
      label: "En evaluación",
      color: "bg-yellow-100 text-yellow-800",
      text: "Estamos revisando tu documentación.",
    },
    favorable: {
      label: "Evaluación favorable",
      color: "bg-green-100 text-green-800",
      text:
        "Según la información aportada, el trámite es viable.",
    },
    not_favorable: {
      label: "Evaluación no favorable",
      color: "bg-red-100 text-red-800",
      text:
        "Con la documentación actual, el trámite presenta dificultades.",
    },
  };

  const s = map[status];

  return (
    <div className={`p-4 rounded ${s.color}`}>
      <p className="font-semibold mb-1">{s.label}</p>
      <p className="text-sm">{s.text}</p>
    </div>
  );
}
