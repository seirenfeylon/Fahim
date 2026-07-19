import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product, Route } from './types';

interface Toast {
  id: number;
  message: string;
}

interface StoreState {
  route: Route;
  navigate: (r: Route) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, delta: number) => void;
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWished: (id: string) => boolean;

  recentlyViewed: Product[];
  pushRecentlyViewed: (p: Product) => void;

  compare: string[];
  toggleCompare: (id: string) => void;
  isCompared: (id: string) => boolean;
  clearCompare: () => void;

  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  query: string;
  setQuery: (v: string) => void;

  toasts: Toast[];
  toast: (message: string) => void;

  coupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discount: number;
}

const StoreContext = createContext<StoreState | null>(null);

const COUPONS: Record<string, number> = {
  CRAZYFEB10: 0.1,
  LUXURY15: 0.15,
  WELCOME: 0.2,
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);

  // Theme persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = (localStorage.getItem('crazyfeb-theme') || localStorage.getItem('parvej-theme')) as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      localStorage.setItem('crazyfeb-theme', saved);
      localStorage.removeItem('parvej-theme');
    }
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('crazyfeb-theme', theme);
  }, [theme]);

  // Wishlist persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('crazyfeb-wishlist') || localStorage.getItem('parvej-wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
      localStorage.setItem('crazyfeb-wishlist', saved);
      localStorage.removeItem('parvej-wishlist');
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('crazyfeb-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  const navigate = useCallback((r: Route) => setRoute(r), []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const addToCart = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      setCart((items) => {
        const idx = items.findIndex((i) => i.product.id === product.id && i.size === size && i.color === color);
        if (idx >= 0) {
          const next = [...items];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [...items, { product, size, color, quantity }];
      });
      toast(`${product.name} added to cart`);
      setCartOpen(true);
    },
    [toast],
  );

  const removeFromCart = useCallback((index: number) => {
    setCart((items) => items.filter((_, i) => i !== index));
  }, []);

  const updateQty = useCallback((index: number, delta: number) => {
    setCart((items) =>
      items
        .map((item, i) => (i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((w) => {
        if (w.includes(id)) {
          toast('Removed from wishlist');
          return w.filter((x) => x !== id);
        }
        toast('Added to wishlist');
        return [...w, id];
      });
    },
    [toast],
  );

  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const pushRecentlyViewed = useCallback((p: Product) => {
    setRecentlyViewed((rv) => [p, ...rv.filter((x) => x.id !== p.id)].slice(0, 8));
  }, []);

  const toggleCompare = useCallback(
    (id: string) => {
      setCompare((c) => {
        if (c.includes(id)) return c.filter((x) => x !== id);
        if (c.length >= 4) {
          toast('You can compare up to 4 products');
          return c;
        }
        toast('Added to compare');
        return [...c, id];
      });
    },
    [toast],
  );

  const isCompared = useCallback((id: string) => compare.includes(id), [compare]);
  const clearCompare = useCallback(() => setCompare([]), []);

  const applyCoupon = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (COUPONS[normalized]) {
        setCoupon(normalized);
        toast(`Coupon ${normalized} applied`);
        return true;
      }
      toast('Invalid coupon code');
      return false;
    },
    [toast],
  );
  const removeCoupon = useCallback(() => setCoupon(null), []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.quantity, 0), [cart]);
  const discount = useMemo(() => {
    if (!coupon) return 0;
    return Math.round(cartSubtotal * (COUPONS[coupon] || 0));
  }, [coupon, cartSubtotal]);

  const value: StoreState = {
    route,
    navigate,
    theme,
    toggleTheme,
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    cartCount,
    cartSubtotal,
    cartOpen,
    setCartOpen,
    wishlist,
    toggleWishlist,
    isWished,
    recentlyViewed,
    pushRecentlyViewed,
    compare,
    toggleCompare,
    isCompared,
    clearCompare,
    searchOpen,
    setSearchOpen,
    query,
    setQuery,
    toasts,
    toast,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
