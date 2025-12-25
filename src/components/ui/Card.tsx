import { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div className="relative bg-white border border-gray-200 p-10 rounded-sm transition hover:border-[var(--primary)]">
      
      {/* Línea estructural */}
      <span className="absolute left-0 top-0 h-full w-[4px] bg-[var(--primary)]" />

      <div className="pl-6">
        {title && (
          <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">
            {title}
          </h3>
        )}

        <div className="text-[var(--text-muted)] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
