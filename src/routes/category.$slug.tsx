import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X, Grid2X2, Grid3X3 } from "lucide-react";
import { CATEGORIES, getByCategory } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "discount", label: "Best Discount" },
];

const PRICE_RANGES = [
  { label: "Under ₹2,000", min: 0, max: 2000 },
  { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { label: "Above ₹20,000", min: 20000, max: Infinity },
];

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = CATEGORIES.find((c) => c.slug === slug);
  const allItems = getByCategory(slug);

  const [sort, setSort] = useState("popular");
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyBestSeller, setOnlyBestSeller] = useState(false);
  const [cols, setCols] = useState<2 | 4>(4);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let items = [...allItems];
    if (onlyNew) items = items.filter((s) => s.isNew);
    if (onlyBestSeller) items = items.filter((s) => s.isBestSeller);
    if (priceFilter !== null) {
      const range = PRICE_RANGES[priceFilter];
      items = items.filter((s) => s.price >= range.min && s.price <= range.max);
    }
    switch (sort) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
      case "discount": items.sort((a, b) => b.discount - a.discount); break;
      case "newest": items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }
    return items;
  }, [allItems, sort, priceFilter, onlyNew, onlyBestSeller]);

  const activeFilters = (priceFilter !== null ? 1 : 0) + (onlyNew ? 1 : 0) + (onlyBestSeller ? 1 : 0);

  const clearAll = () => { setPriceFilter(null); setOnlyNew(false); setOnlyBestSeller(false); };

  if (!cat) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        Category not found. <Link to="/shop" className="text-brand underline">Browse all</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-48 md:h-72 overflow-hidden">
        <img src={cat.image} alt={cat.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-8 text-white">
          <nav className="text-xs opacity-70 mb-2">
            <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{cat.name}</span>
          </nav>
          <h1 className="font-display text-3xl md:text-5xl font-bold">{cat.name}</h1>
          <p className="text-sm mt-1 opacity-80">{allItems.length} products · Handcrafted with love</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Filter toggle (mobile) */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFilters > 0 && <span className="bg-brand text-brand-foreground text-[10px] rounded-full px-1.5">{activeFilters}</span>}
          </Button>

          {/* Active filter chips */}
          {priceFilter !== null && (
            <span className="flex items-center gap-1 text-xs bg-brand/10 text-brand border border-brand/30 px-2 py-1 rounded-full">
              {PRICE_RANGES[priceFilter].label}
              <button onClick={() => setPriceFilter(null)}><X className="h-3 w-3" /></button>
            </span>
          )}
          {onlyNew && (
            <span className="flex items-center gap-1 text-xs bg-brand/10 text-brand border border-brand/30 px-2 py-1 rounded-full">
              New Arrivals <button onClick={() => setOnlyNew(false)}><X className="h-3 w-3" /></button>
            </span>
          )}
          {onlyBestSeller && (
            <span className="flex items-center gap-1 text-xs bg-brand/10 text-brand border border-brand/30 px-2 py-1 rounded-full">
              Bestsellers <button onClick={() => setOnlyBestSeller(false)}><X className="h-3 w-3" /></button>
            </span>
          )}
          {activeFilters > 0 && (
            <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-brand underline">Clear all</button>
          )}

          <div className="ml-auto flex items-center gap-3">
            {/* Grid toggle */}
            <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
              <button onClick={() => setCols(4)} className={`p-1 rounded ${cols === 4 ? "bg-muted" : "hover:bg-muted/50"}`}>
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setCols(2)} className={`p-1 rounded ${cols === 2 ? "bg-muted" : "hover:bg-muted/50"}`}>
                <Grid2X2 className="h-4 w-4" />
              </button>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none text-sm border rounded-lg px-3 py-2 pr-8 bg-background hover:border-brand focus:outline-none focus:border-brand cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <p className="text-sm text-muted-foreground hidden sm:block">{filtered.length} products</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters — desktop always visible, mobile drawer */}
          <aside className={`
            ${showFilters ? "block" : "hidden"} lg:block
            w-full lg:w-56 shrink-0 space-y-6
            lg:static fixed inset-0 z-40 bg-background lg:bg-transparent p-6 lg:p-0 overflow-y-auto
          `}>
            {/* Mobile close */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="font-semibold text-base">Filters</h2>
              <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((r, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === i}
                      onChange={() => setPriceFilter(priceFilter === i ? null : i)}
                      className="accent-brand"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Collections</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand">
                  <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} className="accent-brand rounded" />
                  New Arrivals
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand">
                  <input type="checkbox" checked={onlyBestSeller} onChange={(e) => setOnlyBestSeller(e.target.checked)} className="accent-brand rounded" />
                  Bestsellers
                </label>
              </div>
            </div>

            {/* Other categories */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Browse Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    onClick={() => setShowFilters(false)}
                    className={`block text-sm px-2 py-1.5 rounded-md transition hover:text-brand hover:bg-brand/5 ${c.slug === slug ? "text-brand font-semibold bg-brand/5" : "text-muted-foreground"}`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile apply */}
            <div className="lg:hidden pt-4">
              <Button className="w-full" onClick={() => setShowFilters(false)}>Apply Filters</Button>
            </div>
          </aside>

          {/* Mobile overlay backdrop */}
          {showFilters && (
            <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setShowFilters(false)} />
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <p className="text-lg mb-3">No products match your filters</p>
                <Button variant="outline" onClick={clearAll}>Clear Filters</Button>
              </div>
            ) : (
              <motion.div
                key={`${sort}-${priceFilter}-${onlyNew}-${onlyBestSeller}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`grid gap-4 md:gap-5 ${
                  cols === 2
                    ? "grid-cols-2 md:grid-cols-2"
                    : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {filtered.map((s, i) => (
                  <ProductCard key={s.id} saree={s} index={i} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
