import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { formatINR } from "@/lib/store";
import {
  ORDERS, STATUS_COLORS, PAYMENT_STATUS_COLORS,
  type Order, type OrderStatus, type PaymentStatus, type DeliveryPartner,
} from "@/lib/orders-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye, X, ShoppingBag, Package, Truck, CheckCircle2,
  XCircle, RotateCcw, RefreshCw, Clock, TrendingUp,
  AlertCircle, Search, Filter, MapPin, Phone, Mail,
  FileText, Printer, UserCheck, ThumbsUp, Ban, Download,
  CalendarDays, BarChart2, ChevronLeft, ChevronRight,
  Pencil, ExternalLink, Check,
} from "lucide-react";

function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, "'")}"` ).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = filename; a.click();
}

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

// ── helpers ────────────────────────────────────────────────────────────────
function fmt(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── StatCard ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: typeof ShoppingBag; color: string;
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
function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-xs text-muted-foreground capitalize">
      <span className="text-foreground font-medium">{label}:</span> {value}
    </span>
  );
}
function SummaryRow({ label, value, cls, bold }: { label: string; value: string; cls?: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-bold border-t pt-1.5" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span className={cls}>{value}</span>
    </div>
  );
}

// ── Timeline ───────────────────────────────────────────────────────────────
const TIMELINE_STEPS: OrderStatus[] = [
  "New", "Confirmed", "Processing", "Packed",
  "Ready for Dispatch", "Shipped", "Out for Delivery", "Delivered",
];

function Timeline({ status }: { status: OrderStatus }) {
  const isCancelled = status === "Cancelled" || status === "Returned" || status === "Refunded";
  const activeIdx = TIMELINE_STEPS.indexOf(status);
  return (
    <div className="overflow-x-auto pb-1">
      {isCancelled ? (
        <div className="flex items-center gap-2 text-destructive text-sm font-medium py-2">
          <XCircle className="h-4 w-4" /> Order {status}
        </div>
      ) : (
        <ol className="flex items-start min-w-max gap-0">
          {TIMELINE_STEPS.map((step, i) => {
            const done = i <= activeIdx;
            return (
              <li key={step} className="flex items-start">
                <div className="flex flex-col items-center">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2
                    ${done ? "bg-brand border-brand text-white" : "bg-muted border-border text-muted-foreground"}`}>
                    {done && i < activeIdx ? "✓" : i + 1}
                  </div>
                  <span className="text-[10px] mt-1 text-center w-[62px] leading-tight text-muted-foreground">{step}</span>
                </div>
                {i < TIMELINE_STEPS.length - 1 && (
                  <div className={`h-0.5 w-8 mt-3 mx-0.5 ${i < activeIdx ? "bg-brand" : "bg-border"}`} />
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

const ALL_STATUSES: OrderStatus[] = [
  "New", "Confirmed", "Processing", "Packed",
  "Ready for Dispatch", "Shipped", "Out for Delivery",
  "Delivered", "Cancelled", "Returned", "Refunded",
];

// ── Order Detail Modal ─────────────────────────────────────────────────────
function OrderModal({
  order, orders, onClose, onNavigate, onUpdateStatus, onUpdateTracking,
}: {
  order: Order;
  orders: Order[];
  onClose: () => void;
  onNavigate: (o: Order) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdateTracking: (id: string, url: string) => void;
}) {
  const idx = orders.findIndex((o) => o.id === order.id);
  const txnId = `TXN${order.id.replace("ORD", "")}${order.customer.id}`;
  const canReturn = order.status === "Delivered";
  const canCancel = !["Delivered", "Cancelled", "Returned", "Refunded", "Shipped", "Out for Delivery"].includes(order.status);
  const hasReturn = !!order.returnInfo;

  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [statusSaved, setStatusSaved] = useState(false);
  const [trackingUrl, setTrackingUrl] = useState(order.delivery.trackingNumber.startsWith("http") ? order.delivery.trackingNumber : "");
  const [trackingSaved, setTrackingSaved] = useState(false);

  function saveStatus() {
    onUpdateStatus(order.id, newStatus);
    setStatusSaved(true);
    setTimeout(() => setStatusSaved(false), 2000);
  }

  function saveTracking() {
    onUpdateTracking(order.id, trackingUrl);
    setTrackingSaved(true);
    setTimeout(() => setTrackingSaved(false), 2000);
  }

  function openTracking() {
    const url = trackingUrl.trim();
    if (!url) return;
    window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-6 px-3">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-card rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            {/* Prev / Next */}
            <div className="flex items-center gap-1">
              <button
                disabled={idx <= 0}
                onClick={() => onNavigate(orders[idx - 1])}
                className="p-1.5 rounded-lg border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Previous order"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-muted-foreground font-medium px-1">{idx + 1}/{orders.length}</span>
              <button
                disabled={idx >= orders.length - 1}
                onClick={() => onNavigate(orders[idx + 1])}
                className="p-1.5 rounded-lg border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Next order"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Order {order.id}</h2>
              <p className="text-xs text-muted-foreground">
                {new Date(order.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                {" · "}<span className="capitalize">{order.source}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge text={order.status} cls={STATUS_COLORS[order.status]} />
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition ml-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">

          {/* ── S1: Order Information ── */}
          <Section title="Section 1 · Order Information">
            <Grid2>
              <Field label="Order ID" value={order.id} highlight />
              <Field label="Date" value={fmt(order.date)} />
              <Field label="Time" value={new Date(order.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} />
              <Field label="Order Status" value={order.status} />
              <Field label="Payment Status" value={order.paymentStatus} />
              <Field label="Payment Method" value={order.paymentMethod} />
              <Field label="Order Source" value={order.source} />
            </Grid2>
          </Section>

          {/* ── S2: Customer Information ── */}
          <Section title="Section 2 · Customer Information">
            <Grid2>
              <Field label="Name" value={order.customer.name} />
              <Field label="Customer ID" value={order.customer.id} />
              <Field label="Mobile" value={order.customer.mobile} />
              <Field label="Email" value={order.customer.email} />
            </Grid2>
          </Section>

          {/* ── Shipping Address ── */}
          <Section title="Shipping Address">
            <Grid2>
              <Field label="Full Name" value={order.address.fullName} />
              <Field label="Mobile" value={order.address.mobile} />
              <Field label="House / Flat" value={order.address.house} />
              <Field label="Street" value={order.address.street} />
              <Field label="Landmark" value={order.address.landmark} />
              <Field label="City" value={order.address.city} />
              <Field label="State" value={order.address.state} />
              <Field label="Pincode" value={order.address.pincode} />
              <Field label="Country" value={order.address.country} />
            </Grid2>
          </Section>

          {/* ── S3: Products ── */}
          <Section title="Section 3 · Products Ordered">
            <div className="space-y-3">
              {order.products.map((p) => (
                <div key={p.productId} className="flex gap-3 border rounded-xl p-3">
                  <img src={p.image} alt={p.name} className="h-16 w-16 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{p.name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      <InfoPill label="SKU" value={p.sku} />
                      <InfoPill label="Category" value={p.category} />
                      <InfoPill label="Color" value={p.color} />
                      <InfoPill label="Qty" value={String(p.qty)} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm">{formatINR(p.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">{formatINR(p.unitPrice)} × {p.qty}</p>
                    <p className="text-xs text-green-600">-{p.discount}% off</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Order Summary ── */}
          <Section title="Order Summary">
            <div className="bg-muted/30 rounded-xl p-4 space-y-1.5 max-w-xs">
              <SummaryRow label="Subtotal" value={formatINR(order.subtotal)} />
              {order.couponDiscount > 0 && (
                <SummaryRow label="Coupon Discount" value={`-${formatINR(order.couponDiscount)}`} cls="text-green-600" />
              )}
              <SummaryRow label="Shipping Charges" value={order.shippingCharges === 0 ? "FREE" : formatINR(order.shippingCharges)} />
              <SummaryRow label="Tax Amount (5%)" value={formatINR(order.tax)} />
              <SummaryRow label="Grand Total" value={formatINR(order.grandTotal)} cls="text-brand" bold />
            </div>
          </Section>

          {/* ── S4: Payment Information ── */}
          <Section title="Section 4 · Payment Information">
            <Grid2>
              <Field label="Payment Method" value={order.paymentMethod} />
              <Field label="Transaction ID" value={txnId} />
              <Field label="Payment Status" value={order.paymentStatus} />
            </Grid2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet", "Cash on Delivery"] as const).map((m) => (
                <span key={m} className={`text-[11px] px-2.5 py-1 rounded-full border font-medium
                  ${order.paymentMethod === m ? "bg-brand text-white border-brand" : "bg-muted text-muted-foreground border-transparent"}`}>
                  {m}
                </span>
              ))}
            </div>
          </Section>

          {/* ── S5: Delivery Information ── */}
          <Section title="Section 5 · Delivery Management">
            <Grid2>
              <Field label="Delivery Partner" value={order.delivery.partner} />
              <Field label="Tracking Number" value={order.delivery.trackingNumber} highlight />
              <Field label="Dispatch Date" value={fmt(order.delivery.dispatchDate)} />
              <Field label="Estimated Delivery" value={fmt(order.delivery.estimatedDelivery)} />
              <Field label="Actual Delivery" value={order.delivery.actualDelivery ? fmt(order.delivery.actualDelivery) : "Pending"} />
            </Grid2>
            <div className="mt-2 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Full Shipping Address</p>
              <p className="text-sm mt-0.5">
                {order.address.house}, {order.address.street}, {order.address.landmark && `${order.address.landmark}, `}
                {order.address.city} – {order.address.pincode}, {order.address.state}, {order.address.country}
              </p>
            </div>
            {/* ── Tracking URL input ── */}
            <div className="mt-3 p-3 border rounded-xl bg-muted/20 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tracking Link</p>
              <p className="text-[11px] text-muted-foreground">Paste the tracking URL from your courier / post office portal</p>
              <div className="flex gap-2">
                <Input
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://tracking.bluedart.com/... or any courier link"
                  className="h-9 text-xs flex-1"
                />
                <Button size="sm" variant="outline" className="gap-1.5 shrink-0" onClick={saveTracking}>
                  {trackingSaved ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Check className="h-3.5 w-3.5" />}
                  {trackingSaved ? "Saved!" : "Save"}
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 shrink-0"
                  disabled={!trackingUrl.trim()}
                  onClick={openTracking}
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Track Order
                </Button>
              </div>
            </div>
          </Section>

          {/* ── S6: Timeline ── */}
          <Section title="Section 6 · Order Timeline">
            <Timeline status={order.status} />
          </Section>

          {/* ── Return & Refund ── */}
          {hasReturn && order.returnInfo && (
            <Section title="Return & Refund Management">
              <Grid2>
                <Field label="Return Request ID" value={order.returnInfo.requestId} highlight />
                <Field label="Return Reason" value={order.returnInfo.reason} />
                <Field label="Return Status" value={order.returnInfo.status} />
                <Field label="Refund Amount" value={formatINR(order.returnInfo.refundAmount)} />
                <Field label="Refund Status" value={order.returnInfo.refundStatus} />
                <Field label="Refund Date" value={order.returnInfo.refundDate ? fmt(order.returnInfo.refundDate) : "Pending"} />
              </Grid2>
            </Section>
          )}

          {/* ── Customer Actions ── */}
          <Section title="Customer Actions">
            <div className="flex flex-wrap gap-2">
              {canCancel && (
                <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                  <Ban className="h-3.5 w-3.5" /> Cancel Order
                </Button>
              )}
              {canReturn && (
                <Button size="sm" variant="outline" className="gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50">
                  <RotateCcw className="h-3.5 w-3.5" /> Return Order
                </Button>
              )}
              <Button size="sm" variant="outline" className="gap-1.5">
                <Download className="h-3.5 w-3.5" /> Download Invoice
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" /> Reorder
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Track Order
              </Button>
            </div>
          </Section>

        </div>

        {/* ── Admin Actions Footer ── */}
        <div className="p-5 border-t bg-muted/20 rounded-b-2xl space-y-4">

          {/* Update Status */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Update Order Status</p>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Button size="sm" className="gap-1.5" onClick={saveStatus}>
                {statusSaved
                  ? <><Check className="h-3.5 w-3.5" /> Saved!</>
                  : <><RefreshCw className="h-3.5 w-3.5" /> Update Status</>}
              </Button>
            </div>
          </div>

          {/* Other admin actions */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Admin Actions</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Assign Delivery Partner
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Generate Invoice
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Printer className="h-3.5 w-3.5" /> Print Invoice
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Contact Customer
              </Button>
              {hasReturn && (
                <>
                  <Button size="sm" variant="outline" className="gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50">
                    <UserCheck className="h-3.5 w-3.5" /> Approve Return
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 text-green-600 border-green-300 hover:bg-green-50">
                    <ThumbsUp className="h-3.5 w-3.5" /> Approve Refund
                  </Button>
                </>
              )}
              <Button size="sm" variant="ghost" className="gap-1.5 ml-auto text-destructive" onClick={onClose}>
                <X className="h-3.5 w-3.5" /> Close
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// ── QuickStatusButton ─────────────────────────────────────────────────────
function QuickStatusButton({ status, onChange }: { status: OrderStatus; onChange: (s: OrderStatus) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button size="icon" variant="ghost" className="h-7 w-7" title="Update Status" onClick={() => setOpen((v) => !v)}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      {open && (
        <div className="absolute right-0 top-8 z-20 bg-card border rounded-xl shadow-lg p-1 min-w-[170px]">
          {ALL_STATUSES.map((s) => (
            <button key={s} onClick={() => { onChange(s); setOpen(false); }}
              className={`w-full text-left text-xs px-3 py-1.5 rounded-lg hover:bg-muted transition flex items-center justify-between
                ${status === s ? "font-bold text-brand" : ""}`}>
              {s}{status === s && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reports ───────────────────────────────────────────────────────────────
const REPORT_TYPES = [
  { label: "Daily Orders Report",    icon: CalendarDays,  color: "text-blue-600 bg-blue-50" },
  { label: "Weekly Orders Report",   icon: CalendarDays,  color: "text-purple-600 bg-purple-50" },
  { label: "Monthly Orders Report",  icon: BarChart2,     color: "text-indigo-600 bg-indigo-50" },
  { label: "Revenue Report",         icon: TrendingUp,    color: "text-emerald-600 bg-emerald-50" },
  { label: "Cancelled Orders Report",icon: XCircle,       color: "text-red-600 bg-red-50" },
  { label: "Return Orders Report",   icon: RotateCcw,     color: "text-orange-600 bg-orange-50" },
];

function Reports() {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 6);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = [
    ORDERS.filter(o => new Date(o.date).toDateString() === now.toDateString()).length,
    ORDERS.filter(o => new Date(o.date) >= weekStart).length,
    ORDERS.filter(o => new Date(o.date) >= monthStart).length,
    formatINR(ORDERS.filter(o => new Date(o.date) >= monthStart).reduce((s, o) => s + o.grandTotal, 0)),
    ORDERS.filter(o => o.status === "Cancelled").length,
    ORDERS.filter(o => o.status === "Returned" || o.status === "Refunded").length,
  ];

  return (
    <div className="bg-card border rounded-xl p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Order Reports</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {REPORT_TYPES.map(({ label, icon: Icon, color }, i) => (
          <button key={label}
            className="flex flex-col gap-2 p-3 rounded-xl border hover:shadow-sm transition text-left group">
            <div className={`p-2 rounded-lg w-fit ${color}`}><Icon className="h-4 w-4" /></div>
            <p className="text-xs font-medium leading-tight">{label}</p>
            <p className="text-lg font-bold">{stats[i]}</p>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-auto">
              <Download className="h-3 w-3" /> Download
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [payFilter, setPayFilter] = useState<string>("All");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>({});
  const [orderTrackingUrls, setOrderTrackingUrls] = useState<Record<string, string>>({});

  function handleUpdateStatus(id: string, status: OrderStatus) {
    setOrderStatuses((prev) => ({ ...prev, [id]: status }));
  }
  function handleUpdateTracking(id: string, url: string) {
    setOrderTrackingUrls((prev) => ({ ...prev, [id]: url }));
  }
  function getOrder(o: Order): Order {
    return {
      ...o,
      status: orderStatuses[o.id] ?? o.status,
      delivery: { ...o.delivery, trackingNumber: orderTrackingUrls[o.id] ?? o.delivery.trackingNumber },
    };
  }

  // ── Dashboard ─────────────────────────────────────────────────
  const today = new Date().toDateString();
  const todayOrders = ORDERS.filter((o) => new Date(o.date).toDateString() === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + o.grandTotal, 0);
  const cnt = (s: OrderStatus) => ORDERS.filter((o) => o.status === s).length;

  const dashStats = [
    { label: "Total Orders",       value: ORDERS.length,           icon: ShoppingBag,  color: "bg-brand/10 text-brand" },
    { label: "New Orders",         value: cnt("New"),              icon: Clock,         color: "bg-blue-100 text-blue-600" },
    { label: "Processing",         value: cnt("Processing"),       icon: RefreshCw,     color: "bg-yellow-100 text-yellow-600" },
    { label: "Packed",             value: cnt("Packed"),           icon: Package,       color: "bg-orange-100 text-orange-600" },
    { label: "Shipped",            value: cnt("Shipped"),          icon: Truck,         color: "bg-sky-100 text-sky-600" },
    { label: "Delivered",          value: cnt("Delivered"),        icon: CheckCircle2,  color: "bg-green-100 text-green-600" },
    { label: "Cancelled",          value: cnt("Cancelled"),        icon: XCircle,       color: "bg-red-100 text-red-600" },
    { label: "Returned",           value: cnt("Returned"),         icon: RotateCcw,     color: "bg-pink-100 text-pink-600" },
    { label: "Refunded",           value: cnt("Refunded"),         icon: RefreshCw,     color: "bg-gray-100 text-gray-600" },
    { label: "Today's Orders",     value: todayOrders.length,      icon: TrendingUp,    color: "bg-purple-100 text-purple-600" },
    { label: "Today's Revenue",    value: formatINR(todayRevenue), icon: TrendingUp,    color: "bg-emerald-100 text-emerald-600" },
    { label: "Pending Deliveries", value: ORDERS.filter((o) => o.status === "Shipped" || o.status === "Out for Delivery").length,
      icon: AlertCircle, color: "bg-amber-100 text-amber-600" },
  ];

  // ── Filter options ────────────────────────────────────────────
  const STATUS_TABS = ["All", "New", "Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned", "Refunded"];
  const PAY_OPTIONS: (PaymentStatus | "All")[] = ["All", "Paid", "Pending", "Failed", "Refunded"];
  const DELIVERY_OPTIONS: (DeliveryPartner | "All")[] = ["All", "Bluedart", "Delhivery", "DTDC", "Ekart", "Xpressbees", "India Post"];

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.mobile.includes(q);
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      const matchPay = payFilter === "All" || o.paymentStatus === payFilter;
      const matchDelivery = deliveryFilter === "All" || o.delivery.partner === deliveryFilter;
      const oDate = new Date(o.date);
      const matchFrom = !dateFrom || oDate >= new Date(dateFrom);
      const matchTo = !dateTo || oDate <= new Date(dateTo + "T23:59:59");
      return matchSearch && matchStatus && matchPay && matchDelivery && matchFrom && matchTo;
    });
  }, [search, statusFilter, payFilter, deliveryFilter, dateFrom, dateTo]);

  const hasActiveFilters = statusFilter !== "All" || payFilter !== "All" || deliveryFilter !== "All" || dateFrom || dateTo;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Orders Management</h1>

      {/* Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {dashStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </div>

      {/* Reports */}
      <Reports />

      {/* Filter bar */}
      <div className="bg-card border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search by Order ID / Name / Mobile" value={search}
              onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowFilters((v) => !v)}>
            <Filter className="h-3.5 w-3.5" /> Filters {showFilters ? "▲" : "▼"}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="text-destructive"
              onClick={() => { setStatusFilter("All"); setPayFilter("All"); setDeliveryFilter("All"); setDateFrom(""); setDateTo(""); }}>
              Clear All
            </Button>
          )}
          <span className="ml-auto text-xs text-muted-foreground font-medium">{filtered.length} orders</span>
        </div>

        {showFilters && (
          <div className="space-y-3 pt-3 border-t">
            {/* Order Status */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Filter by Order Status</p>
              <div className="flex flex-wrap gap-1">
                {STATUS_TABS.map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition
                      ${statusFilter === s ? "bg-brand text-white border-brand" : "bg-muted hover:bg-accent border-transparent"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* Payment Status */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Filter by Payment Status</p>
              <div className="flex flex-wrap gap-1">
                {PAY_OPTIONS.map((s) => (
                  <button key={s} onClick={() => setPayFilter(s)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition
                      ${payFilter === s ? "bg-brand text-white border-brand" : "bg-muted hover:bg-accent border-transparent"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* Delivery Partner */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Filter by Delivery Partner</p>
              <div className="flex flex-wrap gap-1">
                {DELIVERY_OPTIONS.map((s) => (
                  <button key={s} onClick={() => setDeliveryFilter(s)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition
                      ${deliveryFilter === s ? "bg-brand text-white border-brand" : "bg-muted hover:bg-accent border-transparent"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* Date Range */}
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Filter by Date</p>
              <div className="flex items-center gap-2">
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 text-xs w-36" />
                <span className="text-xs text-muted-foreground">to</span>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 text-xs w-36" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-card border rounded-xl overflow-x-auto">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <p className="text-sm font-semibold">Orders <span className="text-muted-foreground font-normal">({filtered.length})</span></p>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => exportCSV("orders.csv", filtered.map(o => ({ OrderID: o.id, Customer: o.customer.name, Mobile: o.customer.mobile, Email: o.customer.email, Total: o.grandTotal, PaymentMethod: o.paymentMethod, PaymentStatus: o.paymentStatus, Status: orderStatuses[o.id] ?? o.status, Date: o.date, DeliveryPartner: o.delivery.partner, Tracking: o.delivery.trackingNumber, DispatchDate: o.delivery.dispatchDate, EstDelivery: o.delivery.estimatedDelivery })))}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
        <table className="w-full text-sm min-w-[1000px]">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              {["Order ID", "Customer Name", "Mobile Number", "Total Amount", "Payment Method", "Payment Status", "Order Status", "Order Date", "Delivery Status", "Actions"]
                .map((h) => <th key={h} className="p-3 font-medium whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} className="p-10 text-center text-muted-foreground">No orders found</td></tr>
            ) : filtered.map((o) => (
              <tr key={o.id} className="border-t hover:bg-muted/30 transition">
                <td className="p-3 font-mono font-bold text-brand text-xs">{o.id}</td>
                <td className="p-3 font-medium text-sm">{o.customer.name}</td>
                <td className="p-3 text-xs text-muted-foreground">{o.customer.mobile}</td>
                <td className="p-3 font-bold">{formatINR(o.grandTotal)}</td>
                <td className="p-3 text-xs">{o.paymentMethod}</td>
                <td className="p-3"><Badge text={o.paymentStatus} cls={PAYMENT_STATUS_COLORS[o.paymentStatus]} /></td>
                <td className="p-3"><Badge text={orderStatuses[o.id] ?? o.status} cls={STATUS_COLORS[orderStatuses[o.id] ?? o.status]} /></td>
                <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(o.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  <br />
                  {new Date(o.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="p-3">
                  <div className="text-xs">
                    <p className="font-medium">{o.delivery.partner}</p>
                    <p className="text-muted-foreground font-mono">{o.delivery.trackingNumber}</p>
                    {o.delivery.actualDelivery
                      ? <span className="text-green-600">Delivered</span>
                      : o.delivery.dispatchDate
                        ? <span className="text-sky-600">In Transit</span>
                        : <span className="text-yellow-600">Pending</span>}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="View Order"
                      onClick={() => setSelected(getOrder(o))}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <QuickStatusButton
                      status={orderStatuses[o.id] ?? o.status}
                      onChange={(s) => handleUpdateStatus(o.id, s)}
                    />
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Track Order"
                      onClick={() => {
                        const url = orderTrackingUrls[o.id] ?? "";
                        if (url) window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
                        else setSelected(getOrder(o));
                      }}>
                      <MapPin className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Contact Customer">
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <OrderModal
          order={selected}
          orders={filtered.map(getOrder)}
          onClose={() => setSelected(null)}
          onNavigate={(o) => setSelected(o)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateTracking={handleUpdateTracking}
        />
      )}
    </div>
  );
}
