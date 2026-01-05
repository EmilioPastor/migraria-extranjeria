export default function CaseSteps({
  step,
}: {
  step: 1 | 2 | 3;
}) {
  return (
    <div className="flex gap-4 mb-6 text-sm">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`px-3 py-1 rounded ${
            step >= s
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Paso {s}
        </div>
      ))}
    </div>
  );
}
