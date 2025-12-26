"use client";

export default function ConfirmAction({
  label,
  onConfirm,
  danger = false,
}: {
  label: string;
  onConfirm: () => void;
  danger?: boolean;
}) {
  const handle = () => {
    if (confirm("¿Confirmas esta acción?")) {
      onConfirm();
    }
  };

  return (
    <button
      onClick={handle}
      className={`px-5 py-2 rounded text-white ${
        danger ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {label}
    </button>
  );
}
