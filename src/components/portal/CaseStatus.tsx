export default function CaseStatus({
  status,
}: {
  status: "in_review" | "favorable" | "not_favorable";
}) {
  const map = {
    in_review: {
      title: "Tu documentación está siendo revisada",
      color: "bg-yellow-50 border-yellow-200 text-yellow-800",
      text:
        "Nuestro equipo legal está evaluando la información aportada. Este proceso puede tardar unas horas.",
    },
    favorable: {
      title: "Evaluación favorable",
      color: "bg-green-50 border-green-200 text-green-800",
      text:
        "Según la documentación aportada, el trámite es viable. El siguiente paso es solicitar cita para continuar.",
    },
    not_favorable: {
      title: "Evaluación no favorable",
      color: "bg-red-50 border-red-200 text-red-800",
      text:
        "Con la información actual, el trámite presenta dificultades. Puedes solicitar asesoramiento personalizado.",
    },
  };

  const s = map[status];

  return (
    <div
      className={`border rounded-lg p-6 ${s.color}`}
    >
      <h2 className="text-lg font-semibold mb-2">
        {s.title}
      </h2>
      <p className="text-sm leading-relaxed">
        {s.text}
      </p>
    </div>
  );
}
