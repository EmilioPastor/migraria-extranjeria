// app/admin/layout.tsx (si no existe)
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {/* No navbar aquí */}
      {children}
    </div>
  );
}