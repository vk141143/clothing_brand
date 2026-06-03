import { createFileRoute } from "@tanstack/react-router";
import { Package, Clock, CheckCircle2, AlertCircle, Truck, RotateCcw, Search, Eye, Edit, Trash2, FileText, Download, Phone, Tag } from "lucide-react";
import { useState } from "react";

function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, "'")}"` ).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = filename; a.click();
}

export const Route = createFileRoute("/admin/delivery")({
  component: Delivery,
});

const statusBadgeColor = {
  "Pending": "bg-yellow-100 text-yellow-800",
  "Processing": "bg-blue-100 text-blue-800",
  "Packed": "bg-purple-100 text-purple-800",
  "Shipped": "bg-indigo-100 text-indigo-800",
  "In Transit": "bg-cyan-100 text-cyan-800",
  "Out For Delivery": "bg-sky-100 text-sky-800",
  "Delivered": "bg-green-100 text-green-800",
  "Failed": "bg-red-100 text-red-800",
  "Returned": "bg-orange-100 text-orange-800",
  "Refunded": "bg-gray-100 text-gray-800",
};

function Delivery() {
  const [filters, setFilters] = useState({
    orderId: "",
    trackingNumber: "",
    customerName: "",
    mobileNumber: "",
    deliveryStatus: "",
    courierPartner: "",
    date: "",
  });

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const dashboardMetrics = [
    { label: "Total Deliveries", value: "1,234", icon: Package },
    { label: "Pending Deliveries", value: "45", icon: Clock },
    { label: "Packed Orders", value: "128", icon: Package },
    { label: "Ready For Dispatch", value: "87", icon: Truck },
    { label: "Shipped Orders", value: "312", icon: Truck },
    { label: "Out For Delivery Orders", value: "156", icon: Truck },
    { label: "Delivered Orders", value: "789", icon: CheckCircle2 },
    { label: "Failed Deliveries", value: "12", icon: AlertCircle },
    { label: "Returned Deliveries", value: "8", icon: RotateCcw },
  ];

  const summaryMetrics = [
    { label: "Today's Deliveries", value: "287" },
    { label: "Delivery Success Rate", value: "98.5%" },
    { label: "Average Delivery Time", value: "2.3 days" },
  ];

  const statusFlow = ["Order Placed", "Order Confirmed", "Processing", "Packed", "Ready For Dispatch", "Shipped", "In Transit", "Out For Delivery", "Delivered", "Delivery Failed", "Returned To Seller", "Refunded"];

  const deliveryListData = [
    { id: "DEL3421", orderId: "ORD3421", customerName: "Raj Kumar", mobileNumber: "9876543210", courierPartner: "Express Logistics", trackingNumber: "TRK123456789", status: "Out For Delivery", expectedDate: "2024-01-17", actualDate: "-" },
    { id: "DEL3420", orderId: "ORD3420", customerName: "Priya Singh", mobileNumber: "9876543211", courierPartner: "Speed Delivery", trackingNumber: "TRK123456790", status: "Delivered", expectedDate: "2024-01-16", actualDate: "2024-01-16" },
    { id: "DEL3419", orderId: "ORD3419", customerName: "Amit Patel", mobileNumber: "9876543212", courierPartner: "Safe Transport", trackingNumber: "TRK123456791", status: "Shipped", expectedDate: "2024-01-18", actualDate: "-" },
    { id: "DEL3418", orderId: "ORD3418", customerName: "Neha Sharma", mobileNumber: "9876543213", courierPartner: "Express Logistics", trackingNumber: "TRK123456792", status: "Processing", expectedDate: "2024-01-19", actualDate: "-" },
    { id: "DEL3417", orderId: "ORD3417", customerName: "Vikram Singh", mobileNumber: "9876543214", courierPartner: "Speed Delivery", trackingNumber: "TRK123456793", status: "Failed", expectedDate: "2024-01-15", actualDate: "-" },
  ];

  const fullDeliveryData = {
    id: "DEL3421",
    orderId: "ORD3421",
    trackingNumber: "TRK123456789",
    customerName: "Raj Kumar",
    customerMobile: "9876543210",
    customerAddress: "123, Main Street, Apt 4B, Mumbai, Maharashtra 400001",
    productName: "Silk Saree",
    productQuantity: "1",
    courierCompany: "Express Logistics",
    deliveryExecutive: "Sunil P.",
    timelineStages: [
      { stage: "Packed", completed: true, date: "2024-01-15" },
      { stage: "Shipped", completed: true, date: "2024-01-15" },
      { stage: "In Transit", completed: true, date: "2024-01-16" },
      { stage: "Out For Delivery", completed: true, date: "2024-01-17" },
      { stage: "Delivered", completed: false, date: "-" },
    ],
  };

  const reports = [
    { name: "Daily Deliveries Report", icon: FileText, action: "Download" },
    { name: "Monthly Deliveries Report", icon: FileText, action: "Download" },
    { name: "Failed Deliveries Report", icon: FileText, action: "Download" },
    { name: "Delivery Performance Report", icon: FileText, action: "Download" },
    { name: "Courier Performance Report", icon: FileText, action: "Download" },
    { name: "Return Deliveries Report", icon: FileText, action: "Download" },
  ];

  const handleView = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailsModal(true);
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for ${id}`);
  };

  const handleDelete = (id) => {
    if (confirm(`Are you sure you want to delete ${id}?`)) {
      alert(`Deleted ${id}`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Delivery Dashboard</h1>
        <p className="text-muted-foreground">Manage and track all deliveries</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                </div>
                <Icon className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryMetrics.map((metric) => (
          <div key={metric.label} className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="text-3xl font-bold mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Delivery Filters */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-4 border-b bg-muted/50">
          <h2 className="text-lg font-bold">Delivery Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {[
            { name: "orderId", label: "Search By Order ID", placeholder: "Enter Order ID" },
            { name: "trackingNumber", label: "Search By Tracking Number", placeholder: "Enter Tracking Number" },
            { name: "customerName", label: "Search By Customer Name", placeholder: "Enter Customer Name" },
            { name: "mobileNumber", label: "Search By Mobile Number", placeholder: "Enter Mobile Number" },
            { name: "deliveryStatus", label: "Filter By Delivery Status", options: statusFlow },
            { name: "courierPartner", label: "Filter By Courier Partner", options: ["Express Logistics", "Speed Delivery", "Safe Transport"] },
            { name: "date", label: "Filter By Date", type: "date" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</label>
              {field.options ? (
                <select value={filters[field.name as keyof typeof filters]} onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm bg-background">
                  <option value="">Select {field.label.split("By ")[1]}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input type={field.type || "text"} placeholder={field.placeholder} value={filters[field.name as keyof typeof filters]} onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm" />
              )}
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Search className="w-4 h-4" /> Search
          </button>
          <button onClick={() => setFilters({ orderId: "", trackingNumber: "", customerName: "", mobileNumber: "", deliveryStatus: "", courierPartner: "", date: "" })} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted">
            Clear
          </button>
        </div>
      </div>

      {/* Delivery Listing Table */}
      <div className="bg-card border rounded-xl overflow-x-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Delivery Listing</h2>
          <button onClick={() => exportCSV("deliveries.csv", deliveryListData.map(d => ({ DeliveryID: d.id, OrderID: d.orderId, Customer: d.customerName, Mobile: d.mobileNumber, CourierPartner: d.courierPartner, TrackingNumber: d.trackingNumber, Status: d.status, ExpectedDate: d.expectedDate, ActualDate: d.actualDate })))} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded-lg hover:bg-muted font-medium">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs font-semibold">
            <tr>
              <th className="p-3">Delivery ID</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Mobile Number</th>
              <th className="p-3">Courier Partner</th>
              <th className="p-3">Tracking Number</th>
              <th className="p-3">Delivery Status</th>
              <th className="p-3">Expected Date</th>
              <th className="p-3">Actual Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryListData.map((d) => (
              <tr key={d.id} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">{d.id}</td>
                <td className="p-3">{d.orderId}</td>
                <td className="p-3">{d.customerName}</td>
                <td className="p-3">{d.mobileNumber}</td>
                <td className="p-3">{d.courierPartner}</td>
                <td className="p-3 font-mono text-xs">{d.trackingNumber}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${statusBadgeColor[d.status as keyof typeof statusBadgeColor]}`}>{d.status}</span>
                </td>
                <td className="p-3">{d.expectedDate}</td>
                <td className="p-3 text-muted-foreground">{d.actualDate}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleView(d)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit(d.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delivery Actions */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-4 border-b bg-muted/50">
          <h2 className="text-lg font-bold">Delivery Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
          {[
            { label: "View Delivery", icon: Eye },
            { label: "Update Delivery Status", icon: Tag },
            { label: "Assign Delivery Partner", icon: Truck },
            { label: "Update Tracking Number", icon: Tag },
            { label: "Print Shipping Label", icon: FileText },
            { label: "Contact Customer", icon: Phone },
            { label: "Reschedule Delivery", icon: Clock },
            { label: "Mark As Delivered", icon: CheckCircle2 },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.label} className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors">
                <Icon className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Delivery Reports */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-4 border-b bg-muted/50">
          <h2 className="text-lg font-bold">Delivery Reports</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{report.name}</span>
                </div>
                <button className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700">
                  <Download className="w-3 h-3" /> {report.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Details Modal */}
      {showDetailsModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-muted/50 border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Delivery Details - {selectedDelivery.id}</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-xl font-bold">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Delivery Information */}
              <div>
                <h3 className="text-lg font-bold mb-3">Delivery Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Delivery ID", value: fullDeliveryData.id },
                    { label: "Order ID", value: fullDeliveryData.orderId },
                    { label: "Tracking Number", value: fullDeliveryData.trackingNumber },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</p>
                      <p className="mt-1 font-medium">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="text-lg font-bold mb-3">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Name", value: fullDeliveryData.customerName },
                    { label: "Mobile", value: fullDeliveryData.customerMobile },
                    { label: "Address", value: fullDeliveryData.customerAddress, span: 2 },
                  ].map((field) => (
                    <div key={field.label} className={field.span ? "md:col-span-2" : ""}>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</p>
                      <p className="mt-1">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div>
                <h3 className="text-lg font-bold mb-3">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Product Name", value: fullDeliveryData.productName },
                    { label: "Quantity", value: fullDeliveryData.productQuantity },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</p>
                      <p className="mt-1">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier Details */}
              <div>
                <h3 className="text-lg font-bold mb-3">Courier Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Courier Company", value: fullDeliveryData.courierCompany },
                    { label: "Delivery Executive", value: fullDeliveryData.deliveryExecutive },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</p>
                      <p className="mt-1">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Timeline */}
              <div>
                <h3 className="text-lg font-bold mb-3">Tracking Timeline</h3>
                <div className="space-y-3">
                  {fullDeliveryData.timelineStages.map((stage, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${stage.completed ? "bg-green-600" : "bg-gray-300"}`}></div>
                      <div className="flex-1">
                        <p className="font-medium">{stage.stage}</p>
                        <p className="text-xs text-muted-foreground">{stage.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-lg font-bold mb-3">Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: "Update Status", color: "bg-blue-600" },
                    { label: "Print Label", color: "bg-green-600" },
                    { label: "Contact Customer", color: "bg-purple-600" },
                    { label: "Reschedule Delivery", color: "bg-orange-600" },
                  ].map((action) => (
                    <button key={action.label} className={`${action.color} text-white px-3 py-2 rounded text-sm font-medium hover:opacity-90`}>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
