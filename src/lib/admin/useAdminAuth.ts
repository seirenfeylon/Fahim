import { useMemo } from 'react';
import { useAuth } from '../authContext';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((s: string) => s.trim().toLowerCase())
  .filter(Boolean);

export function useAdminAuth() {
  const { user, ready, configured, logout } = useAuth();

  const isAdmin = useMemo(() => {
    if (!configured || !user) return false;
    if (ADMIN_EMAILS.length > 0) {
      return ADMIN_EMAILS.includes((user.email ?? '').toLowerCase());
    }
    return true;
  }, [configured, user]);

  return { user, ready, configured, isAdmin, logout };
}
