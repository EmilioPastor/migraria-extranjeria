type Props = {
  tramite: string;
  email?: string | null;
  requiredCount: number;
  uploadedCount: number;
};

export default function CaseHeader({
  tramite,
  email,
  requiredCount,
  uploadedCount,
}: Props) {
  const progress =
    requiredCount === 0
      ? 0
      : Math.round((uploadedCount / requiredCount) * 100);

  const statusLabel =
    progress === 100
      ? "Documentación completa"
      : "Pendiente de documentación";

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">
          {tramite}
        </h1>
        <p className="text-sm text-gray-600">
          Cliente:{" "}
          <strong>{email ?? "—"}</strong>
        </p>
      </div>

      {/* PROGRESO */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>
            Documentación {uploadedCount}/{requiredCount}
          </span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              progress === 100
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm font-medium">
          {statusLabel}
        </p>
      </div>
    </div>
  );
}
