interface DownloadButtonProps {
  href: string;
  filename: string;
  label: string;
}

export function DownloadButton({ href, filename, label }: DownloadButtonProps) {
  return (
    <a
      href={href}
      download={filename}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:border-[var(--accent)] transition-colors"
    >
      {label}
    </a>
  );
}
