import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, Users, Truck, Star, Bell, MessageSquare, BarChart3, Settings, ArrowLeft, Boxes, LogOut, Menu, X } from "lucide-react";
import { useTheme, useAuth } from "@/lib/store";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · CraftMySarees" }] }),
  beforeLoad: ({ location }) => {
    // Skip guard for the login sub-route itself
    if (location.pathname === "/admin/login") return;
    const raw = localStorage.getItem("cms-auth");
    const user = raw ? JSON.parse(raw)?.state?.user : null;
    if (!user?.isAdmin) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});

type NavItem = { to: string; icon: typeof LayoutDashboard; label: string; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/inventory", icon: Boxes, label: "Inventory" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/delivery", icon: Truck, label: "Delivery" },
  { to: "/admin/reviews", icon: Star, label: "Reviews" },
  { to: "/admin/notifications", icon: Bell, label: "Notifications" },
  { to: "/admin/support", icon: MessageSquare, label: "Support" },
  // { to: "/admin/reports", icon: BarChart3, label: "Reports" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

function AdminLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { theme } = useTheme();
  const logout = useAuth((s) => s.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [path]);

  // Login page renders standalone (no sidebar)
  if (path === "/admin/login") return <Outlet />;

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar - Slide from left */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-navy text-navy-foreground transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div>
            <Link to="/" className="font-display text-xl font-bold">CraftMySarees</Link>
            <p className="text-xs opacity-70">Admin Panel</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-auto h-[calc(100vh-140px)]">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as never} className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition ${active ? "bg-brand text-brand-foreground" : "hover:bg-white/10"}`}>
                <n.icon className="h-5 w-5" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-3">
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
          <button onClick={logout} className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 text-left w-full">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-navy text-navy-foreground p-4 sticky top-0 h-screen">
        <Link to="/" className="font-display text-xl font-bold mb-1">CraftMySarees</Link>
        <p className="text-xs opacity-70 mb-6">Admin Panel</p>
        <nav className="space-y-1 flex-1 overflow-auto">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as never} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${active ? "bg-brand text-brand-foreground" : "hover:bg-white/10"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/" className="flex items-center gap-2 text-xs opacity-70 hover:opacity-100 mt-4">
          <ArrowLeft className="h-3 w-3" /> Back to Store
        </Link>
        <button onClick={logout} className="flex items-center gap-2 text-xs opacity-70 hover:opacity-100 mt-2 text-left">
          <LogOut className="h-3 w-3" /> Logout
        </button>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="lg:hidden bg-navy text-navy-foreground p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-white/10 rounded-lg -ml-2">
            <Menu className="h-6 w-6" />
          </button>
          <div className="font-display font-bold text-sm">CraftMySarees</div>
          <Link to="/" className="text-xs">← Store</Link>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
