import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart, useWishlist } from "@/lib/store";

export function MobileBottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const count = useCart((s) => s.count());
  const wish = useWishlist((s) => s.ids.length);
  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/shop", icon: Search, label: "Shop" },
    { to: "/wishlist", icon: Heart, label: "Wishlist", badge: wish },
    { to: "/cart", icon: ShoppingBag, label: "Cart", badge: count },
    { to: "/profile", icon: User, label: "Account" },
  ] as const;
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = path === it.to;
          return (
            <Link key={it.to} to={it.to} className="flex flex-col items-center justify-center py-2 gap-0.5 relative">
              <div className="relative">
                <it.icon className={`h-5 w-5 ${active ? "text-brand" : "text-muted-foreground"}`} />
                {"badge" in it && it.badge ? (
                  <span className="absolute -top-1.5 -right-2 bg-brand text-brand-foreground text-[9px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {it.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] ${active ? "text-brand font-semibold" : "text-muted-foreground"}`}>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
