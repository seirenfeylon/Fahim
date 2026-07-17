import { useEffect, useState } from 'react';
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react';
import { useStore } from '../store';
import type { Route } from '../types';

const links: { label: string; route: Route }[] = [
  { label: 'Home', route: { name: 'home' } },
  { label: 'Shop', route: { name: 'shop' } },
  { label: 'Men', route: { name: 'shop', gender: 'men' } },
  { label: 'Women', route: { name: 'shop', gender: 'women' } },
  { label: 'Collections', route: { name: 'collections' } },
  { label: 'New Arrivals', route: { name: 'shop' } },
  { label: 'Best Sellers', route: { name: 'shop' } },
  { label: 'About', route: { name: 'about' } },
  { label: 'Contact', route: { name: 'contact' } },
];

export default function Navbar() {
  const { navigate, route, cartCount, setCartOpen, wishlist, theme, toggleTheme, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (r: Route) => {
    if (r.name !== route.name) return false;
    if (r.name === 'shop' && route.name === 'shop') {
      return (r as any).gender === (route as any).gender;
    }
    return true;
  };

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink-900 text-white">
        <div className="overflow-hidden">
          <div className="marquee py-2 text-[11px] font-medium tracking-wider uppercase">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex shrink-0">
                <span className="px-6">Complimentary shipping on orders over ৳15,000</span>
                <span className="px-6 text-gold-300">•</span>
                <span className="px-6">New collection — The Gilded Hour — now live</span>
                <span className="px-6 text-gold-300">•</span>
                <span className="px-6">Use code WELCOME for 20% off your first order</span>
                <span className="px-6 text-gold-300">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-lux flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <button onClick={() => go({ name: 'home' })} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-900 dark:bg-white text-gold-400 dark:text-ink-900 font-display text-lg font-bold">
              P
            </span>
            <span className="font-display text-xl font-bold tracking-tight">Parvej</span>
          </button>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.route)}
                className={`relative px-3 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                  isActive(l.route) ? 'text-gold-500' : 'text-ink-700 dark:text-ink-200 hover:text-ink-900 dark:hover:text-white'
                }`}
              >
                {l.label}
                {isActive(l.route) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-400" />
                )}
              </button>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Search size={18} />
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => go({ name: 'wishlist' })}
              aria-label="Wishlist"
              className="relative hidden sm:grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink-900">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => go({ name: 'account' })}
              aria-label="Account"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <User size={18} />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink-900 dark:bg-white px-1 text-[10px] font-bold text-white dark:text-ink-900">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-700 dark:text-ink-200 xl:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white dark:bg-ink-900 shadow-lift transition-transform duration-500 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-5">
            <span className="font-display text-lg font-bold">Menu</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col px-3">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.route)}
                className="rounded-xl px-3 py-3 text-left text-sm font-medium text-ink-700 dark:text-ink-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-black/5 dark:border-white/10 px-5 pt-4">
            <button onClick={() => go({ name: 'wishlist' })} className="btn-ghost flex-1">
              <Heart size={16} /> Wishlist
            </button>
            <button onClick={() => go({ name: 'account' })} className="btn-ghost flex-1">
              <User size={16} /> Account
            </button>
            <button onClick={toggleTheme} className="btn-ghost grid h-11 w-11 place-items-center">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
