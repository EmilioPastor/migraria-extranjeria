"use client";

import Link from "next/link";

export default function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <header className="mb-10">
        <nav className="text-sm text-gray-500 mb-2">
          <Link href="/admin">Admin</Link> / {title}
        </nav>

        <h1 className="text-3xl font-semibold">{title}</h1>
      </header>

      {children}
    </section>
  );
}
