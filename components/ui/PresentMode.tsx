'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_PATH } from '@/lib/utils/basePath';

interface PresentModeProps {
  htmlPath: string;
  backHref: string;
  title: string;
}

export function PresentMode({ htmlPath, backHref, title }: PresentModeProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push(backHref);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [backHref, router]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-3 right-4 z-10 flex items-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs text-white/50">ESC para salir</span>
        <a
          href={backHref}
          className="text-xs text-white/50 hover:text-white transition-colors"
        >
          ✕
        </a>
      </div>
      <iframe
        src={`${BASE_PATH}/${htmlPath}`}
        className="w-full h-full border-0"
        title={title}
        sandbox="allow-scripts allow-same-origin"
        allowFullScreen
      />
    </div>
  );
}
