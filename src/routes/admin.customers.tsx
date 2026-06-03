import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/store";
import {
  CUSTOMERS, MEMBERSHIP_COLORS, STATUS_COLORS,
  type Customer, type CustomerStatus, type MembershipLevel,
} from "@/lib/customers-data";
import { ORDERS } from "@/lib/orders-data";
import {
  Eye, X, Users, UserCheck, UserX, TrendingUp, DollarSign,
  Calendar, Mail, Phone, MapPin, ShoppingBag, Package,
  CheckCircle2, XCircle, RotateCcw, Heart, Clock,
  Search, Filter, ChevronLeft, ChevronRight, Award,
  Verified, AlertCircle, Star, MessageSquare, Gift,
  Bell, Ban, Trash2, Edit, List, CreditCard, FileText,
  Activity, Eye as EyeIcon, Send, Ticket, Download,
} from "lucide-react";

function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, "'")}"` ).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = filename; a.click();
}

export const Route = createFileRoute("/admin/customers")({
  component: Customers,
});

// ── helpers ────────────────────────────────────────────────────────────────
function fmt(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── StatCard ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: typeof Users; color: string;
}) {
  return (
    <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}><Icon className="h-4 w-4" /></div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-lg leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ text, cls }: { text: string; cls: string }) {
  return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${cls}`}>{text}</span>;
}

// ── Section / Field / Grid ─────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
      {children}
    </div>
  );
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{children}</div>;
}
function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-muted/40 rounded-lg px-3 py-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${highlight ? "text-brand" : ""}`}>{value || "—"}</p>
    </div>
  );
}

// ── Customer Detail Modal ──────────────────────────────────────────────────
function CustomerModal({
  customer, customers, onClose, onNavigate,
}: {
  customer: Customer;
  customers: Customer[];
  onClose: () => void;
  onNavigate: (c: Customer) => void;
}) {
  const idx = customers.findIndex((c) => c.id === customer.id);
  const customerOrders = ORDERS.filter(o => o.customer.id === customer.id);
  const avgOrderValue = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-6 px-3">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-card rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            {/* Prev / Next */}
            <div className="flex items-center gap-1">
              <button
                disabled={idx <= 0}
                onClick={() => onNavigate(customers[idx - 1])}
                className="p-1.5 rounded-lg border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-muted-foreground font-medium px-1">{idx + 1}/{customers.length}</span>
              <button
                disabled={idx >= customers.length - 1}
                onClick={() => onNavigate(customers[idx + 1])}
                className="p-1.5 rounded-lg border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <img src={customer.avatar} alt={customer.name} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <h2 className="font-display text-xl font-bold">{customer.name}</h2>
              <p className="text-xs text-muted-foreground">Customer ID: {customer.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge text={customer.status} cls={STATUS_COLORS[customer.status]} />
            <Badge text={customer.membership} cls={MEMBERSHIP_COLORS[customer.membership]} />
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition ml-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">

          {/* ── Customer Information ── */}
          <Section title="Customer Information">
            <Grid2>
              <Field label="Customer ID" value={customer.id} highlight />
              <Field label="Customer Name" value={customer.name} />
              <Field label="Mobile Number" value={customer.mobile} />
              <Field label="Email Address" value={customer.email} />
              <Field label="Gender" value={customer.gender} />
              <Field label="Date of Birth" value={fmt(customer.dob)} />
              <Field label="Registration Date" value={fmt(customer.registrationDate)} />
              <Field label="Last Login Date" value={fmt(customer.lastLogin)} />
              <Field label="Account Status" value={customer.status} />
            </Grid2>
            <div className="mt-3 flex items-center gap-4 text-xs">
              {customer.emailVerified ? (
                <span className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Email Verified
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-600">
                  <AlertCircle className="h-3.5 w-3.5" /> Email Not Verified
                </span>
              )}
              {customer.mobileVerified ? (
                <span className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Mobile Verified
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-600">
                  <AlertCircle className="h-3.5 w-3.5" /> Mobile Not Verified
                </span>
              )}
            </div>
          </Section>

          {/* ── Customer Addresses ── */}
          <Section title="Customer Addresses">
            <div className="space-y-3">
              {customer.addresses.map((addr, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand" />
                      <span className="font-semibold text-sm">{addr.type} Address</span>
                    </div>
                    {addr.isDefault && <Badge text="Default" cls="bg-green-100 text-green-700" />}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {addr.fullName}<br />
                    {addr.house}, {addr.street}<br />
                    {addr.city}, {addr.state} - {addr.pincode}<br />
                    {addr.country}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Account Information ── */}
          <Section title="Account Information">
            <Grid2>
              <Field label="Username" value={customer.username} />
              <Field label="Membership Level" value={customer.membership} />
              <Field label="Email Verified" value={customer.emailVerified ? "Yes" : "No"} />
              <Field label="Mobile Verified" value={customer.mobileVerified ? "Yes" : "No"} />
              <Field label="Login Count" value={String(customer.loginCount)} />
              <Field label="Last Login" value={fmt(customer.lastLogin)} />
            </Grid2>
          </Section>

          {/* ── Order Statistics ── */}
          <Section title="Order Statistics">
            <Grid2>
              <Field label="Total Orders" value={String(customer.totalOrders)} highlight />
              <Field label="Completed Orders" value={String(customer.completedOrders)} />
              <Field label="Cancelled Orders" value={String(customer.cancelledOrders)} />
              <Field label="Returned Orders" value={String(customer.returnedOrders)} />
              <Field label="Total Amount Spent" value={formatINR(customer.totalSpent)} highlight />
              <Field label="Average Order Value" value={formatINR(avgOrderValue)} />
              <Field label="Last Order Date" value={fmt(customer.lastOrderDate)} />
              <Field label="Favorite Category" value={customer.favoriteCategory} />
            </Grid2>
          </Section>

          {/* ── Wishlist Information ── */}
          <Section title="Wishlist Information">
            <Grid2>
              <Field label="Wishlist Products Count" value={String(customer.wishlistCount)} />
              <Field label="Cart Abandonments" value={String(customer.cartAbandonments)} />
              <Field label="Preferred Categories" value={customer.preferredCategories.join(", ")} />
            </Grid2>
          </Section>

          {/* ── Loyalty & Rewards ── */}
          <Section title="Loyalty & Rewards">
            <Grid2>
              <Field label="Reward Points" value={String(customer.rewardPoints)} highlight />
              <Field label="Coupons Used" value={String(customer.couponsUsed)} />
              <Field label="Available Coupons" value={String(customer.availableCoupons)} />
              <Field label="Membership Level" value={customer.membership} />
            </Grid2>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">Membership Tiers</p>
              <div className="flex gap-2">
                {(["Bronze", "Silver", "Gold", "Platinum"] as MembershipLevel[]).map((tier) => (
                  <div
                    key={tier}
                    className={`flex-1 rounded-lg p-3 text-center border-2 transition ${
                      customer.membership === tier
                        ? "border-brand bg-brand/5"
                        : "border-transparent bg-muted/50"
                    }`}
                  >
                    <Award className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs font-medium">{tier}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── Customer Activity ── */}
          <Section title="Customer Activity">
            <Grid2>
              <Field label="Last Login" value={fmt(customer.lastLogin)} />
              <Field label="Login Count" value={String(customer.loginCount)} />
              <Field label="Cart Abandonment Count" value={String(customer.cartAbandonments)} />
            </Grid2>
          </Section>

          {/* ── Support Information ── */}
          <Section title="Support Information">
            <Grid2>
              <Field label="Support Tickets Raised" value={String(customer.tickets.length)} />
              <Field label="Open Tickets" value={String(customer.tickets.filter(t => t.status === "Open").length)} />
              <Field label="Resolved Tickets" value={String(customer.tickets.filter(t => t.status === "Resolved").length)} />
              <Field label="Product Reviews Given" value={String(customer.reviewsGiven)} />
            </Grid2>
            {customer.tickets.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">Recent Tickets</p>
                {customer.tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{ticket.id} · {fmt(ticket.date)}</p>
                    </div>
                    <Badge
                      text={ticket.status}
                      cls={ticket.status === "Open" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}
                    />
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* ── Customer Notes (Admin Only) ── */}
          <Section title="Customer Notes (Admin Only)">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-900 mb-1">Internal Notes</p>
                  <p className="text-sm text-amber-800">
                    {customer.internalNotes || "No internal notes added yet."}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-amber-200">
                <p className="text-xs font-semibold text-amber-900 mb-1">Preferred Saree Categories</p>
                <p className="text-sm text-amber-800">{customer.preferredCategories.join(", ")}</p>
              </div>
            </div>
          </Section>

          {/* ── Recent Orders ── */}
          <Section title="Recent Orders">
            {customerOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No orders found</p>
            ) : (
              <div className="space-y-2">
                {customerOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition">
                    <div>
                      <p className="font-mono font-bold text-sm text-brand">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{fmt(order.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatINR(order.grandTotal)}</p>
                      <Badge text={order.status} cls={"bg-muted text-muted-foreground"} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

        </div>

        {/* ── Footer Actions ── */}
        <div className="p-5 border-t bg-muted/20 rounded-b-2xl space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Customer Actions</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Edit className="h-3.5 w-3.5" /> Edit Customer
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <List className="h-3.5 w-3.5" /> View Orders
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Heart className="h-3.5 w-3.5" /> View Wishlist
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> View Addresses
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Contact Customer
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Bell className="h-3.5 w-3.5" /> Send Notification
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Gift className="h-3.5 w-3.5" /> Send Coupon
              </Button>
              {customer.status === "Blocked" ? (
                <Button size="sm" variant="outline" className="gap-1.5 text-green-600 border-green-300 hover:bg-green-50">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Unblock Customer
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50">
                  <Ban className="h-3.5 w-3.5" /> Block Customer
                </Button>
              )}
              <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" /> Delete Customer
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground" onClick={onClose}>
              <X className="h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
function Customers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [membershipFilter, setMembershipFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minOrders, setMinOrders] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // ── Dashboard Stats ────────────────────────────────────────────
  const today = new Date().toDateString();
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const totalCustomers = CUSTOMERS.length;
  const activeCustomers = CUSTOMERS.filter(c => c.status === "Active").length;
  const newCustomersToday = CUSTOMERS.filter(c => new Date(c.registrationDate).toDateString() === today).length;
  const newCustomersThisMonth = CUSTOMERS.filter(c => new Date(c.registrationDate) >= thisMonth).length;
  const vipCustomers = CUSTOMERS.filter(c => c.status === "VIP").length;
  const blockedCustomers = CUSTOMERS.filter(c => c.status === "Blocked").length;
  
  const repeatCustomers = CUSTOMERS.filter(c => c.totalOrders > 1).length;
  const totalRevenue = CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / CUSTOMERS.reduce((sum, c) => sum + c.totalOrders, 0) || 0;
  const retentionRate = ((repeatCustomers / totalCustomers) * 100).toFixed(1);

  const dashStats = [
    { label: "Total Customers", value: totalCustomers, icon: Users, color: "bg-brand/10 text-brand" },
    { label: "Active Customers", value: activeCustomers, icon: UserCheck, color: "bg-green-100 text-green-600" },
    { label: "New Today", value: newCustomersToday, icon: TrendingUp, color: "bg-blue-100 text-blue-600" },
    { label: "New This Month", value: newCustomersThisMonth, icon: Calendar, color: "bg-purple-100 text-purple-600" },
    { label: "Repeat Customers", value: repeatCustomers, icon: RotateCcw, color: "bg-indigo-100 text-indigo-600" },
    { label: "VIP Customers", value: vipCustomers, icon: Award, color: "bg-yellow-100 text-yellow-600" },
    { label: "Blocked Customers", value: blockedCustomers, icon: UserX, color: "bg-red-100 text-red-600" },
    { label: "Total Revenue", value: formatINR(totalRevenue), icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
    { label: "Avg Order Value", value: formatINR(avgOrderValue), icon: ShoppingBag, color: "bg-cyan-100 text-cyan-600" },
    { label: "Retention Rate", value: `${retentionRate}%`, icon: TrendingUp, color: "bg-pink-100 text-pink-600" },
  ];

  // ── Filters ────────────────────────────────────────────────────
  const STATUS_OPTIONS: (CustomerStatus | "All")[] = ["All", "Active", "Inactive", "VIP", "Blocked"];
  const MEMBERSHIP_OPTIONS: (MembershipLevel | "All")[] = ["All", "Bronze", "Silver", "Gold", "Platinum"];

  const filtered = useMemo(() => {
    return CUSTOMERS.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || 
        c.name.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        c.mobile.includes(q) ||
        c.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchMembership = membershipFilter === "All" || c.membership === membershipFilter;
      
      const regDate = new Date(c.registrationDate);
      const matchFrom = !dateFrom || regDate >= new Date(dateFrom);
      const matchTo = !dateTo || regDate <= new Date(dateTo + "T23:59:59");
      const matchOrders = !minOrders || c.totalOrders >= parseInt(minOrders);
      
      return matchSearch && matchStatus && matchMembership && matchFrom && matchTo && matchOrders;
    });
  }, [search, statusFilter, membershipFilter, dateFrom, dateTo, minOrders]);

  const hasActiveFilters = statusFilter !== "All" || membershipFilter !== "All" || dateFrom || dateTo || minOrders;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Customers Management</h1>

      {/* Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {dashStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-card border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search by Name / Email / Mobile / ID" 
              value={search}
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9 h-9 text-sm" 
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowFilters((v) => !v)}>
            <Filter className="h-3.5 w-3.5" /> Filters {showFilters ? "▲" : "▼"}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="text-destructive"
              onClick={() => { 
                setStatusFilter("All"); 
                setMembershipFilter("All"); 
                setDateFrom("");
                setDateTo("");
                setMinOrders("");
              }}>
              Clear All
            </Button>
          )}
          <span className="ml-auto text-xs text-muted-foreground font-medium">{filtered.length} customers</span>
        </div>

        {showFilters && (
          <div className="space-y-3 pt-3 border-t">
            {/* Status Filter */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Filter by Status</p>
              <div className="flex flex-wrap gap-1">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition
                      ${statusFilter === s ? "bg-brand text-white border-brand" : "bg-muted hover:bg-accent border-transparent"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* Membership Filter */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Filter by Membership Level</p>
              <div className="flex flex-wrap gap-1">
                {MEMBERSHIP_OPTIONS.map((m) => (
                  <button key={m} onClick={() => setMembershipFilter(m)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition
                      ${membershipFilter === m ? "bg-brand text-white border-brand" : "bg-muted hover:bg-accent border-transparent"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {/* Registration Date Filter */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Filter by Registration Date</p>
              <div className="flex items-center gap-2">
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 text-xs w-36" placeholder="From" />
                <span className="text-xs text-muted-foreground">to</span>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 text-xs w-36" placeholder="To" />
              </div>
            </div>
            {/* Total Orders Filter */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Filter by Total Orders (Minimum)</p>
              <Input 
                type="number" 
                value={minOrders} 
                onChange={(e) => setMinOrders(e.target.value)} 
                className="h-8 text-xs w-36" 
                placeholder="Min orders (e.g. 5)"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-card border rounded-xl overflow-x-auto">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <p className="text-sm font-semibold">Customers <span className="text-muted-foreground font-normal">({filtered.length})</span></p>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => exportCSV("customers.csv", filtered.map(c => ({ ID: c.id, Name: c.name, Mobile: c.mobile, Email: c.email, Gender: c.gender, Status: c.status, Membership: c.membership, TotalOrders: c.totalOrders, TotalSpent: c.totalSpent, RewardPoints: c.rewardPoints, RegistrationDate: c.registrationDate, LastLogin: c.lastLogin, EmailVerified: c.emailVerified, MobileVerified: c.mobileVerified })))}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              {["Customer ID", "Customer Name", "Mobile Number", "Email", "Total Orders", "Total Spent", "Membership Level", "Status", "Registration Date", "Actions"]
                .map((h) => <th key={h} className="p-3 font-medium whitespace-nowrap text-center last:text-center first:text-left [&:nth-child(2)]:text-left">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className="p-10 text-center text-muted-foreground">No customers found</td></tr>
            ) : filtered.map((c) => (
              <tr key={c.id} className="border-t hover:bg-muted/30 transition">
                <td className="p-3 font-mono font-bold text-brand text-xs">{c.id}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="h-9 w-9 rounded-full object-cover" />
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{c.mobile}</td>
                <td className="p-3 text-xs text-muted-foreground">{c.email}</td>
                <td className="p-3 font-medium">{c.totalOrders}</td>
                <td className="p-3 font-bold">{formatINR(c.totalSpent)}</td>
                <td className="p-3"><Badge text={c.membership} cls={MEMBERSHIP_COLORS[c.membership]} /></td>
                <td className="p-3"><Badge text={c.status} cls={STATUS_COLORS[c.status]} /></td>
                <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{fmt(c.registrationDate)}</td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7" 
                      onClick={() => setSelected(c)}
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                      title="Edit Customer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50" 
                      title="Delete Customer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <CustomerModal
          customer={selected}
          customers={filtered}
          onClose={() => setSelected(null)}
          onNavigate={(c) => setSelected(c)}
        />
      )}
    </div>
  );
}
