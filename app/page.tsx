import { getAllPresentations } from '@/lib/data/presentations';
import { PresentationCard } from '@/components/ui/PresentationCard';

export default function CatalogPage() {
  const presentations = getAllPresentations();

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Presentaciones</h1>
        <p className="text-[var(--muted)] text-sm">
          {presentations.length} {presentations.length === 1 ? 'presentación' : 'presentaciones'}
        </p>
      </div>

      {presentations.length === 0 ? (
        <div className="flex items-center justify-center h-48 rounded-xl border border-dashed border-[var(--border)] text-[var(--muted)] text-sm">
          No hay presentaciones todavía.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {presentations.map((p) => (
            <PresentationCard key={p.id} presentation={p} />
          ))}
        </div>
      )}
    </div>
  );
}
