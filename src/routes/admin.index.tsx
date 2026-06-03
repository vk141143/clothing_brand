import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, ShoppingCart, IndianRupee, Package, AlertTriangle, Truck, TrendingUp, ArrowUpRight } from "lucide-react";
import { SAREES } from "@/lib/data";
import { formatINR } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = [
    { icon: Users, label: "Total Users", value: "12,847", change: "+12.4%", color: "text-sky" },
    { icon: ShoppingCart, label: "Total Orders", value: "3,421", change: "+8.2%", color: "text-brand" },
    { icon: IndianRupee, label: "Revenue", value: "₹48.2L", change: "+24.1%", color: "text-success" },
    { icon: Package, label: "Active Products", value: SAREES.length.toString(), change: "+3", color: "text-navy" },
    { icon: AlertTriangle, label: "Low Stock", value: SAREES.filter((s) => s.stock > 0 && s.stock <= 5).length.toString(), change: "Attention", color: "text-warning" },
    { icon: Truck, label: "Pending Delivery", value: "84", change: "Today", color: "text-gold" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const sales = [42, 55, 49, 62, 70, 65, 78, 85, 80, 92, 105, 118];
  const max = Math.max(...sales);

  return (
    <div>
      <div className="flex justify-between items-end mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, here's what's happening today</p>
        </div>
        <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="p-4 bg-card border rounded-xl">
            <div className={`h-9 w-9 rounded-lg bg-muted flex items-center justify-center ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <div className="text-2xl font-bold mt-3">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-[11px] text-success font-semibold mt-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> {s.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 p-6 bg-card border rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Sales Analytics</h3>
            <span className="text-xs text-success font-semibold flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +24.1% YoY</span>
          </div>
          <div className="flex items-end gap-2 h-48">
            {sales.map((v, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ delay: i * 0.04 }}
                className="flex-1 bg-gradient-to-t from-brand to-sky rounded-t" />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">{months.map((m) => <span key={m}>{m}</span>)}</div>
        </div>
        <div className="p-6 bg-card border rounded-xl">
          <h3 className="font-semibold mb-4">Top Products</h3>
          <div className="space-y-3">
            {SAREES.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <img src={s.images[0]} alt="" className="w-10 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{s.name}</p><p className="text-xs text-muted-foreground">{formatINR(s.price)}</p></div>
                <span className="text-xs text-success font-semibold">{Math.floor(Math.random() * 100 + 20)} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-card border rounded-xl">
        <h3 className="font-semibold mb-4">Recent Orders</h3>
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground border-b">
            <tr>{["Order", "Customer", "Amount", "Status", "Date"].map((h) => <th key={h} className="py-2">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ["#ORD3421", "Priya Sharma", "₹12,450", "Delivered"],
              ["#ORD3420", "Anjali Verma", "₹8,990", "Shipped"],
              ["#ORD3419", "Meera Iyer", "₹24,500", "Packed"],
              ["#ORD3418", "Kavita R.", "₹4,200", "Confirmed"],
              ["#ORD3417", "Divya P.", "₹18,750", "Delivered"],
            ].map((r, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-3 font-medium">{r[0]}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td><span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success">{r[3]}</span></td>
                <td className="text-muted-foreground">Today</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
