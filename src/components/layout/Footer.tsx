import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-20">
        
        {/* BLOQUE MARCA */}
        <div>
          <Image
            src="/logo/migraria-logo.png"
            alt="Migraria Extranjería"
            width={180}
            height={55}
            className="mb-8"
          />

          <p className="text-white/80 leading-relaxed max-w-sm">
            Despacho especializado en derecho de extranjería, inmigración y
            nacionalidad española. Asesoramiento jurídico riguroso y
            personalizado.
          </p>
        </div>

        {/* BLOQUE NAVEGACIÓN */}
        <div>
          <h4 className="text-sm uppercase tracking-wide mb-6 text-white/60">
            Navegación
          </h4>

          <ul className="space-y-4">
            <li>
              <Link href="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/servicios" className="hover:underline">
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/sobre-nosotros" className="hover:underline">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:underline">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* BLOQUE LEGAL */}
        <div>
          <h4 className="text-sm uppercase tracking-wide mb-6 text-white/60">
            Información legal
          </h4>

          <ul className="space-y-4">
            <li>
              <Link href="/aviso-legal" className="hover:underline">
                Aviso legal
              </Link>
            </li>
            <li>
              <Link href="/politica-privacidad" className="hover:underline">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/politica-cookies" className="hover:underline">
                Política de cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* PIE FINAL */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-white/60 flex justify-between">
          <span>© {new Date().getFullYear()} Migraria Extranjería</span>
          <span>Todos los derechos reservados</span>
        </div>
      </div>
    </footer>
  );
}
