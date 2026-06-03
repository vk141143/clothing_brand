import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Star, Minus, Plus, Share2, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { getSaree, SAREES } from "@/lib/data";
import type { Saree } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatINR, useCart, useWishlist } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function ImageLightbox({ images, active, onClose, onPrev, onNext }: {
  images: string[]; active: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, px: 0, py: 0 });

  useEffect(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.min(4, Math.max(1, s - e.deltaY * 0.001)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setDragging(true);
    dragStart.current = { mx: e.clientX, px: pos.x, py: pos.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPos({ x: dragStart.current.px + e.clientX - dragStart.current.mx, y: dragStart.current.py + e.clientY - dragStart.current.mx });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-10">
          <X className="h-6 w-6" />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-10">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-10">
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        <div
          className="max-w-3xl max-h-[90vh] overflow-hidden cursor-zoom-in"
          style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
          onClick={(e) => { e.stopPropagation(); setScale((s) => s < 2 ? 2 : 1); if (scale > 1) setPos({ x: 0, y: 0 }); }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          <motion.img
            key={active}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={images[active]}
            alt=""
            style={{ transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`, transition: dragging ? "none" : "transform 0.2s" }}
            className="max-w-3xl max-h-[90vh] object-contain select-none"
            draggable={false}
          />
        </div>
        <div className="absolute bottom-4 flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); }} className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-2 bg-white/40"}`} />
          ))}
        </div>
        <div className="absolute bottom-4 right-4 text-white/60 text-xs">Scroll to zoom · Drag to pan · ESC to close</div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProductPage() {
  const { id } = Route.useParams();
  const saree = getSaree(id);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const isWished = useWishlist((s) => s.ids.includes(id));
  const navigate = useNavigate();

  if (!saree) {
    return <div className="container mx-auto px-4 py-20 text-center">Product not found. <Link to="/shop" className="text-brand underline">Browse all</Link></div>;
  }

  const prev = () => setActive((a) => (a - 1 + saree.images.length) % saree.images.length);
  const next = () => setActive((a) => (a + 1) % saree.images.length);

  const stockLabel = saree.stock === 0 ? "Out of Stock" : saree.stock <= 2 ? `Only ${saree.stock} Left` : saree.stock <= 5 ? "Limited Stock" : "In Stock";
  const stockColor = saree.stock === 0 ? "text-destructive" : saree.stock <= 5 ? "text-warning" : "text-success";
  const sameCat = SAREES.filter((s) => s.category === saree.category && s.id !== saree.id);
  const others = SAREES.filter((s) => s.category !== saree.category && s.id !== saree.id);
  const related = [...sameCat, ...others].slice(0, 5);
  const moreRelated = [...sameCat, ...others].slice(5, 15);

  const reviews = [
    { name: "Riya M.", rating: 5, verified: true, helpful: 24, text: "Absolutely stunning! The colors are even more vibrant in person. Worth every rupee." },
    { name: "Sneha K.", rating: 4, verified: true, helpful: 12, text: "Beautiful weave, fast delivery. Slightly heavier than expected but gorgeous." },
    { name: "Aditi P.", rating: 5, verified: true, helpful: 31, text: "I wore this for my engagement and got endless compliments. Premium quality." },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {lightbox && (
        <ImageLightbox
          images={saree.images}
          active={active}
          onClose={() => setLightbox(false)}
          onPrev={prev}
          onNext={next}
        />
      )}

      <nav className="text-xs text-muted-foreground mb-4">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to="/category/$slug" params={{ slug: saree.category }}>{saree.category}</Link> / <span className="text-foreground">{saree.name}</span>
      </nav>

      {/* On mobile: stacked. On lg: left=images, right=info+features+tabs */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-muted group cursor-zoom-in" onClick={() => setLightbox(true)}>
            <motion.img key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={saree.images[active]} alt={saree.name}
              className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-sm transition">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute bottom-3 right-3 bg-black/40 text-white rounded-full p-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="h-4 w-4" />
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {saree.images.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {saree.images.map((img, i) => (
              <button key={i} onClick={() => setActive(i)} className={`aspect-square rounded-lg overflow-hidden border-2 ${i === active ? "border-brand" : "border-transparent"}`}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Product Info + Features + Tabs (on lg) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {saree.isBestSeller && <span className="text-[10px] font-bold bg-gold text-navy px-2 py-0.5 rounded">BESTSELLER</span>}
            {saree.isNew && <span className="text-[10px] font-bold bg-sky text-sky-foreground px-2 py-0.5 rounded">NEW</span>}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">{saree.name}</h1>
          <p className="text-muted-foreground mt-1">{saree.fabric}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1 bg-success/10 text-success px-2 py-0.5 rounded text-sm font-semibold">
              <Star className="h-3.5 w-3.5 fill-current" /> {saree.rating}
            </span>
            <span className="text-sm text-muted-foreground">{saree.reviewCount} reviews</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatINR(saree.price)}</span>
            <span className="text-lg text-muted-foreground line-through">{formatINR(saree.originalPrice)}</span>
            <span className="text-success font-semibold">{saree.discount}% OFF</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>

          <p className={`mt-4 font-semibold ${stockColor}`}>● {stockLabel}</p>

          <div className="mt-6">
            <p className="text-sm font-semibold mb-2">Color: <span className="text-muted-foreground">{saree.color}</span></p>
            <div className="flex gap-2">
              {saree.colors.map((c) => (
                <button key={c} className="px-3 py-1.5 text-xs border rounded-full hover:border-brand">{c}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <Button variant="ghost" size="icon" onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <span className="text-sm text-muted-foreground">{saree.stock} available</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button size="lg" disabled={saree.stock === 0} onClick={() => { add(saree, qty); toast.success("Added to cart"); }} className="bg-navy hover:bg-navy/90 text-navy-foreground">
              <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button size="lg" disabled={saree.stock === 0} onClick={() => { add(saree, qty); navigate({ to: "/checkout" }); }} className="bg-brand hover:bg-brand/90 text-brand-foreground">
              Buy Now
            </Button>
          </div>
          <div className="mt-3 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { toggleWish(saree.id); toast.success(isWished ? "Removed from wishlist" : "Added to wishlist"); }}>
              <Heart className={`h-4 w-4 mr-2 ${isWished ? "fill-brand text-brand" : ""}`} /> {isWished ? "Wishlisted" : "Wishlist"}
            </Button>
            <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
          </div>

          {/* Feature badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            <Feature icon={Truck} label="Free shipping above ₹2,000" />
            <Feature icon={RefreshCw} label="7-day easy returns" />
            <Feature icon={ShieldCheck} label="100% authentic" />
          </div>

          {/* Tabs — on lg screens rendered here (below features), on mobile rendered outside grid below */}
          <div className="hidden lg:block mt-10">
            <ProductTabs saree={saree} reviews={reviews} />
          </div>
        </div>
      </div>

      {/* Tabs — mobile only (outside the 2-col grid) */}
      <div className="lg:hidden mt-10">
        <ProductTabs saree={saree} reviews={reviews} />
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {related.map((s, i) => <ProductCard key={s.id} saree={s} index={i} small />)}
          </div>
          {moreRelated.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
              {moreRelated.map((s, i) => <ProductCard key={s.id} saree={s} index={i + 5} small />)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

type Review = { name: string; rating: number; verified: boolean; helpful: number; text: string };

function ProductTabs({ saree, reviews }: { saree: Saree; reviews: Review[] }) {
  return (
    <Tabs defaultValue="desc">
      <TabsList className="flex w-full h-auto flex-wrap gap-1 bg-muted p-1 rounded-lg">
        <TabsTrigger value="desc" className="flex-1 min-w-[90px] text-xs sm:text-sm">Description</TabsTrigger>
        <TabsTrigger value="spec" className="flex-1 min-w-[90px] text-xs sm:text-sm">Specifications</TabsTrigger>
        <TabsTrigger value="rev" className="flex-1 min-w-[90px] text-xs sm:text-sm">Reviews ({saree.reviewCount})</TabsTrigger>
        <TabsTrigger value="ship" className="flex-1 min-w-[90px] text-xs sm:text-sm">Shipping</TabsTrigger>
      </TabsList>
      <TabsContent value="desc" className="prose max-w-none py-6 text-sm leading-relaxed">{saree.description}</TabsContent>
      <TabsContent value="spec" className="py-6">
        <table className="text-sm w-full max-w-xl">
          <tbody>
            {[["Fabric", saree.fabric], ["Color", saree.color], ["Length", "5.5 m + 0.8 m blouse"], ["Wash Care", "Dry clean only"], ["Origin", "India"], ["SKU", saree.id.toUpperCase()]].map(([k, v]) => (
              <tr key={k} className="border-b">
                <td className="py-2 pr-4 font-medium text-muted-foreground w-32">{k}</td>
                <td className="py-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TabsContent>
      <TabsContent value="rev" className="py-6 space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="p-4 border rounded-xl">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{r.name}</div>
              {r.verified && <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded font-semibold">✓ Verified</span>}
            </div>
            <div className="flex gap-0.5 text-gold my-1">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" />)}</div>
            <p className="text-sm">{r.text}</p>
            <button className="text-xs text-muted-foreground mt-2 hover:text-brand">👍 Helpful ({r.helpful})</button>
          </div>
        ))}
      </TabsContent>
      <TabsContent value="ship" className="py-6 text-sm space-y-2">
        <p>• Free shipping on orders above ₹2,000</p>
        <p>• Standard delivery: 4–7 business days</p>
        <p>• Express delivery available at checkout</p>
        <p>• COD available on orders below ₹15,000</p>
      </TabsContent>
    </Tabs>
  );
}

function Feature({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-1 p-3 rounded-lg border">
      <Icon className="h-4 w-4 text-brand" />
      <span>{label}</span>
    </div>
  );
}
