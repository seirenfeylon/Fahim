import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '../store';
import { products, formatBDT } from '../data/products';

export default function SearchModal() {
  const { searchOpen, setSearchOpen, query, setQuery, navigate } = useStore();
  const [local, setLocal] = useState(query);

  useEffect(() => {
    if (searchOpen) setLocal(query);
  }, [searchOpen, query]);

  const results = useMemo(() => {
    const q = local.trim().toLowerCase();
    if (!q) return products.slice(0, 4);
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.includes(q)).slice(0, 6);
  }, [local]);

  const go = (id: string) => {
    setQuery(local);
    setSearchOpen(false);
    navigate({ name: 'product', id });
  };

  return (
    <div className={`fixed inset-0 z-50 ${searchOpen ? '' : 'pointer-events-none'}`} aria-hidden={!searchOpen}>
      <div
        className={`absolute inset-0 bg-ink-900/50 backdrop-blur-sm transition-opacity duration-300 ${searchOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setSearchOpen(false)}
      />
      <div className={`absolute inset-x-0 top-0 mx-auto w-full max-w-2xl px-4 transition-all duration-300 ${searchOpen ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}>
        <div className="mt-20 overflow-hidden rounded-2xl glass-strong shadow-lift">
          <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/10 p-4">
            <Search size={20} className="text-gold-500" />
            <input
              autoFocus={searchOpen}
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="Search for products, collections…"
              className="flex-1 bg-transparent text-base outline-none placeholder:text-ink-400"
              onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(results[0].id); }}
            />
            <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
              {local ? 'Results' : 'Popular right now'}
            </div>
            {results.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-ink-500">No results found. Try a different keyword.</div>
            ) : (
              <ul>
                {results.map((p) => (
                  <li key={p.id}>
                    <button onClick={() => go(p.id)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                      <img src={p.images[0]} alt={p.name} className="h-14 w-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{p.name}</div>
                        <div className="text-xs text-ink-500 dark:text-ink-300">{p.brand} • {p.category}</div>
                      </div>
                      <div className="text-sm font-bold">{formatBDT(p.price)}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
