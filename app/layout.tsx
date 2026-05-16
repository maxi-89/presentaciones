import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'SlideHub — Maximiliano Rodríguez',
  description: 'Catálogo de presentaciones técnicas de Maximiliano Rodríguez.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-[var(--border)] px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight hover:text-[var(--accent)] transition-colors">
            SlideHub
          </Link>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border)] px-6 py-4 text-sm text-[var(--muted)]">
          Maximiliano Rodríguez
        </footer>
      </body>
    </html>
  );
}
