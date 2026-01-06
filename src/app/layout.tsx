// app/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter"; // Opcional

export const metadata: Metadata = {
  title: "Migraria Extranjería",
  description:
    "Despacho especializado en derecho de extranjería, inmigración y nacionalidad española.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <ConditionalNavbar />
        <main className="min-h-screen">{children}</main>
        <ConditionalFooter /> {/* O dejar solo Footer si no quieres condicional */}
      </body>
    </html>
  );
}