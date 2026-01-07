"use client";

type PortalStatus =
  | "pending"
  | "in_review"
  | "favorable"
  | "not_favorable";

export default function PortalLayout({
  title,
  statusLabel,
  children,
}: {
  title: string;
  statusLabel: PortalStatus;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header superior simple */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 w-full px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
        <div className="w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">
                Estado actual:{" "}
                <span className="font-medium capitalize">
                  {statusLabel.replace('_', ' ')}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-full text-sm font-medium">
                Portal Cliente
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido PRINCIPAL - SIN límite de ancho */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full">
          {children}
        </div>
      </div>

      {/* Footer moderno */}
      <footer className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 w-full px-4 sm:px-6 lg:px-8 py-4 mt-8">
        <div className="w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-emerald-100 rounded">
                  <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 font-medium">Conexión segura • Portal Premium</span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
              <p>Esta evaluación es orientativa y no vinculante. Migraria Extranjería © {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}