import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, CreditCard, Smartphone, Wallet, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatINR, useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · CraftMySarees" }] }),
  component: Checkout,
});

function Checkout() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState(1);
  const [pay, setPay] = useState("upi");
  const navigate = useNavigate();
  const shipping = subtotal > 2000 ? 0 : 99;

  const placeOrder = () => {
    const order = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total,
      status: "Confirmed",
      payment: pay,
    };
    const existing = JSON.parse(localStorage.getItem("cms-orders") || "[]");
    localStorage.setItem("cms-orders", JSON.stringify([order, ...existing]));
    clear();
    toast.success("Order placed successfully!");
    navigate({ to: "/orders" });
  };

  if (items.length === 0) {
    return <div className="container mx-auto px-4 py-20 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-6">Checkout</h1>
      <div className="flex items-center gap-2 mb-6 text-sm">
        {["Address", "Delivery", "Payment"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i ? "bg-success text-white" : step === i + 1 ? "bg-brand text-brand-foreground" : "bg-muted"}`}>
              {step > i ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={step === i + 1 ? "font-semibold" : "text-muted-foreground"}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-border mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          {step === 1 && (
            <div className="p-6 border rounded-xl bg-card space-y-4">
              <h3 className="font-semibold text-lg">Shipping Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name" />
                <Field label="Mobile Number" />
                <Field label="Pincode" />
                <Field label="City" />
                <div className="md:col-span-2"><Field label="Address" /></div>
                <Field label="State" />
                <Field label="Landmark (Optional)" />
              </div>
              <Button onClick={() => setStep(2)} className="bg-brand hover:bg-brand/90 text-brand-foreground">Continue</Button>
            </div>
          )}
          {step === 2 && (
            <div className="p-6 border rounded-xl bg-card space-y-4">
              <h3 className="font-semibold text-lg">Delivery Method</h3>
              <RadioGroup defaultValue="standard" className="space-y-3">
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="standard" />
                    <div><div className="font-semibold">Standard Delivery</div><div className="text-xs text-muted-foreground">4–7 business days</div></div>
                  </div>
                  <span className="font-semibold">{shipping === 0 ? "FREE" : formatINR(99)}</span>
                </label>
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="express" />
                    <div><div className="font-semibold">Express Delivery</div><div className="text-xs text-muted-foreground">1–2 business days</div></div>
                  </div>
                  <span className="font-semibold">{formatINR(199)}</span>
                </label>
              </RadioGroup>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} className="bg-brand hover:bg-brand/90 text-brand-foreground">Continue to Payment</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="p-6 border rounded-xl bg-card space-y-4">
              <h3 className="font-semibold text-lg">Payment Method</h3>
              <RadioGroup value={pay} onValueChange={setPay} className="space-y-2">
                {[
                  { v: "upi", icon: Smartphone, t: "UPI", d: "Pay via Google Pay, PhonePe, Paytm" },
                  { v: "card", icon: CreditCard, t: "Credit/Debit Card", d: "Visa, Mastercard, RuPay, Amex" },
                  { v: "netbank", icon: Wallet, t: "Net Banking", d: "All major banks supported" },
                  { v: "cod", icon: Banknote, t: "Cash on Delivery", d: "Pay when you receive" },
                ].map((p) => (
                  <label key={p.v} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${pay === p.v ? "border-brand bg-brand/5" : ""}`}>
                    <RadioGroupItem value={p.v} />
                    <p.icon className="h-5 w-5 text-brand" />
                    <div className="flex-1"><div className="font-semibold">{p.t}</div><div className="text-xs text-muted-foreground">{p.d}</div></div>
                  </label>
                ))}
              </RadioGroup>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={placeOrder} className="bg-brand hover:bg-brand/90 text-brand-foreground flex-1">Place Order · {formatINR(total)}</Button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit p-6 border rounded-xl bg-card sticky top-24">
          <h3 className="font-semibold mb-4">Order Summary ({items.length})</h3>
          <div className="space-y-3 max-h-64 overflow-auto pr-2">
            {items.map((i) => (
              <div key={i.id} className="flex gap-3 text-sm">
                <img src={i.saree.images[0]} alt="" className="w-14 h-16 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{i.saree.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
                </div>
                <span className="font-semibold">{formatINR(i.saree.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label }: { label: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input />
    </div>
  );
}
