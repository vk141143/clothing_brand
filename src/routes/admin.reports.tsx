import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, TrendingUp, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/reports")({
  component: Reports,
});

function Reports() {
  const reports = [
    { icon: TrendingUp, t: "Sales Report", d: "Daily, weekly, monthly sales breakdown" },
    { icon: FileSpreadsheet, t: "Revenue Report", d: "Revenue by category and product" },
    { icon: Package, t: "Inventory Report", d: "Stock levels and low-stock alerts" },
    { icon: Users, t: "Customer Report", d: "Top customers and order frequency" },
  ];
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Reports & Analytics</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div key={r.t} className="p-6 bg-card border rounded-xl flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center"><r.icon className="h-6 w-6" /></div>
            <div className="flex-1">
              <h3 className="font-semibold">{r.t}</h3>
              <p className="text-sm text-muted-foreground">{r.d}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> CSV</Button>
                <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> PDF</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
