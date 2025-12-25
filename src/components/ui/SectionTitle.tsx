export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-semibold text-[var(--color-primary)]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[var(--color-muted)] max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
