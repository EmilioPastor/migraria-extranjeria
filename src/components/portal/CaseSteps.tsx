export default function CaseSteps({
  step,
}: {
  step: 1 | 2 | 3;
}) {
  const steps = [
    "Subida de documentación",
    "Evaluación legal",
    "Resultado orientativo",
  ];

  return (
    <ol className="flex justify-between mb-10">
      {steps.map((label, i) => {
        const index = (i + 1) as 1 | 2 | 3;
        const active = step >= index;

        return (
          <li key={label} className="flex-1 text-center">
            <div
              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                active
                  ? "bg-[var(--primary)] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index}
            </div>
            <p
              className={`text-sm ${
                active ? "font-medium" : "text-gray-400"
              }`}
            >
              {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
