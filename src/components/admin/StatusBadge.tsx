export default function StatusBadge({
  status,
}: {
  status: "in_review" | "favorable" | "not_favorable";
}) {
  const map = {
    in_review: "bg-yellow-100 text-yellow-800",
    favorable: "bg-green-100 text-green-800",
    not_favorable: "bg-red-100 text-red-800",
  };

  const label = {
    in_review: "En revisión",
    favorable: "Favorable",
    not_favorable: "No favorable",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}
