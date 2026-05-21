export interface Presentation {
  id: string;
  slug: string;
  title: string;
  description?: string;
  event?: string;
  date: string;
  tags: string[];
  htmlPath: string;
  thumbnailPath?: string;
  format?: 'slides' | 'document';
}
