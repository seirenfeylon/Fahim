import { useState } from 'react';
import { Award, Heart, Leaf, Mail, MapPin, Package, Phone, Send, Sparkles, Truck, User } from 'lucide-react';
import { useStore } from '../store';
import { useReveal } from '../hooks';
import { collections, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { SectionHeading } from '../components/ui';

export function AboutPage() {
  const { navigate } = useStore();
  return (
    <div>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src="https://images.pexels.com/photos/7679871/pexels-photo-7679871.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container-lux relative flex h-full items-center text-white">
          <div className="max-w-xl">
            <div className="eyebrow text-gold-300">Our Story</div>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Quiet luxury, made to last</h1>
            <p className="mt-4 text-white/85">Parvej began with a simple belief: that premium fashion should feel personal, considered, and enduring. We design in-house, source the finest materials, and partner with artisans who care about the craft.</p>
          </div>
        </div>
      </section>

      <section className="container-lux py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: <Award size={22} />, t: 'Craftsmanship', d: 'Every piece is finished by hand in family-run ateliers across Italy, Portugal, and France.' },
            { icon: <Leaf size={22} />, t: 'Responsibility', d: 'We use certified wools, organic cottons, and recycled fibers wherever possible.' },
            { icon: <Heart size={22} />, t: 'Made to last', d: 'Timeless silhouettes and durable construction — designed to be worn for years.' },
          ].map((v) => (
            <div key={v.t} className="card-lux hover-lift p-7">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gold-400/15 text-gold-600">{v.icon}</div>
              <h3 className="mt-4 font-display text-xl font-semibold">{v.t}</h3>
              <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink-900 py-20 text-white">
        <div className="container-lux grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="eyebrow text-gold-300">The atelier</div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">From sketch to wardrobe</h2>
            <p className="mt-4 max-w-md text-white/80">Each collection begins with a mood, a fabric, and a conversation. We prototype in-house, refine for fit, and produce in small runs — so every piece arrives considered.</p>
            <button onClick={() => navigate({ name: 'shop' })} className="btn-gold mt-6">Explore the shop</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=700" alt="" className="aspect-[3/4] w-full rounded-2xl object-cover" />
            <img src="https://images.pexels.com/photos/7679721/pexels-photo-7679721.jpeg?auto=compress&cs=tinysrgb&w=700" alt="" className="mt-8 aspect-[3/4] w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}

export function ContactPage() {
  const { toast } = useStore();
  const [sent, setSent] = useState(false);
  return (
    <div className="container-lux py-16">
      <SectionHeading eyebrow="We are here to help" title="Contact Us" subtitle="Questions about sizing, orders, or styling? Our concierge team responds within one business day." align="center" />
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            { icon: <MapPin size={18} />, t: 'Visit', d: 'Gulshan Avenue, Dhaka 1212, Bangladesh' },
            { icon: <Phone size={18} />, t: 'Call', d: '+880 1700 000 000 (9am–9pm)' },
            { icon: <Mail size={18} />, t: 'Email', d: 'care@parvej.atelier' },
          ].map((c) => (
            <div key={c.t} className="card-lux flex items-start gap-4 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-400/15 text-gold-600">{c.icon}</div>
              <div>
                <div className="font-semibold">{c.t}</div>
                <div className="text-sm text-ink-600 dark:text-ink-300">{c.d}</div>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); toast('Message sent — we will be in touch'); }}
          className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6"
        >
          {sent ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"><Sparkles size={22} /></div>
                <h3 className="mt-4 font-display text-xl font-semibold">Thank you</h3>
                <p className="mt-1 text-sm text-ink-500">Your message is on its way to our team.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-5">Send another</button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="First name" className="input-lux" />
              <input required placeholder="Last name" className="input-lux" />
              <input required type="email" placeholder="Email" className="input-lux sm:col-span-2" />
              <input placeholder="Order number (optional)" className="input-lux sm:col-span-2" />
              <textarea required placeholder="How can we help?" rows={5} className="input-lux sm:col-span-2 resize-none" />
              <button type="submit" className="btn-dark sm:col-span-2"><Send size={16} /> Send Message</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export function CollectionsPage() {
  const { navigate } = useStore();
  return (
    <div className="container-lux py-16">
      <SectionHeading eyebrow="Curated edits" title="All Collections" subtitle="Considered capsules, each designed around a single mood." align="center" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {collections.map((c) => (
          <button key={c.id} onClick={() => navigate({ name: 'collection', id: c.id })} className="group relative aspect-[16/10] overflow-hidden rounded-2xl text-left">
            <div className="zoom-img absolute inset-0"><img src={c.image} alt={c.name} className="h-full w-full object-cover" /></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-300">{c.count} pieces</div>
              <h3 className="mt-2 font-display text-3xl font-bold">{c.name}</h3>
              <p className="mt-1 text-sm text-white/80">{c.tagline}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CollectionPage({ id }: { id: string }) {
  const ref = useReveal<HTMLDivElement>();
  const c = collections.find((x) => x.id === id) || collections[0];
  return (
    <div>
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container-lux relative flex h-full items-end pb-12 text-white">
          <div>
            <div className="eyebrow text-gold-300">{c.count} pieces</div>
            <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{c.name}</h1>
            <p className="mt-2 text-white/85">{c.tagline}</p>
          </div>
        </div>
      </section>
      <section className="container-lux py-14">
        <div ref={ref} className="reveal grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

export function AccountPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { toast, navigate, wishlist } = useStore();
  return (
    <div className="container-lux py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-8">
        <div className="mb-6 flex rounded-full bg-ink-100 dark:bg-ink-700 p-1">
          {(['login', 'signup'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-all ${mode === m ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'text-ink-500'}`}>{m === 'login' ? 'Sign In' : 'Sign Up'}</button>
          ))}
        </div>
        <h1 className="font-display text-2xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="mt-1 text-sm text-ink-500">{mode === 'login' ? 'Access your orders, wishlist, and saved details.' : 'Join Parvej for early access and 20% off.'}</p>
        <form onSubmit={(e) => { e.preventDefault(); toast(mode === 'login' ? 'Signed in' : 'Account created — welcome'); navigate({ name: 'home' }); }} className="mt-6 space-y-3">
          {mode === 'signup' && <input required placeholder="Full name" className="input-lux" />}
          <input required type="email" placeholder="Email" className="input-lux" />
          <input required type="password" placeholder="Password" className="input-lux" />
          {mode === 'login' && <button type="button" className="text-xs text-gold-600 hover:underline">Forgot password?</button>}
          <button type="submit" className="btn-dark w-full">{mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-500">
          <User size={14} /> {wishlist.length} items in your wishlist
        </div>
      </div>
    </div>
  );
}

export function WishlistPage() {
  const { wishlist, navigate } = useStore();
  const list = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="container-lux py-14">
      <SectionHeading eyebrow="Saved for later" title="Your Wishlist" subtitle={list.length ? `${list.length} saved pieces` : 'No saved pieces yet.'} />
      {list.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-black/10 dark:border-white/15 py-20 text-center">
          <div>
            <Heart size={28} className="mx-auto text-ink-400" />
            <p className="mt-4 font-display text-xl font-semibold">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-ink-500">Tap the heart on any product to save it here.</p>
            <button onClick={() => navigate({ name: 'shop' })} className="btn-dark mt-5">Discover pieces</button>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export function TrackPage() {
  const [tracked, setTracked] = useState(false);
  const { toast } = useStore();
  return (
    <div className="container-lux py-16">
      <SectionHeading eyebrow="Order tracking" title="Track Your Order" subtitle="Enter your order number and email to see the latest status." align="center" />
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6">
        <form onSubmit={(e) => { e.preventDefault(); setTracked(true); toast('Order found'); }} className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Order number (e.g. PVJ12345)" className="input-lux sm:col-span-2" />
          <input required type="email" placeholder="Email used at checkout" className="input-lux sm:col-span-2" />
          <button className="btn-dark sm:col-span-2"><Package size={16} /> Track Order</button>
        </form>
        {tracked && (
          <div className="mt-6 space-y-4">
            {[
              { label: 'Order placed', done: true, icon: <Package size={14} /> },
              { label: 'Crafting & packing', done: true, icon: <Sparkles size={14} /> },
              { label: 'Shipped', done: true, icon: <Truck size={14} /> },
              { label: 'Out for delivery', done: false, icon: <Truck size={14} /> },
              { label: 'Delivered', done: false, icon: <Package size={14} /> },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`grid h-8 w-8 place-items-center rounded-full ${s.done ? 'bg-emerald-500 text-white' : 'bg-ink-100 dark:bg-ink-700 text-ink-400'}`}>{s.icon}</div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold ${s.done ? '' : 'text-ink-500'}`}>{s.label}</div>
                  <div className="h-1 w-full rounded-full bg-ink-100 dark:bg-ink-700">
                    <div className={`h-full rounded-full bg-emerald-500 transition-all`} style={{ width: s.done ? '100%' : '0%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function RecentlyViewed() {
  const { recentlyViewed, navigate } = useStore();
  if (recentlyViewed.length === 0) return null;
  return (
    <section className="container-lux py-14">
      <SectionHeading eyebrow="Pick up where you left off" title="Recently Viewed" action={<button onClick={() => navigate({ name: 'shop' })} className="btn-ghost">View all</button>} />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {recentlyViewed.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
