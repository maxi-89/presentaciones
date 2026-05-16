import { readFileSync } from 'fs';
import { join } from 'path';
import type { Presentation } from '@/types/presentation';

function getDataPath() {
  return join(process.cwd(), 'data', 'presentations.json');
}

export function getAllPresentations(): Presentation[] {
  const raw = readFileSync(getDataPath(), 'utf-8');
  return JSON.parse(raw) as Presentation[];
}

export function getPresentationBySlug(slug: string): Presentation | undefined {
  return getAllPresentations().find((p) => p.slug === slug);
}
