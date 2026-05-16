import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6">
      <p className="text-5xl font-bold text-[var(--border)]">404</p>
      <p className="text-[var(--muted)]">Presentación no encontrada.</p>
      <Link href="/" className="text-sm text-[var(--accent)] hover:underline">
        Volver al catálogo
      </Link>
    </div>
  );
}
