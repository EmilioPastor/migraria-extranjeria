
"use client";

export default function PortalLayout({
  title,
  statusLabel,
  children,
}: {
  title: string;
  statusLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-16 px-6 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-sm text-gray-600">
            Estado actual:{" "}
            <span className="font-medium">{statusLabel}</span>
          </p>
        </header>

        <div className="bg-white border rounded-lg p-8">
          {children}
        </div>

        <footer className="text-xs text-gray-500">
          Esta evaluación es orientativa y no vinculante.
        </footer>
      </div>
    </section>
  );
}
