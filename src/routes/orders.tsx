import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/store";
import { Package, Download, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CartItem } from "@/lib/store";

type Order = { id: string; date: string; items: CartItem[]; total: number; status: string; payment: string };

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders · CraftMySarees" }] }),
  component: Orders,
});

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem("cms-orders") || "[]"));
  }, []);

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground" />
        <h1 className="font-display text-3xl font-bold mt-4">No orders yet</h1>
        <Link to="/shop"><Button className="mt-6 bg-brand hover:bg-brand/90 text-brand-foreground">Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-6">My Orders</h1>
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4 mt-4">
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </TabsContent>
        <TabsContent value="delivered" className="text-muted-foreground p-8 text-center">No delivered orders yet.</TabsContent>
        <TabsContent value="cancelled" className="text-muted-foreground p-8 text-center">No cancelled orders.</TabsContent>
        <TabsContent value="returns" className="text-muted-foreground p-8 text-center">No return requests.</TabsContent>
      </Tabs>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const steps = ["Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const current = 1;
  return (
    <div className="border rounded-xl bg-card p-5">
      <div className="flex flex-wrap justify-between gap-3 mb-4">
        <div>
          <div className="text-xs text-muted-foreground">Order #{order.id}</div>
          <div className="text-sm font-medium">Placed on {new Date(order.date).toLocaleDateString("en-IN")}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{formatINR(order.total)}</div>
          <div className="text-xs text-muted-foreground uppercase">{order.payment}</div>
        </div>
      </div>
      <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar">
        {order.items.map((i) => (
          <img key={i.id} src={i.saree.images[0]} alt="" className="w-16 h-20 rounded object-cover flex-shrink-0" />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center text-center">
            <div className={`h-3 w-3 rounded-full ${i <= current ? "bg-brand" : "bg-muted"}`} />
            <span className={`text-[10px] mt-1 ${i <= current ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> Invoice</Button>
        <Button size="sm" variant="outline">Track Order</Button>
        <Button size="sm" variant="outline"><RotateCcw className="h-3 w-3 mr-1" /> Reorder</Button>
      </div>
    </div>
  );
}
