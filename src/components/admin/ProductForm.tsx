import { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
import type { Category } from '../../types';
import type { ProductInput } from '../../lib/admin/productsService';

const CATEGORIES: Category[] = ['men', 'women', 'accessories', 'shoes', 'bags'];

const EMPTY: ProductInput = {
  name: '',
  category: 'men',
  price: 0,
  discountPercent: 0,
  stock: 0,
  image: '',
  description: '',
  featured: false,
  isNew: false,
  isBestSeller: false,
};

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-300">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-ink-400">{hint}</span>}
    </label>
  );
}

const inputCls =
  'w-full rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-ink-800/70 px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30';

export function ProductForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: ProductInput;
  onSave: (input: ProductInput) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState<ProductInput>(initial ?? EMPTY);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setForm(initial ?? EMPTY);
  }, [initial]);

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (form.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (form.discountPercent < 0 || form.discountPercent > 90) {
      setError('Discount must be between 0 and 90');
      return;
    }
    setError('');
    onSave(form);
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product Name">
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Midnight Tailored Blazer"
            className={inputCls}
            required
          />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => update('category', e.target.value as Category)} className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (৳)">
          <input
            type="number"
            min={0}
            value={form.price || ''}
            onChange={(e) => update('price', Number(e.target.value))}
            className={inputCls}
            required
          />
        </Field>
        <Field label="Discount %">
          <input
            type="number"
            min={0}
            max={90}
            value={form.discountPercent || ''}
            onChange={(e) => update('discountPercent', Number(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="Stock">
          <input
            type="number"
            min={0}
            value={form.stock || ''}
            onChange={(e) => update('stock', Number(e.target.value))}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Image URL" hint="Paste a hosted image URL. Firebase Storage hook is wired but inactive.">
        <input
          value={form.image}
          onChange={(e) => update('image', e.target.value)}
          placeholder="https://images.pexels.com/…"
          className={inputCls}
        />
      </Field>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={4}
          placeholder="Short, premium product description…"
          className={`${inputCls} resize-none`}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { key: 'featured' as const, label: 'Featured' },
          { key: 'isNew' as const, label: 'New Arrival' },
          { key: 'isBestSeller' as const, label: 'Best Seller' },
        ].map((toggle) => (
          <button
            key={toggle.key}
            type="button"
            onClick={() => update(toggle.key, !form[toggle.key])}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
              form[toggle.key]
                ? 'border-gold-400 bg-gold-400/10 text-ink-900 dark:text-white'
                : 'border-black/10 dark:border-white/15 text-ink-500 dark:text-ink-300 hover:border-gold-400/50'
            }`}
          >
            <span>{toggle.label}</span>
            <span
              className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
                form[toggle.key] ? 'bg-gold-400' : 'bg-black/10 dark:bg-white/15'
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  form[toggle.key] ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-black/5 dark:border-white/10 pt-5">
        <button type="button" onClick={onCancel} className="btn-ghost">
          <X size={16} /> Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving…' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
