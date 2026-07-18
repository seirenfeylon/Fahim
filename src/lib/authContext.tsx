import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, hasConfig } from './firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  ready: boolean;
  configured: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

const friendly = (code: string): string => {
  const map: Record<string, string> = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
  };
  return map[code] || 'Something went wrong. Please try again.';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    loading,
    ready,
    configured: hasConfig,
    signUp: async (email, password, displayName) => {
      if (!auth) throw new Error('Firebase is not configured.');
      setLoading(true);
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) await updateProfile(cred.user, { displayName });
      } catch (e: any) {
        throw new Error(friendly(e?.code || ''));
      } finally {
        setLoading(false);
      }
    },
    signIn: async (email, password) => {
      if (!auth) throw new Error('Firebase is not configured.');
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        throw new Error(friendly(e?.code || ''));
      } finally {
        setLoading(false);
      }
    },
    signInWithGoogle: async () => {
      if (!auth) throw new Error('Firebase is not configured.');
      setLoading(true);
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (e: any) {
        throw new Error(friendly(e?.code || ''));
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      if (!auth) return;
      await signOut(auth);
    },
    resetPassword: async (email) => {
      if (!auth) throw new Error('Firebase is not configured.');
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (e: any) {
        throw new Error(friendly(e?.code || ''));
      }
    },
    updateDisplayName: async (displayName) => {
      if (!auth || !auth.currentUser) throw new Error('Not signed in.');
      await updateProfile(auth.currentUser, { displayName });
      setUser({ ...auth.currentUser });
    },
  }), [user, loading, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
