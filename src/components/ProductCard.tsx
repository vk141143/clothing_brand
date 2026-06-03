import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Saree } from "@/lib/data";
import { formatINR, useCart, useWishlist } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProductCard({ saree, index = 0, small = false }: { saree: Saree; index?: number; small?: boolean }) {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const isWished = useWishlist((s) => s.ids.includes(saree.id));

  const stockLabel =
    saree.stock === 0 ? "Out of stock" : saree.stock <= 2 ? `Only ${saree.stock} left` : saree.stock <= 5 ? "Limited stock" : "In stock";
  const stockColor = saree.stock === 0 ? "text-destructive" : saree.stock <= 5 ? "text-warning" : "text-success";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: (index % 8) * 0.05 } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      className="group"
    >
      <Link to="/product/$id" params={{ id: saree.id }} className="block">
        <div className={`relative overflow-hidden rounded-xl bg-muted ${small ? "aspect-[2/3]" : "aspect-[3/4]"}`}>
          <img
            src={saree.images[0]}
            alt={saree.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <img
            src={saree.images[1]}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {saree.isNew && <span className="bg-sky text-sky-foreground text-[10px] font-bold px-2 py-0.5 rounded">NEW</span>}
            {saree.isBestSeller && <span className="bg-gold text-navy text-[10px] font-bold px-2 py-0.5 rounded">BESTSELLER</span>}
            {saree.isLimited && <span className="bg-brand text-brand-foreground text-[10px] font-bold px-2 py-0.5 rounded">LIMITED</span>}
          </div>
          {saree.discount > 0 && (
            <span className="absolute top-2 right-2 bg-brand text-brand-foreground text-xs font-bold px-2 py-1 rounded">
              {saree.discount}% OFF
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWish(saree.id);
              toast.success(isWished ? "Removed from wishlist" : "Added to wishlist");
            }}
            className="absolute bottom-2 right-2 h-9 w-9 rounded-full glass flex items-center justify-center hover:scale-110 transition"
            aria-label="Wishlist"
          >
            <Heart className={`h-4 w-4 ${isWished ? "fill-brand text-brand" : ""}`} />
          </button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              add(saree);
              toast.success("Added to cart");
            }}
            className="absolute bottom-2 left-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity bg-navy hover:bg-navy/90 text-navy-foreground"
            size="sm"
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1" /> Add to Cart
          </Button>
        </div>
        <div className="pt-3 space-y-1">
          <h3 className="text-sm font-medium line-clamp-1 group-hover:text-brand transition">{saree.name}</h3>
          <p className="text-xs text-muted-foreground">{saree.fabric}</p>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="flex items-center gap-0.5 bg-success/10 text-success px-1.5 py-0.5 rounded">
              <Star className="h-3 w-3 fill-current" /> {saree.rating}
            </span>
            <span className="text-muted-foreground">({saree.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-semibold">{formatINR(saree.price)}</span>
            <span className="text-xs text-muted-foreground line-through">{formatINR(saree.originalPrice)}</span>
            <span className="text-xs text-success font-semibold">{saree.discount}% off</span>
          </div>
          <p className={`text-xs ${stockColor}`}>{stockLabel}</p>
        </div>
      </Link>
    </motion.div>
  );
}
