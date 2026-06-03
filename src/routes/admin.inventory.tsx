import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SAREES, type Saree } from "@/lib/data";
import { formatINR } from "@/lib/store";
import {
  Package, AlertTriangle, AlertCircle, CheckCircle2, XCircle, TrendingUp,
  Warehouse, DollarSign, Search, Filter, Download, Upload, Plus, Minus,
  RefreshCw, History, Eye, Edit2, ChevronDown, ChevronUp, X, BarChart2, Layers
} from "lucide-react";

function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, "'")}"` ).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = filename; a.click();
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/inventory")({ component: Inventory });

// ─── mock extra inventory fields per product ──────────────────────────────────
type InvExtra = {
  reserved: number; damaged: number; returned: number; sold: number;
  purchasePrice: number; supplier: string; lastRestocked: string;
  warehouse: string; location: string; rack: string; shelf: string;
  lowAlertQty: number;
};
function getExtra(id: string): InvExtra {
  const h = id.split("-")[1] ? Number(id.split("-")[1]) : 1;
  return {
    reserved: h % 4, damaged: h % 3, returned: h % 2,
    sold: 10 + (h * 7) % 200, purchasePrice: 800 + (h * 13) % 5000,
    supplier: ["Varanasi Weavers", "Chennai Silks", "Surat Textiles", "Kolkata Handlooms"][h % 4],
    lastRestocked: `2025-0${(h % 9) + 1}-${String((h % 28) + 1).padStart(2, "0")}`,
    warehouse: ["Main Warehouse", "Annex B", "Dispatch Hub"][h % 3],
    location: `Zone-${String.fromCharCode(65 + (h % 4))}`,
    rack: `R${(h % 10) + 1}`, shelf: `S${(h % 5) + 1}`,
    lowAlertQty: 5,
  };
}

// ─── movement history (mock) ───────────────────────────────────────────────────
type Movement = { date: string; action: string; prev: number; updated: number; by: string; remark: string };
function getMoves(s: Saree): Movement[] {
  const n = Number(s.id.split("-")[1]) || 1;
  return [
    { date: "2025-06-10", action: "Add Stock", prev: s.stock - 10, updated: s.stock, by: "Admin", remark: "Restock from supplier" },
    { date: "2025-05-22", action: "Sold", prev: s.stock + 5, updated: s.stock - 10 + s.stock, by: "System", remark: `${n % 3 + 1} units sold` },
    { date: "2025-05-01", action: "Return", prev: s.stock - 12, updated: s.stock - 10, by: "Admin", remark: "Customer return" },
  ];
}

// ─── stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, bg }: { icon: typeof Package; label: string; value: string | number; sub?: string; color: string; bg: string }) {
  return (
    <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-xs font-medium text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── stock operation modal ────────────────────────────────────────────────────
type OpType = "add" | "remove" | "update" | "adjust";
function StockOpModal({ product, op, open, onClose }: { product: Saree | null; op: OpType; open: boolean; onClose: () => void }) {
  if (!product) return null;
  const extra = getExtra(product.id);
  const labels: Record<OpType, string> = { add: "Add Stock", remove: "Remove Stock", update: "Update Stock", adjust: "Adjust Stock" };
  const icons: Record<OpType, typeof Plus> = { add: Plus, remove: Minus, update: RefreshCw, adjust: RefreshCw };
  const Icon = icons[op];
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Icon className="h-4 w-4" />{labels[op]}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg mb-1">
          <img src={product.images[0]} alt="" className="w-12 h-14 rounded object-cover border" />
          <div>
            <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.id} · {product.fabric}</p>
            <p className="text-xs text-muted-foreground">Current stock: <span className="font-semibold text-foreground">{product.stock}</span></p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Quantity *</Label><Input type="number" placeholder="0" className="h-8 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Purchase Price (₹)</Label><Input type="number" placeholder={String(extra.purchasePrice)} className="h-8 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Supplier</Label><Input placeholder={extra.supplier} className="h-8 text-sm" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Date</Label><Input type="date" className="h-8 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Warehouse</Label>
              <Select defaultValue={extra.warehouse}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{["Main Warehouse","Annex B","Dispatch Hub"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Location / Rack</Label><Input placeholder={`${extra.location} / ${extra.rack}`} className="h-8 text-sm" /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Remarks</Label><Textarea className="text-sm min-h-[56px]" placeholder="Optional notes..." /></div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-brand hover:bg-brand/90 text-brand-foreground" onClick={onClose}>
            <Icon className="h-3.5 w-3.5 mr-1" />{labels[op]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── stock history modal ───────────────────────────────────────────────────────
function HistoryModal({ product, open, onClose }: { product: Saree | null; open: boolean; onClose: () => void }) {
  if (!product) return null;
  const moves = getMoves(product);
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><History className="h-4 w-4" />Stock History — {product.name}</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50"><tr>{["Date","Action","Prev Qty","New Qty","By","Remark"].map(h => <th key={h} className="p-2 text-left font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {moves.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 whitespace-nowrap">{m.date}</td>
                  <td className="p-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${m.action === "Add Stock" ? "bg-success/10 text-success" : m.action === "Sold" ? "bg-brand/10 text-brand" : "bg-warning/10 text-warning"}`}>{m.action}</span></td>
                  <td className="p-2">{m.prev}</td>
                  <td className="p-2 font-semibold">{m.updated}</td>
                  <td className="p-2">{m.by}</td>
                  <td className="p-2 text-muted-foreground">{m.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-1" onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── edit inventory modal ──────────────────────────────────────────────────────
function EditInvModal({ product, open, onClose }: { product: Saree | null; open: boolean; onClose: () => void }) {
  if (!product) return null;
  const extra = getExtra(product.id);
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[88vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Edit2 className="h-4 w-4" />Edit Inventory — {product.name}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {/* stock fields */}
          <div className="space-y-1.5"><Label className="text-xs">Current Stock</Label><Input type="number" defaultValue={product.stock} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Available Stock</Label><Input type="number" defaultValue={product.stock - extra.reserved} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Reserved Stock</Label><Input type="number" defaultValue={extra.reserved} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Damaged Stock</Label><Input type="number" defaultValue={extra.damaged} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Returned Stock</Label><Input type="number" defaultValue={extra.returned} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Low Stock Alert Qty</Label><Input type="number" defaultValue={extra.lowAlertQty} className="h-8 text-sm" /></div>
          {/* stock status */}
          <div className="space-y-1.5 col-span-2"><Label className="text-xs">Stock Status</Label>
            <Select defaultValue={product.stock === 0 ? "out" : product.stock <= 5 ? "limited" : "in"}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="limited">Limited Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
                <SelectItem value="disc">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* purchase info */}
          <div className="col-span-2 pt-1 border-t"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Purchase Info</p></div>
          <div className="space-y-1.5"><Label className="text-xs">Purchase Price (₹)</Label><Input type="number" defaultValue={extra.purchasePrice} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Supplier Name</Label><Input defaultValue={extra.supplier} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Last Restocked</Label><Input type="date" defaultValue={extra.lastRestocked} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Supplier Contact</Label><Input placeholder="+91 98765 43210" className="h-8 text-sm" /></div>
          {/* warehouse */}
          <div className="col-span-2 pt-1 border-t"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Warehouse</p></div>
          <div className="space-y-1.5"><Label className="text-xs">Warehouse</Label>
            <Select defaultValue={extra.warehouse}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{["Main Warehouse","Annex B","Dispatch Hub"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Storage Location</Label><Input defaultValue={extra.location} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Rack No.</Label><Input defaultValue={extra.rack} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Shelf No.</Label><Input defaultValue={extra.shelf} className="h-8 text-sm" /></div>
          {/* saree specifics */}
          <div className="col-span-2 pt-1 border-t"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Saree Specifics</p></div>
          <div className="space-y-1.5"><Label className="text-xs">Fabric</Label><Input defaultValue={product.fabric} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Color</Label><Input defaultValue={product.color} className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Saree Length</Label><Input placeholder="6.3 metres" className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Work Type</Label><Input placeholder="Zari" className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Occasion</Label><Input placeholder="Wedding" className="h-8 text-sm" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Collection</Label><Input placeholder="Summer 2025" className="h-8 text-sm" /></div>
          {/* alerts */}
          <div className="col-span-2 pt-1 border-t"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Alerts & Notifications</p></div>
          {[["Out of Stock Alert", true], ["Admin Email Alerts", true], ["Push Notifications", false]].map(([l, d]) => (
            <div key={l as string} className="flex items-center justify-between border rounded-lg p-2.5">
              <Label className="text-xs">{l as string}</Label><Switch defaultChecked={d as boolean} />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t mt-1">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-brand hover:bg-brand/90 text-brand-foreground" onClick={onClose}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── main ──────────────────────────────────────────────────────────────────────
function Inventory() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fabricFilter, setFabricFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [opProduct, setOpProduct] = useState<Saree | null>(null);
  const [opType, setOpType] = useState<OpType>("add");
  const [histProduct, setHistProduct] = useState<Saree | null>(null);
  const [editProduct, setEditProduct] = useState<Saree | null>(null);

  // unique filter options
  const cats = useMemo(() => [...new Set(SAREES.map(s => s.category))], []);
  const fabrics = useMemo(() => [...new Set(SAREES.map(s => s.fabric))], []);
  const colors = useMemo(() => [...new Set(SAREES.map(s => s.color))], []);

  const filtered = useMemo(() => SAREES.filter(s => {
    const extra = getExtra(s.id);
    const status = s.stock === 0 ? "out" : s.stock <= 5 ? "limited" : "in";
    return (
      (search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)) &&
      (catFilter === "all" || s.category === catFilter) &&
      (statusFilter === "all" || status === statusFilter) &&
      (fabricFilter === "all" || s.fabric === fabricFilter) &&
      (colorFilter === "all" || s.color === colorFilter)
    );
  }), [search, catFilter, statusFilter, fabricFilter, colorFilter]);

  // stats
  const totalStock = SAREES.reduce((a, s) => a + s.stock, 0);
  const totalReserved = SAREES.reduce((a, s) => a + getExtra(s.id).reserved, 0);
  const totalSold = SAREES.reduce((a, s) => a + getExtra(s.id).sold, 0);
  const invValue = SAREES.reduce((a, s) => a + s.price * s.stock, 0);
  const outCount = SAREES.filter(s => s.stock === 0).length;
  const lowCount = SAREES.filter(s => s.stock > 0 && s.stock <= 5).length;
  const inCount = SAREES.filter(s => s.stock > 5).length;

  const openOp = (s: Saree, t: OpType) => { setOpProduct(s); setOpType(t); };

  function StockStatus({ stock }: { stock: number }) {
    if (stock === 0) return <span className="text-[11px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">Out of Stock</span>;
    if (stock <= 5) return <span className="text-[11px] px-2 py-0.5 rounded-full bg-warning/15 text-warning font-semibold">Low Stock</span>;
    if (stock <= 15) return <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">Limited</span>;
    return <span className="text-[11px] px-2 py-0.5 rounded-full bg-success/10 text-success font-semibold">In Stock</span>;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">{SAREES.length} products · {filtered.length} shown</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-1.5"><Upload className="h-3.5 w-3.5" />Import</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" />Export</Button>
          <Button size="sm" className="bg-brand hover:bg-brand/90 text-brand-foreground gap-1.5"><Plus className="h-3.5 w-3.5" />Bulk Add Stock</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Package} label="Total Products" value={SAREES.length} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={Layers} label="Total Stock Units" value={totalStock.toLocaleString()} color="text-sky" bg="bg-sky/10" />
        <StatCard icon={CheckCircle2} label="In Stock" value={inCount} color="text-success" bg="bg-success/10" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowCount} sub="Alert: ≤ 5 units" color="text-warning" bg="bg-warning/10" />
        <StatCard icon={XCircle} label="Out of Stock" value={outCount} color="text-destructive" bg="bg-destructive/10" />
        <StatCard icon={TrendingUp} label="Reserved Stock" value={totalReserved} color="text-brand" bg="bg-brand/10" />
        <StatCard icon={BarChart2} label="Units Sold (Total)" value={totalSold.toLocaleString()} color="text-navy" bg="bg-navy/10" />
        <StatCard icon={DollarSign} label="Inventory Value" value={"₹" + (invValue / 100000).toFixed(1) + "L"} sub={formatINR(invValue)} color="text-gold" bg="bg-gold/10" />
      </div>

      {/* Today's summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Today's Stock Updates", value: "12 products", icon: RefreshCw, color: "text-sky" },
          { label: "Incoming Stock", value: "3 POs pending", icon: TrendingUp, color: "text-success" },
          { label: "Warehouse Capacity", value: "Main · 68% used", icon: Warehouse, color: "text-navy" },
        ].map(c => (
          <div key={c.label} className="bg-card border rounded-xl p-3 flex items-center gap-3">
            <c.icon className={`h-5 w-5 shrink-0 ${c.color}`} />
            <div><p className="font-semibold text-sm">{c.value}</p><p className="text-xs text-muted-foreground">{c.label}</p></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input className="pl-8 h-8 text-sm" placeholder="Search name or SKU..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {/* quick filters */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Stock Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in">In Stock</SelectItem>
              <SelectItem value="limited">Low / Limited</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="h-8 text-xs w-36 capitalize"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {cats.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-3.5 w-3.5" />More Filters {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          {(search || catFilter !== "all" || statusFilter !== "all" || fabricFilter !== "all" || colorFilter !== "all") && (
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground gap-1" onClick={() => { setSearch(""); setCatFilter("all"); setStatusFilter("all"); setFabricFilter("all"); setColorFilter("all"); }}>
              <X className="h-3 w-3" />Clear
            </Button>
          )}
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-3 pt-2 border-t">
            <Select value={fabricFilter} onValueChange={setFabricFilter}>
              <SelectTrigger className="h-8 text-xs w-44"><SelectValue placeholder="Fabric Type" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Fabrics</SelectItem>{fabrics.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={colorFilter} onValueChange={setColorFilter}>
              <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Color" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Colors</SelectItem>{colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-x-auto">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <p className="text-sm font-semibold">Product Inventory Details <span className="text-muted-foreground font-normal">({filtered.length})</span></p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => exportCSV("inventory.csv", filtered.slice(0,30).map(s => { const ex = getExtra(s.id); return { ID: s.id, Name: s.name, Category: s.category, Fabric: s.fabric, Color: s.color, Stock: s.stock, Available: Math.max(0, s.stock - ex.reserved), Reserved: ex.reserved, Sold: ex.sold, Damaged: ex.damaged, Returned: ex.returned, PurchasePrice: ex.purchasePrice, Supplier: ex.supplier, LastRestocked: ex.lastRestocked, Warehouse: ex.warehouse, Location: ex.location, Rack: ex.rack }; }))}><Download className="h-3 w-3" />CSV</Button>
            <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><Download className="h-3 w-3" />PDF</Button>
          </div>
        </div>
        <table className="w-full text-sm min-w-[1100px]">
          <thead className="bg-muted/50">
            <tr>
              {["Product / SKU","Category","Fabric · Color","Stock","Avail / Reserved","Sold / Damaged","Purchase Info","Last Restocked","Warehouse","Status","Actions"].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 30).map(s => {
              const ex = getExtra(s.id);
              return (
                <tr key={s.id} className="border-t hover:bg-muted/20 transition-colors">
                  {/* product */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <img src={s.images[0]} alt="" className="w-9 h-11 rounded object-cover border shrink-0" />
                      <div>
                        <p className="font-medium text-xs line-clamp-1 max-w-[140px]">{s.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{s.id}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{s.category}</p>
                      </div>
                    </div>
                  </td>
                  {/* category */}
                  <td className="px-3 py-2.5">
                    <span className="text-xs capitalize bg-accent px-2 py-0.5 rounded-md">{s.category}</span>
                  </td>
                  {/* fabric · color */}
                  <td className="px-3 py-2.5">
                    <p className="text-xs">{s.fabric}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-3 h-3 rounded-full border" style={{ background: s.color.toLowerCase() === "gold" ? "#d4a017" : s.color.toLowerCase() === "maroon" ? "#800000" : s.color.toLowerCase() === "royal blue" ? "#4169e1" : s.color.toLowerCase() === "ivory" ? "#f5f5dc" : s.color.toLowerCase() === "coral" ? "#ff7f50" : s.color.toLowerCase() === "emerald" ? "#50c878" : s.color.toLowerCase() }} />
                      <span className="text-[11px] text-muted-foreground">{s.color}</span>
                    </div>
                  </td>
                  {/* stock qty */}
                  <td className="px-3 py-2.5">
                    <p className="font-bold text-sm">{s.stock}</p>
                    <p className="text-[10px] text-muted-foreground">Alert: ≤{ex.lowAlertQty}</p>
                  </td>
                  {/* avail / reserved */}
                  <td className="px-3 py-2.5">
                    <p className="text-xs"><span className="text-success font-semibold">{Math.max(0, s.stock - ex.reserved)}</span> avail</p>
                    <p className="text-xs"><span className="text-warning font-semibold">{ex.reserved}</span> reserved</p>
                  </td>
                  {/* sold / damaged */}
                  <td className="px-3 py-2.5">
                    <p className="text-xs"><span className="font-semibold">{ex.sold}</span> sold</p>
                    <p className="text-xs text-muted-foreground">{ex.damaged} dmg · {ex.returned} ret</p>
                  </td>
                  {/* purchase info */}
                  <td className="px-3 py-2.5">
                    <p className="text-xs font-medium">{formatINR(ex.purchasePrice)}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[110px]">{ex.supplier}</p>
                  </td>
                  {/* last restocked */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-muted-foreground">{ex.lastRestocked}</td>
                  {/* warehouse */}
                  <td className="px-3 py-2.5">
                    <p className="text-xs">{ex.warehouse}</p>
                    <p className="text-[11px] text-muted-foreground">{ex.location} · {ex.rack}/{ex.shelf}</p>
                  </td>
                  {/* status */}
                  <td className="px-3 py-2.5"><StockStatus stock={s.stock} /></td>
                  {/* actions */}
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-6 px-1.5 text-[11px] gap-0.5 text-success border-success/30 hover:bg-success/5" onClick={() => openOp(s, "add")}><Plus className="h-2.5 w-2.5" />Add</Button>
                        <Button size="sm" variant="outline" className="h-6 px-1.5 text-[11px] gap-0.5 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => openOp(s, "remove")}><Minus className="h-2.5 w-2.5" />Remove</Button>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-6 px-1.5 text-[11px] gap-0.5" onClick={() => openOp(s, "update")}><RefreshCw className="h-2.5 w-2.5" />Update</Button>
                        <Button size="sm" variant="outline" className="h-6 px-1.5 text-[11px] gap-0.5" onClick={() => setHistProduct(s)}><History className="h-2.5 w-2.5" />History</Button>
                      </div>
                      <Button size="sm" variant="outline" className="h-6 px-1.5 text-[11px] gap-0.5 w-full" onClick={() => setEditProduct(s)}><Edit2 className="h-2.5 w-2.5" />Edit Inventory</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-sm">No products match the current filters.</div>
        )}
      </div>

      {/* Modals */}
      <StockOpModal product={opProduct} op={opType} open={!!opProduct} onClose={() => setOpProduct(null)} />
      <HistoryModal product={histProduct} open={!!histProduct} onClose={() => setHistProduct(null)} />
      <EditInvModal product={editProduct} open={!!editProduct} onClose={() => setEditProduct(null)} />
    </div>
  );
}
