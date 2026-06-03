import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Truck, ShieldCheck, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, HERO_SLIDES, SAREES, TESTIMONIALS } from "@/lib/data";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CraftMySarees · Premium Indian Sarees Online" },
      { name: "description", content: "Shop authentic Banarasi, Kanjivaram, silk, bridal & designer sarees. Handwoven by master artisans across India. Free shipping above ₹2,000." },
      { property: "og:title", content: "CraftMySarees · Premium Indian Sarees" },
      { property: "og:description", content: "Authentic handwoven sarees · Bridal · Banarasi · Kanjivaram · Designer collections" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <Hero />
      <USPBar />
      <Categories />
      <ProductRow title="Featured Sarees" subtitle="Handpicked by our curators" items={SAREES.slice(0, 8)} />
      <FestiveBanner />
      <ProductRow title="New Arrivals" subtitle="Fresh from the looms" items={SAREES.filter((s) => s.isNew).slice(0, 8)} />
      <ProductRow title="Best Sellers" subtitle="Loved by thousands" items={SAREES.filter((s) => s.isBestSeller).slice(0, 8)} />
      <ProductRow title="Limited Edition" subtitle="Once they're gone, they're gone" items={SAREES.filter((s) => s.isLimited).slice(0, 8)} />
      <Testimonials />
      <Newsletter />
    </div>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const slide = HERO_SLIDES[i];
  return (
    <section className="relative h-[60vh] md:h-[78vh] overflow-hidden bg-muted">
      {HERO_SLIDES.map((s, idx) => (
        <motion.div
          key={idx}
          initial={false}
          animate={{ opacity: idx === i ? 1 : 0, scale: idx === i ? 1 : 1.05 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </motion.div>
      ))}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div key={slide.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-xl text-white">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3" /> New Collection
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">{slide.title}</h1>
          <p className="mt-4 text-base md:text-lg opacity-90">{slide.subtitle}</p>
          <Link to={slide.href}>
            <Button size="lg" className="mt-6 bg-brand hover:bg-brand/90 text-brand-foreground">{slide.cta}</Button>
          </Link>
        </motion.div>
      </div>
      <button onClick={() => setI((x) => (x - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center">
        <ChevronLeft />
      </button>
      <button onClick={() => setI((x) => (x + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center">
        <ChevronRight />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-brand" : "w-1.5 bg-white/50"}`} />
        ))}
      </div>
    </section>
  );
}

function USPBar() {
  const items = [
    { icon: Truck, t: "Free Shipping", s: "Orders above ₹2,000" },
    { icon: ShieldCheck, t: "Authentic Quality", s: "100% genuine weaves" },
    { icon: RefreshCw, t: "Easy Returns", s: "7-day return policy" },
    { icon: Star, t: "4.8 Rated", s: "By 50K+ customers" },
  ];
  return (
    <section className="border-y bg-secondary/50">
      <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.t} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center">
              <it.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{it.t}</div>
              <div className="text-xs text-muted-foreground">{it.s}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="container mx-auto px-4 py-12">
      <SectionHeading title="Shop by Category" subtitle="Explore our timeless weaves" />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {CATEGORIES.map((c, i) => (
          <motion.div key={c.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
            <Link to="/category/$slug" params={{ slug: c.slug }} className="block group">
              <div className="aspect-square rounded-full overflow-hidden bg-muted ring-2 ring-transparent group-hover:ring-brand transition">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="text-center text-xs md:text-sm mt-2 font-medium group-hover:text-brand">{c.name}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProductRow({ title, subtitle, items }: { title: string; subtitle: string; items: typeof SAREES }) {
  if (!items.length) return null;
  return (
    <section className="container mx-auto px-4 py-10">
      <SectionHeading title={title} subtitle={subtitle} action={<Link to="/shop" className="text-sm text-brand font-semibold hover:underline">View all →</Link>} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {items.slice(0, 5).map((s, i) => <ProductCard key={s.id} saree={s} index={i} small />)}
      </div>
    </section>
  );
}

function FestiveBanner() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-luxury text-navy-foreground p-8 md:p-14">
        <div className="relative z-10 max-w-xl">
          <p className="text-sky font-semibold text-sm uppercase tracking-widest">Festive Edit</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-2">Diwali Drops · Up to 60% Off</h2>
          <p className="mt-3 opacity-90">Celebrate in tradition with our curated festive collection. Free shipping & gift wrapping included.</p>
          <Link to="/shop"><Button className="mt-5 bg-brand hover:bg-brand/90 text-brand-foreground">Shop Festive</Button></Link>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute right-10 top-10 w-40 h-40 rounded-full bg-sky/30 blur-2xl" />
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-14">
      <SectionHeading title="Loved by Saree Lovers" subtitle="Real stories from our customers" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="p-6 rounded-2xl bg-card border shadow-soft">
            <div className="flex gap-0.5 text-gold mb-3">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div>
            <p className="text-sm leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3 mt-4">
              <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.city}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-14">
      <div className="rounded-2xl bg-brand/5 border border-brand/20 p-8 md:p-12 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold">Stay in the Weave</h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">Subscribe for early access to new collections & exclusive offers.</p>
        <form className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input type="email" placeholder="Enter your email" className="bg-background" />
          <Button type="button" className="bg-brand hover:bg-brand/90 text-brand-foreground">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}

function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
