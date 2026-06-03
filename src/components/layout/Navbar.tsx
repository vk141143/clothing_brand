import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, User, Menu, Sun, Moon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, useWishlist, useTheme, useAuth } from "@/lib/store";
import { CATEGORIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const count = useCart((s) => s.count());
  const wishCount = useWishlist((s) => s.ids.length);
  const { theme, toggle } = useTheme();
  const user = useAuth((s) => s.user);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryHover, setCategoryHover] = useState(false);
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: "/shop", search: { q: query } as never });
      setSearchOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "glass shadow-soft" : "bg-background"} border-b`}>

      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="font-display text-2xl font-bold text-gradient-brand mb-6">CraftMySarees</div>
            <nav className="flex flex-col gap-1">
              <Link to="/" className="px-3 py-2 rounded-lg hover:bg-muted">Home</Link>
              <Link to="/shop" className="px-3 py-2 rounded-lg hover:bg-muted">Shop All</Link>
              <div className="px-3 py-2 text-xs uppercase text-muted-foreground mt-2">Categories</div>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="px-3 py-2 rounded-lg hover:bg-muted text-sm">
                  {c.name}
                </Link>
              ))}
              <div className="border-t mt-3 pt-3">
                <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-muted block">Admin Dashboard</Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="font-display text-xl md:text-2xl font-bold text-gradient-brand whitespace-nowrap">
          CraftMySarees
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-6">
          <Link to="/" className={`px-3 py-2 text-sm rounded-md hover:text-brand ${path === "/" ? "text-brand font-semibold" : ""}`}>Home</Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setCategoryHover(true)}
            onMouseLeave={() => setCategoryHover(false)}
          >
            <button className="px-3 py-2 text-sm rounded-md hover:text-brand transition-colors">Categories</button>
            
            <AnimatePresence>
              {categoryHover && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="fixed left-0 right-0 top-16 z-50"
                >
                  <div className="bg-white dark:bg-slate-950 border-b shadow-lg w-full">
                    <div className="px-4 py-6 w-full max-w-full">
                      <div className="grid grid-cols-6 gap-3">
                        {CATEGORIES.map((category) => (
                          <Link
                            key={category.slug}
                            to="/category/$slug"
                            params={{ slug: category.slug }}
                            className="group/item"
                          >
                            <div className="relative overflow-hidden rounded-lg h-32 bg-muted mb-3 border border-gray-200 dark:border-slate-700">
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors duration-300" />
                            </div>
                            <h4 className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 group-hover/item:text-brand transition-colors duration-200 line-clamp-2">
                              {category.name}
                            </h4>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/shop" className={`px-3 py-2 text-sm rounded-md hover:text-brand ${path === "/shop" ? "text-brand font-semibold" : ""}`}>Shop</Link>
          <Link to="/category/$slug" params={{ slug: "bridal" }} className="px-3 py-2 text-sm rounded-md hover:text-brand">Bridal</Link>
          <Link to="/orders" className="px-3 py-2 text-sm rounded-md hover:text-brand">Orders</Link>
        </nav>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-md ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sarees, fabric, color..." className="pl-9 bg-muted/50" />
        </form>

        <div className="flex items-center gap-1 md:ml-2 ml-auto">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)}><Search className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishCount > 0 && <Badge>{wishCount}</Badge>}
            </Button>
          </Link>
          <Link to={user ? "/profile" : "/login"}>
            <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && <Badge>{count}</Badge>}
            </Button>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t p-3 bg-background"
          >
            <form onSubmit={submitSearch} className="flex gap-2">
              <Input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sarees..." />
              <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)}><X className="h-4 w-4" /></Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-1 -right-1 bg-brand text-brand-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
      {children}
    </span>
  );
}
