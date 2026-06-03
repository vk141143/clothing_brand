import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Edit2, Trash2, ChevronRight, ChevronLeft, Check, Star, Sparkles, Crown, AlertTriangle, Download } from "lucide-react";

function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, "'")}"` ).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = filename; a.click();
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SAREES, type Saree } from "@/lib/data";
import { formatINR } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

// ─── Types ────────────────────────────────────────────────────────────────────
type WizardData = Partial<Saree>;

// ─── Wizard constants ─────────────────────────────────────────────────────────
const STEPS = [
  { title: "Basic Info & Pricing", desc: "Name, category, price & stock" },
  { title: "Product Details", desc: "Fabric, colors & descriptions" },
  { title: "Media & Shipping", desc: "Images, weight & delivery" },
  { title: "Visibility & SEO", desc: "Tags, status & search settings" },
];

// ─── Small helpers ─────────────────────────────────────────────────────────────
const Field = ({ label, required, children, span }: { label: string; required?: boolean; children: React.ReactNode; span?: boolean }) => (
  <div className={`space-y-1.5 ${span ? "col-span-2" : ""}`}>
    <Label className="text-xs font-medium">{label}{required && <span className="text-brand ml-0.5">*</span>}</Label>
    {children}
  </div>
);

const SI = ({ value, onChange, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <Input className="h-8 text-sm" value={value ?? ""} onChange={onChange} {...props} />
);

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">Out of Stock</span>;
  if (stock <= 5) return <span className="text-xs px-2 py-0.5 rounded-full bg-warning/15 text-warning font-medium">Low ({stock})</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">In Stock</span>;
}

// ─── Wizard steps content (shared for Add & Edit) ──────────────────────────────
function WizardStep({ step, visible, data, set }: { step: number; visible: boolean; data: WizardData; set: (k: keyof WizardData, v: unknown) => void }) {
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.3s ease, transform 0.3s ease", display: visible ? "block" : "none" }}>
      {step === 0 && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Product Name" required span><SI placeholder="e.g. Kanjivaram Silk Saree" value={data.name} onChange={e => set("name", e.target.value)} /></Field>
          <Field label="SKU"><SI placeholder="SKU-001" value={data.id} onChange={e => set("id", e.target.value)} /></Field>
          <Field label="Category" required>
            <Select value={data.category} onValueChange={v => set("category", v)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["silk","banarasi","kanjivaram","cotton","linen","designer","bridal","party","handloom","georgette","chiffon"].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Sub Category">
            <Select><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Kanjivaram","Banarasi","Chanderi","Patola"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Selling Price (₹)" required><SI type="number" placeholder="2999" value={data.price} onChange={e => set("price", Number(e.target.value))} /></Field>
          <Field label="MRP (₹)" required><SI type="number" placeholder="3999" value={data.originalPrice} onChange={e => set("originalPrice", Number(e.target.value))} /></Field>
          <Field label="Discount %"><SI type="number" placeholder="25" value={data.discount} onChange={e => set("discount", Number(e.target.value))} /></Field>
          <Field label="Tax %"><SI type="number" placeholder="5" /></Field>
          <Field label="Total Stock" required><SI type="number" placeholder="100" value={data.stock} onChange={e => set("stock", Number(e.target.value))} /></Field>
          <Field label="Stock Status">
            <Select value={data.stock === 0 ? "out" : data.stock! <= 5 ? "limited" : "in"} onValueChange={v => set("stock", v === "out" ? 0 : v === "limited" ? 3 : 20)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent><SelectItem value="in">In Stock</SelectItem><SelectItem value="limited">Limited Stock</SelectItem><SelectItem value="out">Out of Stock</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Low Stock Alert Qty"><SI type="number" placeholder="5" /></Field>
          <Field label="Collection"><SI placeholder="Summer 2025" /></Field>
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Short Description" required span><Textarea className="text-sm min-h-[56px]" placeholder="Brief product summary..." value={data.description?.slice(0, 120) ?? ""} onChange={e => set("description", e.target.value)} /></Field>
          <Field label="Full Description" required span><Textarea className="text-sm min-h-[72px]" placeholder="Detailed description..." value={data.description ?? ""} onChange={e => set("description", e.target.value)} /></Field>
          <Field label="Fabric Type" required><SI placeholder="Pure Silk" value={data.fabric} onChange={e => set("fabric", e.target.value)} /></Field>
          <Field label="Saree Length"><SI placeholder="6.3 metres" /></Field>
          <Field label="Primary Color" required><SI placeholder="Red" value={data.color} onChange={e => set("color", e.target.value)} /></Field>
          <Field label="Secondary Color"><SI placeholder="Gold" value={data.colors?.[1] ?? ""} onChange={e => set("colors", [data.color ?? "", e.target.value, data.colors?.[2] ?? ""])} /></Field>
          <Field label="Available Colors" span><SI placeholder="Red, Blue, Green" value={data.colors?.join(", ") ?? ""} onChange={e => set("colors", e.target.value.split(",").map(x => x.trim()))} /></Field>
          <Field label="Work Type"><SI placeholder="Zari work" /></Field>
          <Field label="Weave Type"><SI placeholder="Hand woven" /></Field>
          <Field label="Border Type"><SI placeholder="Broad gold border" /></Field>
          <Field label="Pattern Type"><SI placeholder="Floral" /></Field>
          <Field label="Occasion Type"><SI placeholder="Wedding, Festival" /></Field>
          <Field label="Blouse Piece">
            <Select><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Included?" /></SelectTrigger>
              <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Blouse Length"><SI placeholder="0.8 metres" /></Field>
          <Field label="Product Tags" span><SI placeholder="silk, wedding, traditional" value={data.tags?.join(", ") ?? ""} onChange={e => set("tags", e.target.value.split(",").map(x => x.trim()))} /></Field>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-2 gap-3">
          {data.images?.[0] && (
            <div className="col-span-2 flex gap-2 flex-wrap">
              {data.images.map((img, i) => <img key={i} src={img} alt="" className="w-14 h-16 rounded object-cover border" />)}
            </div>
          )}
          <Field label="Main Product Image" required span><Input type="file" accept="image/*" className="h-8 text-sm" /></Field>
          <Field label="Gallery Images" span><Input type="file" accept="image/*" multiple className="h-8 text-sm" /></Field>
          <Field label="Product Video"><Input type="file" accept="video/*" className="h-8 text-sm" /></Field>
          <Field label="360° Images"><Input type="file" accept="image/*" multiple className="h-8 text-sm" /></Field>
          <Field label="Weight (grams)"><SI type="number" placeholder="600" /></Field>
          <Field label="Package Length (cm)"><SI type="number" placeholder="40" /></Field>
          <Field label="Package Width (cm)"><SI type="number" placeholder="30" /></Field>
          <Field label="Package Height (cm)"><SI type="number" placeholder="10" /></Field>
          <Field label="Est. Delivery Time"><SI placeholder="5-7 business days" /></Field>
          <Field label="Return Period (Days)"><SI type="number" placeholder="7" /></Field>
          <div className="col-span-2 grid grid-cols-3 gap-2 pt-1">
            {[["Return Available", true], ["Cash On Delivery", true], ["Free Shipping", false]].map(([label, def]) => (
              <div key={label as string} className="flex items-center justify-between border rounded-lg p-2.5">
                <Label className="text-xs">{label as string}</Label>
                <Switch defaultChecked={def as boolean} />
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="SEO Title" span><SI placeholder="Buy Kanjivaram Silk Saree Online" /></Field>
          <Field label="SEO Description" span><Textarea className="text-sm min-h-[56px]" placeholder="Meta description..." /></Field>
          <Field label="SEO Keywords" span><SI placeholder="silk saree, kanjivaram, buy saree online" /></Field>
          <Field label="Product Status" required span>
            <Select><SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
            </Select>
          </Field>
          <div className="col-span-2 grid grid-cols-2 gap-2">
            {(["Featured Product", "Trending Product"] as const).map((label) => (
              <div key={label} className="flex items-center justify-between border rounded-lg p-2.5">
                <Label className="text-xs">{label}</Label><Switch />
              </div>
            ))}
            <div className="flex items-center justify-between border rounded-lg p-2.5">
              <Label className="text-xs">New Arrival</Label><Switch defaultChecked={data.isNew} onCheckedChange={v => set("isNew", v)} />
            </div>
            <div className="flex items-center justify-between border rounded-lg p-2.5">
              <Label className="text-xs">Best Seller</Label><Switch defaultChecked={data.isBestSeller} onCheckedChange={v => set("isBestSeller", v)} />
            </div>
            <div className="flex items-center justify-between border rounded-lg p-2.5">
              <Label className="text-xs">Limited Edition</Label><Switch defaultChecked={data.isLimited} onCheckedChange={v => set("isLimited", v)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared Wizard shell (Add / Edit) ─────────────────────────────────────────
function ProductWizard({ open, onOpenChange, initial, title }: { open: boolean; onOpenChange: (v: boolean) => void; initial: WizardData; title: string }) {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [data, setData] = useState<WizardData>(initial);

  const set = (k: keyof WizardData, v: unknown) => setData(d => ({ ...d, [k]: v }));
  const goTo = (next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setStep(next); setAnimating(false); }, 150);
  };
  const reset = () => { setStep(0); setData(initial); onOpenChange(false); };

  // sync initial when it changes (e.g. different product selected)
  const openRef = open;
  if (!openRef && step !== 0) { /* reset on next open handled via key */ }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); else { setStep(0); setData(initial); onOpenChange(true); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="font-display text-xl">{title}</DialogTitle>
          <div className="flex items-center gap-1 mt-3">
            {STEPS.map((_, i) => (
              <div key={i} className="flex items-center gap-1 flex-1">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-all duration-300 ${i < step ? "bg-success text-white" : i === step ? "bg-brand text-white scale-110" : "bg-muted text-muted-foreground"}`}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 rounded transition-all duration-500 ${i < step ? "bg-success" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-sm font-semibold" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.25s" }}>{STEPS[step].title}</p>
            <p className="text-xs text-muted-foreground" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.25s" }}>{STEPS[step].desc}</p>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div style={{ opacity: animating ? 0 : 1, transition: "opacity 0.25s ease" }}>
            {STEPS.map((_, i) => <WizardStep key={i} step={i} visible={i === step} data={data} set={set} />)}
          </div>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between shrink-0 bg-muted/30">
          <div className="flex gap-2">
            {step > 0 && <Button variant="outline" size="sm" onClick={() => goTo(step - 1)}><ChevronLeft className="h-4 w-4 mr-1" />Back</Button>}
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={reset}>Cancel</Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Step {step + 1} / {STEPS.length}</span>
            {step < STEPS.length - 1
              ? <Button size="sm" className="bg-brand hover:bg-brand/90 text-brand-foreground" onClick={() => goTo(step + 1)}>Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
              : <div className="flex gap-2">
                  <Button size="sm" variant="outline">Save Draft</Button>
                  <Button size="sm" className="bg-success hover:bg-success/90 text-white" onClick={reset}><Check className="h-4 w-4 mr-1" />Save</Button>
                </div>
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete confirm dialog ─────────────────────────────────────────────────────
function DeleteDialog({ product, open, onOpenChange }: { product: Saree | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />Delete Product</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4 py-2">
          <img src={product.images[0]} alt="" className="w-16 h-20 rounded-lg object-cover border shrink-0" />
          <div>
            <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{product.id} · {product.category}</p>
            <p className="text-xs text-muted-foreground">{formatINR(product.price)} · Stock: {product.stock}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">This action cannot be undone. The product will be permanently removed from your store.</p>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-white" onClick={() => onOpenChange(false)}>
            <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function AdminProducts() {
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Saree | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Saree | null>(null);

  const items = SAREES.filter((s) =>
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.id.toLowerCase().includes(q.toLowerCase()) ||
    s.category.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{items.length} products</p>
        </div>
        <Button className="bg-brand hover:bg-brand/90 text-brand-foreground" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />Add Product
        </Button>
      </div>

      {/* Add wizard */}
      <ProductWizard open={addOpen} onOpenChange={setAddOpen} initial={{}} title="Add New Product" />

      {/* Edit wizard */}
      <ProductWizard
        key={editProduct?.id}
        open={!!editProduct}
        onOpenChange={(v) => { if (!v) setEditProduct(null); }}
        initial={editProduct ?? {}}
        title="Edit Product"
      />

      {/* Delete dialog */}
      <DeleteDialog product={deleteProduct} open={!!deleteProduct} onOpenChange={(v) => { if (!v) setDeleteProduct(null); }} />

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name, ID or category..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-x-auto">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <p className="text-sm font-semibold">Products <span className="text-muted-foreground font-normal">({items.length})</span></p>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={() => exportCSV("products.csv", items.slice(0,25).map(s => ({ ID: s.id, Name: s.name, Category: s.category, Fabric: s.fabric, Color: s.color, Price: s.price, MRP: s.originalPrice, Discount: s.discount + "%", Stock: s.stock, Tags: s.tags.join("|")})))}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-muted/50 text-left">
            <tr>
              {["Product", "Category", "Fabric", "Colors", "Pricing", "Stock", "Badges", "Actions"].map(h => (
                <th key={h} className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 25).map((s) => (
              <tr key={s.id} className="border-t hover:bg-muted/20 transition-colors">

                {/* Product */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <img src={s.images[0]} alt="" className="w-10 h-12 rounded-lg object-cover shrink-0 border" />
                    <div className="min-w-0">
                      <p className="font-medium line-clamp-1 max-w-[170px] text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{s.id}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-[160px]">{s.slug}</p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="capitalize text-xs font-medium bg-accent px-2 py-1 rounded-md">{s.category}</span>
                </td>

                {/* Fabric */}
                <td className="px-3 py-2.5">
                  <span className="text-xs text-foreground">{s.fabric}</span>
                </td>

                {/* Colors */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    {s.colors.map((c, i) => (
                      <span key={i} title={c} className="w-4 h-4 rounded-full border border-border shrink-0"
                        style={{ background: c.toLowerCase() === "gold" ? "#d4a017" : c.toLowerCase() === "maroon" ? "#800000" : c.toLowerCase() === "royal blue" ? "#4169e1" : c.toLowerCase() === "ivory" ? "#fffff0" : c.toLowerCase() === "coral" ? "#ff7f50" : c.toLowerCase() === "emerald" ? "#50c878" : c.toLowerCase() }} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-0.5">{s.color}</span>
                  </div>
                </td>

                {/* Pricing */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <p className="font-semibold text-sm">{formatINR(s.price)}</p>
                  <p className="text-xs text-muted-foreground line-through">{formatINR(s.originalPrice)}</p>
                  <span className="text-xs text-success font-medium">{s.discount}% off</span>
                </td>

                {/* Stock */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <StockBadge stock={s.stock} />
                    <span className="text-xs text-muted-foreground">Qty: {s.stock}</span>
                  </div>
                </td>

                {/* Badges */}
                <td className="px-3 py-2.5">
                  <div className="flex flex-col gap-1">
                    {s.isNew && <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-sky/10 text-sky font-semibold whitespace-nowrap"><Sparkles className="h-2.5 w-2.5" />New</span>}
                    {s.isBestSeller && <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold font-semibold whitespace-nowrap"><Star className="h-2.5 w-2.5" />Best Seller</span>}
                    {s.isLimited && <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-brand/10 text-brand font-semibold whitespace-nowrap"><Crown className="h-2.5 w-2.5" />Limited</span>}
                    {!s.isNew && !s.isBestSeller && !s.isLimited && <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-3 py-2.5">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1" onClick={() => setEditProduct(s)}>
                      <Edit2 className="h-3 w-3" />Edit
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => setDeleteProduct(s)}>
                      <Trash2 className="h-3 w-3" />Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-sm">No products found for "{q}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
