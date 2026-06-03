import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SAREES, CATEGORIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Grid3x3, List, SlidersHorizontal } from "lucide-react";
import { formatINR } from "@/lib/store";

type Search = { q?: string; cat?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    cat: typeof s.cat === "string" ? s.cat : undefined,
  }),
  head: () => ({ meta: [{ title: "Shop All Sarees · CraftMySarees" }, { name: "description", content: "Browse our complete collection of handwoven sarees with filters." }] }),
  component: Shop,
});

function Shop() {
  const { q, cat } = Route.useSearch();
  const [price, setPrice] = useState<[number, number]>([0, 30000]);
  const [cats, setCats] = useState<string[]>(cat ? [cat] : []);
  const [fabrics, setFabrics] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let r = SAREES.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.fabric.toLowerCase().includes(q.toLowerCase())) return false;
      if (cats.length && !cats.includes(s.category)) return false;
      if (fabrics.length && !fabrics.includes(s.fabric)) return false;
      if (s.price < price[0] || s.price > price[1]) return false;
      if (s.rating < minRating) return false;
      return true;
    });
    switch (sort) {
      case "low": r = [...r].sort((a, b) => a.price - b.price); break;
      case "high": r = [...r].sort((a, b) => b.price - a.price); break;
      case "rating": r = [...r].sort((a, b) => b.rating - a.rating); break;
      case "new": r = [...r].sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
    }
    return r;
  }, [q, cats, fabrics, price, minRating, sort]);

  const allFabrics = Array.from(new Set(SAREES.map((s) => s.fabric)));

  const Filters = (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <Slider value={price} onValueChange={(v) => setPrice(v as [number, number])} min={0} max={30000} step={500} />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatINR(price[0])}</span><span>{formatINR(price[1])}</span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2 max-h-60 overflow-auto pr-2">
          {CATEGORIES.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={cats.includes(c.slug)} onCheckedChange={(v) => setCats((p) => (v ? [...p, c.slug] : p.filter((x) => x !== c.slug)))} />
              {c.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Fabric</h4>
        <div className="space-y-2">
          {allFabrics.map((f) => (
            <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={fabrics.includes(f)} onCheckedChange={(v) => setFabrics((p) => (v ? [...p, f] : p.filter((x) => x !== f)))} />
              {f}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={minRating === r} onCheckedChange={(v) => setMinRating(v ? r : 0)} />
              {r}★ & above
            </label>
          ))}
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={() => { setCats([]); setFabrics([]); setPrice([0, 30000]); setMinRating(0); }}>
        Clear filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">All Sarees</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products{q ? ` for "${q}"` : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex border rounded-md">
            <Button variant={view === "grid" ? "default" : "ghost"} size="icon" onClick={() => setView("grid")}><Grid3x3 className="h-4 w-4" /></Button>
            <Button variant={view === "list" ? "default" : "ghost"} size="icon" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40 md:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="new">Newest</SelectItem>
              <SelectItem value="low">Price: Low to High</SelectItem>
              <SelectItem value="high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden"><SlidersHorizontal className="h-4 w-4" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-auto"><div className="pt-6">{Filters}</div></SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block">{Filters}</aside>
        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No sarees match your filters.</div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((s, i) => <ProductCard key={s.id} saree={s} index={i} small />)}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((s) => (
                <div key={s.id} className="flex gap-4 p-4 border rounded-xl hover:shadow-soft transition">
                  <img src={s.images[0]} alt={s.name} className="w-32 h-40 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.fabric} · {s.color}</p>
                    <p className="text-sm mt-2 line-clamp-2">{s.description}</p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-semibold">{formatINR(s.price)}</span>
                      <span className="text-xs line-through text-muted-foreground">{formatINR(s.originalPrice)}</span>
                      <span className="text-xs text-success font-semibold">{s.discount}% off</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
