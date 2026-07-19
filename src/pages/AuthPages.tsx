import { useState } from 'react';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, LogOut, Mail, Shield, User } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../lib/authContext';
import { SectionHeading } from '../components/ui';

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-lux py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-8 shadow-soft animate-fade-up">
        {children}
      </div>
    </div>
  );
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 px-3 py-2.5 text-sm text-red-700 dark:text-red-300">
      <AlertCircle size={15} /> {message}
    </div>
  );
}

function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-ink-700 px-5 py-3 text-sm font-semibold transition-all hover:bg-ink-50 dark:hover:bg-ink-600 disabled:opacity-60"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
      </svg>
      Continue with Google
    </button>
  );
}

export function SignInPage() {
  const { navigate, toast } = useStore();
  const { signIn, signInWithGoogle, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await signIn(email, password);
      toast('Welcome back');
      navigate({ name: 'profile' });
    } catch (e: any) {
      setErr(e.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setErr('');
    setLoading(true);
    try {
      await signInWithGoogle();
      toast('Welcome back');
      navigate({ name: 'profile' });
    } catch (e: any) {
      setErr(e.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <button onClick={() => navigate({ name: 'home' })} className="mb-5 inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white">
        <ArrowLeft size={16} /> Back to home
      </button>
      <div className="eyebrow">Welcome back</div>
      <h1 className="mt-2 font-display text-3xl font-bold">Sign In</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Access your orders, wishlist, and saved details.</p>
      {!configured && <div className="mt-4"><Error message="Firebase is not configured. Add your credentials to .env to enable authentication." /></div>}
      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="relative block">
          <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-lux pl-10" />
        </label>
        <label className="relative block">
          <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input required type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-lux pl-10 pr-10" />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label="Toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </label>
        <div className="flex justify-end">
          <button type="button" onClick={() => navigate({ name: 'forgot' })} className="text-xs font-medium text-gold-600 hover:underline">Forgot password?</button>
        </div>
        <Error message={err} />
        <button type="submit" disabled={loading || !configured} className="btn-dark w-full disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" /> or <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>
      <GoogleButton onClick={google} disabled={loading || !configured} />
      <p className="mt-6 text-center text-sm text-ink-500">
        New to CrazyFeb?{' '}
        <button onClick={() => navigate({ name: 'signup' })} className="font-semibold text-ink-900 dark:text-white hover:underline">Create an account</button>
      </p>
    </AuthShell>
  );
}

export function SignUpPage() {
  const { navigate, toast } = useStore();
  const { signUp, signInWithGoogle, configured } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast('Account created — welcome to CrazyFeb');
      navigate({ name: 'profile' });
    } catch (e: any) {
      setErr(e.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setErr('');
    setLoading(true);
    try {
      await signInWithGoogle();
      toast('Welcome to CrazyFeb');
      navigate({ name: 'profile' });
    } catch (e: any) {
      setErr(e.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <button onClick={() => navigate({ name: 'home' })} className="mb-5 inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white">
        <ArrowLeft size={16} /> Back to home
      </button>
      <div className="eyebrow">Join the CrazyFeb circle</div>
      <h1 className="mt-2 font-display text-3xl font-bold">Create Account</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Early access to collections, private sales, and 20% off your first order.</p>
      {!configured && <div className="mt-4"><Error message="Firebase is not configured. Add your credentials to .env to enable authentication." /></div>}
      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="relative block">
          <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="input-lux pl-10" />
        </label>
        <label className="relative block">
          <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-lux pl-10" />
        </label>
        <label className="relative block">
          <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input required type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)" className="input-lux pl-10 pr-10" />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label="Toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </label>
        <Error message={err} />
        <button type="submit" disabled={loading || !configured} className="btn-dark w-full disabled:opacity-60">
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
        <span className="h-px flex-1 bg-black/10 dark:bg-white/10" /> or <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>
      <GoogleButton onClick={google} disabled={loading || !configured} />
      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <button onClick={() => navigate({ name: 'signin' })} className="font-semibold text-ink-900 dark:text-white hover:underline">Sign in</button>
      </p>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const { navigate, toast } = useStore();
  const { resetPassword, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast('Reset link sent — check your inbox');
    } catch (e: any) {
      setErr(e.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <button onClick={() => navigate({ name: 'signin' })} className="mb-5 inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white">
        <ArrowLeft size={16} /> Back to sign in
      </button>
      {sent ? (
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"><Mail size={22} /></div>
          <h1 className="mt-4 font-display text-2xl font-bold">Check your inbox</h1>
          <p className="mt-2 text-sm text-ink-500">We sent a password reset link to <strong className="text-ink-900 dark:text-white">{email}</strong>.</p>
          <button onClick={() => navigate({ name: 'signin' })} className="btn-dark mt-6">Back to sign in</button>
        </div>
      ) : (
        <>
          <div className="eyebrow">Reset password</div>
          <h1 className="mt-2 font-display text-3xl font-bold">Forgot Password</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Enter your email and we'll send you a link to reset your password.</p>
          {!configured && <div className="mt-4"><Error message="Firebase is not configured. Add your credentials to .env to enable authentication." /></div>}
          <form onSubmit={submit} className="mt-6 space-y-3">
            <label className="relative block">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-lux pl-10" />
            </label>
            <Error message={err} />
            <button type="submit" disabled={loading || !configured} className="btn-dark w-full disabled:opacity-60">
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}

export function ProfilePage() {
  const { navigate, toast, wishlist } = useStore();
  const { user, logout, updateDisplayName, configured } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateDisplayName(name);
      setEditing(false);
      toast('Profile updated');
    } catch {
      toast('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast('Signed out');
    navigate({ name: 'home' });
  };

  return (
    <div className="container-lux py-14">
      <SectionHeading eyebrow="Your account" title="Profile" subtitle="Manage your details, orders, and saved pieces." />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-900 text-white dark:bg-white dark:text-ink-900 font-display text-2xl font-bold">
              {(user?.displayName?.[0] || user?.email?.[0] || 'P').toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">{user?.displayName || 'CrazyFeb Member'}</h2>
              <p className="text-sm text-ink-500">{user?.email}</p>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-600">
                <Shield size={11} /> Verified member
              </div>
            </div>
          </div>

          <div className="mt-7 border-t border-black/5 dark:border-white/10 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Display name</h3>
            {editing ? (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-lux flex-1" />
                <div className="flex gap-2">
                  <button onClick={save} disabled={saving} className="btn-dark">{saving ? 'Saving…' : 'Save'}</button>
                  <button onClick={() => { setEditing(false); setName(user?.displayName || ''); }} className="btn-ghost">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium">{user?.displayName || '—'}</span>
                <button onClick={() => setEditing(true)} className="text-xs font-semibold text-gold-600 hover:underline">Edit</button>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-black/5 dark:border-white/10 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Email</h3>
            <p className="mt-3 text-sm font-medium">{user?.email}</p>
          </div>

          <div className="mt-6 border-t border-black/5 dark:border-white/10 pt-6">
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-900/40">
              <LogOut size={15} /> Sign out
            </button>
          </div>

          {!configured && (
            <p className="mt-6 text-xs text-ink-400">Note: Firebase is not configured. Sign-in is running in demo mode.</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
            <h3 className="font-display text-lg font-semibold">At a glance</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { k: wishlist.length, v: 'Wishlist' },
                { k: 0, v: 'Orders' },
                { k: '—', v: 'Points' },
              ].map((s) => (
                <div key={s.v} className="rounded-xl bg-ink-50 dark:bg-ink-700/50 p-3 text-center">
                  <div className="font-display text-2xl font-bold">{s.k}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-500">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
            <h3 className="font-display text-lg font-semibold">Quick links</h3>
            <div className="mt-3 flex flex-col">
              {[
                { label: 'Wishlist', route: { name: 'wishlist' } as const },
                { label: 'Track an order', route: { name: 'track' } as const },
                { label: 'Continue shopping', route: { name: 'shop' } as const },
              ].map((l) => (
                <button key={l.label} onClick={() => navigate(l.route)} className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                  {l.label} <ArrowLeft size={14} className="rotate-180 text-ink-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { ready, user, configured } = useAuth();
  const { navigate } = useStore();
  if (!ready) {
    return (
      <div className="container-lux py-24 text-center text-sm text-ink-500">Loading…</div>
    );
  }
  if (!configured || !user) {
    if (!configured) {
      return (
        <div className="container-lux py-24 text-center">
          <p className="text-sm text-ink-500">Authentication is not configured.</p>
          <button onClick={() => navigate({ name: 'home' })} className="btn-ghost mt-4">Back home</button>
        </div>
      );
    }
    setTimeout(() => navigate({ name: 'signin' }), 0);
    return (
      <div className="container-lux py-24 text-center text-sm text-ink-500">Redirecting to sign in…</div>
    );
  }
  return <>{children}</>;
}
