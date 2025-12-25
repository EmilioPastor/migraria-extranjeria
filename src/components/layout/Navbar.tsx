import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      {/* Línea institucional */}
      <div className="h-[4px] bg-[var(--primary)]" />

      <div className="max-w-7xl mx-auto px-6 py-7 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo/migraria-logo.png"
            alt="Migraria Extranjería"
            width={300}
            height={50}
            priority
          />
        </Link>

        {/* NAVEGACIÓN */}
        <nav className="flex items-center gap-12 text-sm font-medium">
          <Link
            href="/"
            className="text-[var(--primary)] hover:text-[var(--primary-soft)] transition"
          >
            Inicio
          </Link>

          <Link
            href="/servicios"
            className="text-[var(--primary)] hover:text-[var(--primary-soft)] transition"
          >
            Servicios
          </Link>

          <Link
            href="/sobre-nosotros"
            className="text-[var(--primary)] hover:text-[var(--primary-soft)] transition"
          >
            Sobre nosotros
          </Link>

          <Link
            href="/contacto"
            className="text-[var(--primary)] hover:text-[var(--primary-soft)] transition"
          >
            Contacto
          </Link>

          {/* CTA */}
          <Link
            href="/pedir-cita"
            className="ml-6 bg-[var(--primary)] text-white px-7 py-3 rounded-sm hover:bg-[var(--primary-soft)] transition"
          >
            Pedir cita
          </Link>
        </nav>
      </div>
    </header>
  );
}
