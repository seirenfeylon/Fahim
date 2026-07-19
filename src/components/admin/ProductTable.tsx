import { Pencil, Trash2 } from 'lucide-react';
import type { ProductListRow } from '../../lib/admin/productsService';

export function ProductTable({
  rows,
  loading,
  onEdit,
  onDelete,
}: {
  rows: ProductListRow[];
  loading?: boolean;
  onEdit: (row: ProductListRow) => void;
  onDelete: (row: ProductListRow) => void;
}) {
  if (loading && rows.length === 0) {
    return (
      <div className="card-lux p-10 text-center text-sm text-ink-500 dark:text-ink-300">Loading products…</div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="card-lux p-10 text-center text-sm text-ink-500 dark:text-ink-300">
        No products yet. Add your first product to get started.
      </div>
    );
  }

  return (
    <div className="card-lux overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/10 bg-ink-50/60 dark:bg-ink-800/60 text-[11px] uppercase tracking-wider text-ink-500 dark:text-ink-300">
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Discount</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-black/5 dark:border-white/5 transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/40"
              >
                <td className="px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-700">
                    {row.image ? (
                      <img src={row.image} alt={row.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-ink-900 dark:text-white">{row.name}</td>
                <td className="px-4 py-3 capitalize text-ink-600 dark:text-ink-300">{row.category}</td>
                <td className="px-4 py-3 font-semibold">৳{row.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  {row.discountPercent > 0 ? (
                    <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-xs font-semibold text-gold-600 dark:text-gold-300">
                      {row.discountPercent}%
                    </span>
                  ) : (
                    <span className="text-ink-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={row.stock === 0 ? 'text-red-500 font-semibold' : 'text-ink-600 dark:text-ink-300'}>
                    {row.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {row.inStock ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-600 dark:text-red-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Out
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(row)}
                      className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-gold-400/15 hover:text-gold-600 dark:text-ink-300 dark:hover:text-gold-300"
                      aria-label={`Edit ${row.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-red-500/15 hover:text-red-600 dark:text-ink-300 dark:hover:text-red-300"
                      aria-label={`Delete ${row.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
