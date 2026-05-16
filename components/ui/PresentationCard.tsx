import Link from 'next/link';
import Image from 'next/image';
import type { Presentation } from '@/types/presentation';

interface PresentationCardProps {
  presentation: Presentation;
}

export function PresentationCard({ presentation }: PresentationCardProps) {
  const { slug, title, event, date, tags, thumbnailPath } = presentation;
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/${slug}`}
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden hover:border-[var(--accent)] transition-colors duration-200"
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        {thumbnailPath ? (
          <Image
            src={`/${thumbnailPath}`}
            alt={title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)] text-sm">
            Sin preview
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h2 className="font-semibold text-base leading-tight group-hover:text-[var(--accent)] transition-colors">
          {title}
        </h2>
        {event && <p className="text-sm text-[var(--muted)] truncate">{event}</p>}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-[var(--muted)]">{formattedDate}</span>
          <div className="flex gap-1 flex-wrap justify-end">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
