import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SAREES } from "@/lib/data";
import { formatINR, useCart, useWishlist } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist · CraftMySarees" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const add = useCart((s) => s.add);
  const items = SAREES.filter((s) => ids.includes(s.id));

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="font-display text-3xl font-bold mt-4">Your wishlist is empty</h1>
        <p className="text-muted-foreground mt-2">Heart your favorites to save them here</p>
        <Link to="/shop"><Button className="mt-6 bg-brand hover:bg-brand/90 text-brand-foreground">Explore Sarees</Button></Link>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-6">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((s) => (
          <div key={s.id} className="border rounded-xl overflow-hidden bg-card group">
            <Link to="/product/$id" params={{ id: s.id }} className="block aspect-[3/4] bg-muted overflow-hidden">
              <img src={s.images[0]} alt={s.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
            </Link>
            <div className="p-3 space-y-2">
              <h3 className="text-sm font-medium line-clamp-1">{s.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm">{formatINR(s.price)}</span>
                <span className="text-xs line-through text-muted-foreground">{formatINR(s.originalPrice)}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground" onClick={() => { add(s); remove(s.id); toast.success("Moved to cart"); }}>
                  <ShoppingBag className="h-3 w-3 mr-1" /> Move to Cart
                </Button>
                <Button size="sm" variant="outline" onClick={() => remove(s.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
