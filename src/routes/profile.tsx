import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { User, MapPin, Heart, Package, Settings, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/store";
import { useEffect } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Account · CraftMySarees" }] }),
  component: Profile,
});

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!user) navigate({ to: "/login" }); }, [user, navigate]);
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="h-fit p-5 border rounded-xl bg-card">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-xl">{user.name[0]?.toUpperCase()}</div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <nav className="mt-6 space-y-1 text-sm">
            <NavItem icon={User} label="Personal Info" />
            <Link to="/orders"><NavItem icon={Package} label="My Orders" /></Link>
            <Link to="/wishlist"><NavItem icon={Heart} label="Wishlist" /></Link>
            <NavItem icon={MapPin} label="Addresses" />
            <NavItem icon={Bell} label="Notifications" />
            <NavItem icon={Settings} label="Settings" />
            <button onClick={() => { logout(); navigate({ to: "/" }); }} className="w-full">
              <NavItem icon={LogOut} label="Logout" className="text-destructive" />
            </button>
          </nav>
        </aside>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Personal</TabsTrigger>
            <TabsTrigger value="addr">Addresses</TabsTrigger>
            <TabsTrigger value="notif">Notifications</TabsTrigger>
            <TabsTrigger value="set">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="p-6 border rounded-xl bg-card mt-4">
            <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Fld label="Full Name" value={user.name} />
              <Fld label="Email" value={user.email} />
              <Fld label="Mobile" value="+91 98765 43210" />
              <Fld label="Date of Birth" value="" />
            </div>
            <Button className="mt-4 bg-brand hover:bg-brand/90 text-brand-foreground">Save Changes</Button>
          </TabsContent>
          <TabsContent value="addr" className="p-6 border rounded-xl bg-card mt-4">
            <div className="flex justify-between mb-4"><h2 className="font-semibold text-lg">Saved Addresses</h2><Button size="sm" variant="outline">+ Add Address</Button></div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between"><div className="font-semibold">{user.name} <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded ml-2">Default</span></div></div>
              <p className="text-sm text-muted-foreground mt-1">123 Saree Lane, Bandra West, Mumbai, Maharashtra 400050</p>
              <p className="text-sm text-muted-foreground">Mobile: +91 98765 43210</p>
            </div>
          </TabsContent>
          <TabsContent value="notif" className="p-6 border rounded-xl bg-card mt-4 space-y-3">
            {[
              { t: "Your order ORD-2031 has been shipped", d: "2 hours ago", c: "Order Update" },
              { t: "New arrivals in Banarasi collection", d: "Yesterday", c: "New Arrivals" },
              { t: "Festive sale — up to 60% off", d: "3 days ago", c: "Offers" },
              { t: "Your order ORD-2019 was delivered", d: "1 week ago", c: "Delivery" },
            ].map((n, i) => (
              <div key={i} className="p-3 border rounded-lg flex justify-between">
                <div>
                  <p className="text-sm">{n.t}</p>
                  <span className="text-xs text-brand">{n.c}</span>
                </div>
                <span className="text-xs text-muted-foreground">{n.d}</span>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="set" className="p-6 border rounded-xl bg-card mt-4">
            <h2 className="font-semibold text-lg mb-4">Settings</h2>
            <p className="text-sm text-muted-foreground">Account preferences, language, and notifications coming soon.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, className = "" }: { icon: typeof User; label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted cursor-pointer ${className}`}>
      <Icon className="h-4 w-4" /><span>{label}</span>
    </div>
  );
}
function Fld({ label, value }: { label: string; value: string }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label><Input defaultValue={value} /></div>;
}
