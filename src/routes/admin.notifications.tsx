import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

function AdminNotifications() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Notifications</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-card border rounded-xl space-y-3">
          <h2 className="font-semibold">Send Notification</h2>
          <div className="space-y-1.5"><Label className="text-xs">Type</Label>
            <Select defaultValue="promo"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="promo">Promotional</SelectItem>
                <SelectItem value="order">Order Update</SelectItem>
                <SelectItem value="new">New Arrival</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input /></div>
          <div className="space-y-1.5"><Label className="text-xs">Message</Label><Textarea rows={4} /></div>
          <Button className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">Send to All Users</Button>
        </div>
        <div className="p-6 bg-card border rounded-xl">
          <h2 className="font-semibold mb-3">Recent Sends</h2>
          <div className="space-y-2">
            {[
              { t: "Diwali Sale: up to 60% off", c: "Promo", d: "12K sent" },
              { t: "New Banarasi collection", c: "New Arrival", d: "12K sent" },
              { t: "Order #ORD3420 shipped", c: "Order", d: "1 sent" },
            ].map((n, i) => (
              <div key={i} className="p-3 border rounded-lg flex justify-between">
                <div><p className="text-sm font-medium">{n.t}</p><p className="text-xs text-brand">{n.c}</p></div>
                <span className="text-xs text-muted-foreground">{n.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
