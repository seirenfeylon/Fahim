import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { useRipple } from '../hooks';

export default function Hero() {
  const { navigate } = useStore();
  const ripple = useRipple();
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${offset * 0.3}px) scale(1.05)` }}
      >
        <img
          src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt="Parvej luxury fashion campaign"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container-lux relative flex h-full flex-col justify-center">
        <div className="max-w-2xl animate-fade-up text-white">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium tracking-wide text-white">
            <Sparkles size={14} className="text-gold-300" />
            New Collection — The Gilded Hour
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            Wear Confidence.
            <br />
            <span className="text-gold-300">Wear Parvej.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg text-white/85">
            Premium Fashion Crafted For Modern Lifestyle. Tailored pieces designed to move with you — from boardroom to boulevard.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate({ name: 'shop' })}
              onMouseDown={ripple}
              className="ripple-container btn-gold group"
            >
              Shop Now
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate({ name: 'collections' })}
              onMouseDown={ripple}
              className="ripple-container inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15 active:scale-[0.98]"
            >
              Explore Collection
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/20 pt-6">
            {[
              { k: '50k+', v: 'Happy Clients' },
              { k: '120+', v: 'Designs' },
              { k: '4.9★', v: 'Avg Rating' },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-2xl font-bold text-white">{s.k}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-white/70">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/70 to-transparent" />
        </div>
      </div>
    </section>
  );
}
