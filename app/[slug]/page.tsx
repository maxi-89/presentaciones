import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPresentations, getPresentationBySlug } from '@/lib/data/presentations';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { BASE_PATH } from '@/lib/utils/basePath';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPresentations().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const presentation = getPresentationBySlug(slug);
  if (!presentation) return {};
  return {
    title: `${presentation.title} — SlideHub`,
    description: presentation.description,
  };
}

export default async function PresentationDetailPage({ params }: Props) {
  const { slug } = await params;
  const presentation = getPresentationBySlug(slug);
  if (!presentation) notFound();

  const formattedDate = new Date(presentation.date + 'T00:00:00').toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {presentation.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold mb-2">{presentation.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          {presentation.event && <span>{presentation.event}</span>}
          <span>·</span>
          <span>{formattedDate}</span>
        </div>
        {presentation.description && (
          <p className="mt-3 text-[var(--muted)] leading-relaxed max-w-2xl">
            {presentation.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href={`/${slug}/present`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          ▶ Presentar
        </Link>
        <DownloadButton
          href={`${BASE_PATH}/exports/pdf/${slug}.pdf`}
          filename={`${slug}.pdf`}
          label="Descargar PDF"
        />
        <DownloadButton
          href={`${BASE_PATH}/exports/ppt/${slug}.pptx`}
          filename={`${slug}.pptx`}
          label="Descargar PPT (imagen)"
        />
      </div>

      <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-black aspect-video">
        <iframe
          src={`${BASE_PATH}/${presentation.htmlPath}`}
          className="w-full h-full"
          title={presentation.title}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
