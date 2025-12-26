import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0f1f2e] text-white">
      {/* BLOQUE SUPERIOR */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-16">
        
        {/* MARCA */}
        <div>
          <Image
            src="/logo/migraria-logo.png"
            alt="Migraria Extranjería"
            width={180}
            height={60}
            className="mb-6"
          />

          <p className="text-sm text-white/70 leading-relaxed">
            Despacho especializado en derecho de extranjería e inmigración.
            Asesoramiento jurídico claro, riguroso y adaptado a cada caso
            concreto.
          </p>
        </div>

        {/* SERVICIOS */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider mb-6">
            Servicios
          </p>

          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <Link href="/servicios/regimen-general">
                Régimen general
              </Link>
            </li>
            <li>
              <Link href="/servicios/regimen-especial">
                Régimen especial
              </Link>
            </li>
            <li>
              <Link href="/servicios/regimen-general/nacionalidad">
                Nacionalidad española
              </Link>
            </li>
            <li>
              <Link href="/servicios/regimen-especial/nomada-digital">
                Nómada digital
              </Link>
            </li>
          </ul>
        </div>

        {/* DESPACHO */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider mb-6">
            Despacho
          </p>

          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <Link href="/sobre-nosotros">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link href="/contacto">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/pedir-cita">
                Pedir cita online
              </Link>
            </li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider mb-6">
            Legal
          </p>

          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <Link href="/legal/aviso-legal">
                Aviso legal
              </Link>
            </li>
            <li>
              <Link href="/legal/politica-privacidad">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/legal/politica-cookies">
                Política de cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* BLOQUE INFERIOR */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-6 justify-between items-center text-sm text-white/60">
          
          <p>
            © {new Date().getFullYear()} MIGRARIA EXTRANJERÍA. Todos los derechos
            reservados.
          </p>

          <p className="text-center md:text-right max-w-xl">
            La información contenida en este sitio web tiene carácter meramente
            informativo y no constituye asesoramiento jurídico.
          </p>
        </div>
      </div>
    </footer>
  );
}
