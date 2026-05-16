import { notFound } from 'next/navigation';
import { getAllPresentations, getPresentationBySlug } from '@/lib/data/presentations';
import { PresentMode } from '@/components/ui/PresentMode';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPresentations().map((p) => ({ slug: p.slug }));
}

export default async function PresentPage({ params }: Props) {
  const { slug } = await params;
  const presentation = getPresentationBySlug(slug);
  if (!presentation) notFound();

  return <PresentMode htmlPath={presentation.htmlPath} backHref={`/${slug}`} title={presentation.title} />;
}
