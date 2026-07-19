import { useEffect, useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { ProductTable } from '../../components/admin/ProductTable';
import { ProductForm } from '../../components/admin/ProductForm';
import { Modal } from '../../components/admin/Modal';
import { productsRepository, type ProductInput, type ProductListRow } from '../../lib/admin/productsService';
import { useStore } from '../../store';

export function AdminProducts() {
  const { toast } = useStore();
  const [rows, setRows] = useState<ProductListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductListRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ProductListRow | null>(null);

  const refresh = async () => {
    setLoading(true);
    const list = await productsRepository.list();
    setRows(list);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: ProductListRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSave = async (input: ProductInput) => {
    setSaving(true);
    try {
      if (editing) {
        await productsRepository.update(editing.id, input);
        toast('Product updated');
      } else {
        await productsRepository.create(input);
        toast('Product created');
      }
      setModalOpen(false);
      setEditing(null);
      await refresh();
    } catch (e) {
      toast('Could not save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      await productsRepository.remove(confirmDelete.id);
      toast('Product deleted');
      setConfirmDelete(null);
      await refresh();
    } catch (e) {
      toast('Could not delete product');
    } finally {
      setSaving(false);
    }
  };

  const editingInput: ProductInput | undefined = editing
    ? {
        name: editing.name,
        category: editing.category,
        price: editing.price,
        discountPercent: editing.discountPercent,
        stock: editing.stock,
        image: editing.image,
        description: '',
        featured: editing.featured,
        isNew: editing.isNew,
        isBestSeller: editing.isBestSeller,
      }
    : undefined;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-ink-500 dark:text-ink-300">Manage your catalog. Add, edit, or remove products.</p>
        </div>
        <button onClick={openCreate} className="btn-gold">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <ProductTable rows={rows} loading={loading} onEdit={openEdit} onDelete={setConfirmDelete} />

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Product' : 'Add Product'}
        subtitle={editing ? editing.name : 'Create a new product entry'}
        onClose={() => setModalOpen(false)}
      >
        <ProductForm initial={editingInput} onSave={handleSave} onCancel={() => setModalOpen(false)} saving={saving} />
      </Modal>

      <Modal
        open={!!confirmDelete}
        title="Delete product?"
        subtitle={confirmDelete?.name}
        onClose={() => setConfirmDelete(null)}
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>This action cannot be undone. The product will be permanently removed from your catalog.</span>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setConfirmDelete(null)} className="btn-ghost">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-60">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
