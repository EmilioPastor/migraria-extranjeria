"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  /* =========================
     SCROLL CON HISTÉRESIS
     ========================= */
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;

      if (!scrolled && current > 80) {
        setScrolled(true);
      }

      if (scrolled && current < 20) {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  /* =========================
     DROPDOWN HANDLERS (DESKTOP)
     ========================= */
  const openServices = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setServicesOpen(true);
  };

  const closeServices = () => {
    closeTimeout.current = setTimeout(() => {
      setServicesOpen(false);
    }, 120);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/migraria-logo.png"
              alt="Migraria Extranjería"
              width={scrolled ? 250 : 350}
              height={60}
              priority
              className="transition-all duration-300"
            />
          </Link>

          {/* DESKTOP NAV — NO TOCAR */}
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/" className="nav-link">Inicio</Link>

            <div
              className="relative"
              onMouseEnter={openServices}
              onMouseLeave={closeServices}
            >
              <Link href="/servicios" className="nav-link">
                Servicios
              </Link>

              {servicesOpen && (
                <div className="absolute left-0 top-full mt-4 w-[520px] bg-white border border-gray-200 shadow-xl rounded-lg p-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="menu-title">Régimen general</p>
                    <ul className="menu-list">
                      <li><Link href="/servicios/regimen-general/arraigo-social">Arraigo social</Link></li>
                      <li><Link href="/servicios/regimen-general/arraigo-socioformativo">Arraigo socioformativo</Link></li>
                      <li><Link href="/servicios/regimen-general/nacionalidad">Nacionalidad española</Link></li>
                      <li><Link href="/servicios/regimen-general/residencia-y-trabajo">Residencia y trabajo</Link></li>
                      <li><Link href="/servicios/regimen-general/reagrupacion-familiar">Reagrupación familiar</Link></li>
                    </ul>
                  </div>

                  <div>
                    <p className="menu-title">Régimen especial</p>
                    <ul className="menu-list">
                      <li><Link href="/servicios/regimen-especial/nomada-digital">Nómada digital</Link></li>
                      <li><Link href="/servicios/regimen-especial/pac">Profesional altamente cualificado</Link></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link href="/sobre-nosotros" className="nav-link">Sobre nosotros</Link>
            <Link href="/contacto" className="nav-link">Contacto</Link>
          </nav>

          <div className="hidden md:block">
            <Button href="/pedir-cita">Pedir cita</Button>
          </div>

          {/* BOTÓN MÓVIL */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </div>

      {/* =========================
          MENÚ MÓVIL MEJORADO
         ========================= */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-8 space-y-6">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block text-lg">
            Inicio
          </Link>

          {/* SERVICIOS MOBILE */}
          <div className="space-y-3">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="w-full flex justify-between items-center text-lg font-medium"
            >
              Servicios
              <span>{servicesOpen ? "−" : "+"}</span>
            </button>

            {servicesOpen && (
              <div className="pl-4 border-l border-gray-200 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">
                    Régimen general
                  </p>
                  <ul className="space-y-2">
                    <li><Link href="/servicios/regimen-general/arraigo-social" onClick={() => setMenuOpen(false)}>Arraigo social</Link></li>
                    <li><Link href="/servicios/regimen-general/arraigo-socioformativo" onClick={() => setMenuOpen(false)}>Arraigo socioformativo</Link></li>
                    <li><Link href="/servicios/regimen-general/nacionalidad" onClick={() => setMenuOpen(false)}>Nacionalidad española</Link></li>
                    <li><Link href="/servicios/regimen-general/residencia-y-trabajo" onClick={() => setMenuOpen(false)}>Residencia y trabajo</Link></li>
                    <li><Link href="/servicios/regimen-general/reagrupacion-familiar" onClick={() => setMenuOpen(false)}>Reagrupación familiar</Link></li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">
                    Régimen especial
                  </p>
                  <ul className="space-y-2">
                    <li><Link href="/servicios/regimen-especial/nomada-digital" onClick={() => setMenuOpen(false)}>Nómada digital</Link></li>
                    <li><Link href="/servicios/regimen-especial/pac" onClick={() => setMenuOpen(false)}>Profesional altamente cualificado</Link></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Link href="/sobre-nosotros" onClick={() => setMenuOpen(false)} className="block text-lg">
            Sobre nosotros
          </Link>

          <Link href="/contacto" onClick={() => setMenuOpen(false)} className="block text-lg">
            Contacto
          </Link>

          <Button href="/pedir-cita" onClick={() => setMenuOpen(false)}>
            Pedir cita
          </Button>
        </div>
      )}
    </header>
  );
}
