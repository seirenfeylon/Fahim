import { ShoppingCart, Settings, Users } from 'lucide-react';
import type { AdminSection } from '../../types';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminDashboardHome } from './AdminDashboardHome';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminPlaceholder } from './AdminPlaceholder';
import { useAdminAuth } from '../../lib/admin/useAdminAuth';
import { useStore } from '../../store';

export function AdminPage({ section = 'dashboard' }: { section?: AdminSection }) {
  const { ready, configured, isAdmin } = useAdminAuth();
  const { navigate } = useStore();

  if (!ready) {
    return <div className="container-lux py-24 text-center text-sm text-ink-500">Loading…</div>;
  }

  if (!configured) {
    return (
      <div className="container-lux py-24 text-center">
        <p className="text-sm text-ink-500">Authentication is not configured.</p>
        <button onClick={() => navigate({ name: 'home' })} className="btn-ghost mt-4">Back home</button>
      </div>
    );
  }

  if (!isAdmin) {
    setTimeout(() => navigate({ name: 'home' }), 0);
    return (
      <div className="container-lux py-24 text-center text-sm text-ink-500">Access denied. Redirecting…</div>
    );
  }

  const go = (s: AdminSection) => navigate({ name: 'admin', section: s });

  return (
    <AdminLayout section={section} onNavigate={go}>
      {section === 'dashboard' && <AdminDashboardHome />}
      {section === 'products' && <AdminProducts />}
      {section === 'categories' && <AdminCategories />}
      {section === 'orders' && (
        <AdminPlaceholder
          title="Orders"
          description="Order management will land here once the Firestore orders collection is wired up."
          icon={ShoppingCart}
        />
      )}
      {section === 'customers' && (
        <AdminPlaceholder
          title="Customers"
          description="Customer profiles, segments, and lifetime value will appear here in a future release."
          icon={Users}
        />
      )}
      {section === 'settings' && (
        <AdminPlaceholder
          title="Settings"
          description="Store configuration, shipping rules, and admin roles will be configurable here."
          icon={Settings}
        />
      )}
    </AdminLayout>
  );
}
