import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:p-6">
      <div className="my-4 w-full max-w-2xl rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 shadow-lift animate-fade-up">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 dark:border-white/10 px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-ink-500 dark:text-ink-300">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-500 hover:bg-black/5 dark:hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
