import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR, useCart } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart · CraftMySarees" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());
  const total = useCart((s) => s.total());
  const shipping = subtotal > 2000 ? 0 : subtotal === 0 ? 0 : 99;
  const discount = items.reduce((a, i) => a + (i.saree.originalPrice - i.saree.price) * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="font-display text-3xl font-bold mt-4">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Discover our handpicked sarees</p>
        <Link to="/shop"><Button className="mt-6 bg-brand hover:bg-brand/90 text-brand-foreground">Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-6">Shopping Cart ({items.length})</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 p-4 border rounded-xl bg-card">
              <Link to="/product/$id" params={{ id: i.saree.id }}>
                <img src={i.saree.images[0]} alt={i.saree.name} className="w-24 h-32 md:w-28 md:h-36 object-cover rounded-lg" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to="/product/$id" params={{ id: i.saree.id }} className="font-semibold hover:text-brand line-clamp-1">{i.saree.name}</Link>
                <p className="text-xs text-muted-foreground">{i.saree.fabric} · {i.saree.color}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-semibold">{formatINR(i.saree.price)}</span>
                  <span className="text-xs line-through text-muted-foreground">{formatINR(i.saree.originalPrice)}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(i.id, i.qty - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(i.id, i.qty + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(i.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit p-6 border rounded-xl bg-card sticky top-24">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal + discount)} />
            <Row label="Discount" value={`− ${formatINR(discount)}`} className="text-success" />
            <Row label="Shipping" value={shipping === 0 ? "FREE" : formatINR(shipping)} />
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span><span>{formatINR(total)}</span>
          </div>
          <Link to="/checkout"><Button className="w-full mt-5 bg-brand hover:bg-brand/90 text-brand-foreground" size="lg">Proceed to Checkout</Button></Link>
          <p className="text-xs text-center text-muted-foreground mt-3">Free shipping on orders above ₹2,000</p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return <div className={`flex justify-between ${className}`}><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
