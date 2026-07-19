import { useEffect, useMemo, useState } from 'react';
import { FolderTree } from 'lucide-react';
import { productsRepository, type ProductListRow } from '../../lib/admin/productsService';

const CATEGORY_LABELS: Record<string, string> = {
  men: 'Men',
  women: 'Women',
  accessories: 'Accessories',
  shoes: 'Shoes',
  bags: 'Bags',
};

export function AdminCategories() {
  const [rows, setRows] = useState<ProductListRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsRepository.list().then((r) => {
      setRows(r);
      setLoading(false);
    });
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, { count: number; inStock: number; avgPrice: number; total: number }>();
    for (const r of rows) {
      const entry = map.get(r.category) ?? { count: 0, inStock: 0, avgPrice: 0, total: 0 };
      entry.count += 1;
      if (r.inStock) entry.inStock += 1;
      entry.total += r.price;
      map.set(r.category, entry);
    }
    return Array.from(map.entries()).map(([cat, e]) => ({
      category: cat,
      label: CATEGORY_LABELS[cat] ?? cat,
      count: e.count,
      inStock: e.inStock,
      avgPrice: e.count ? Math.round(e.total / e.count) : 0,
    }));
  }, [rows]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500 dark:text-ink-300">
        Categories are derived from your products. Full CRUD for categories arrives with the Firestore migration.
      </p>

      {loading ? (
        <div className="card-lux p-10 text-center text-sm text-ink-500">Loading categories…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map((c) => (
            <div key={c.category} className="card-lux hover-lift p-6">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-ink-900 text-gold-400 dark:bg-white dark:text-ink-900">
                  <FolderTree size={20} />
                </div>
                <span className="rounded-full bg-gold-400/15 px-2.5 py-1 text-xs font-semibold text-gold-600 dark:text-gold-300">
                  {c.count} items
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold capitalize">{c.label}</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-ink-400 uppercase tracking-wider">In stock</div>
                  <div className="mt-1 font-semibold text-ink-900 dark:text-white">{c.inStock}</div>
                </div>
                <div>
                  <div className="text-ink-400 uppercase tracking-wider">Avg price</div>
                  <div className="mt-1 font-semibold text-ink-900 dark:text-white">৳{c.avgPrice.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
