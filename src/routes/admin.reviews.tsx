import { createFileRoute } from "@tanstack/react-router";
import { Star, Check, X, Trash2, Eye, Edit, MessageCircle, ThumbsUp, ThumbsDown, Image as ImageIcon, Search, Filter, Send, BarChart3, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, MessageSquare, Calendar, Download, Plus } from "lucide-react";
import { useState } from "react";

function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, "'")}"` ).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = filename; a.click();
}

export const Route = createFileRoute("/admin/reviews")({
  component: Reviews,
});

const statusBadgeColor = {
  "Pending Approval": "bg-yellow-100 text-yellow-800",
  "Approved": "bg-green-100 text-green-800",
  "Rejected": "bg-red-100 text-red-800",
  "Hidden": "bg-gray-100 text-gray-800",
};

const rejectionReasons = [
  "Spam Content",
  "Offensive Language",
  "Fake Review",
  "Duplicate Review",
  "Irrelevant Content",
];

const positiveKeywords = [
  { keyword: "Beautiful", count: 342 },
  { keyword: "Quality", count: 298 },
  { keyword: "Gorgeous", count: 267 },
  { keyword: "Amazing", count: 234 },
  { keyword: "Perfect", count: 198 },
  { keyword: "Love", count: 187 },
  { keyword: "Excellent", count: 156 },
  { keyword: "Nice", count: 143 },
];

const negativeKeywords = [
  { keyword: "Poor Quality", count: 45 },
  { keyword: "Delayed Delivery", count: 38 },
  { keyword: "Color Mismatch", count: 32 },
  { keyword: "Expensive", count: 28 },
  { keyword: "Fabric Issue", count: 24 },
  { keyword: "Not Worth", count: 21 },
];

const commonComplaints = [
  { issue: "Delivery delays", count: 67, percentage: "23%" },
  { issue: "Color different from images", count: 54, percentage: "19%" },
  { issue: "Sizing issues", count: 43, percentage: "15%" },
  { issue: "Fabric quality concerns", count: 38, percentage: "13%" },
  { issue: "Packaging damage", count: 29, percentage: "10%" },
];

const commonPraise = [
  { praise: "Beautiful embroidery work", count: 234, percentage: "28%" },
  { praise: "Great fabric quality", count: 198, percentage: "24%" },
  { praise: "Timely delivery", count: 167, percentage: "20%" },
  { praise: "Value for money", count: 145, percentage: "17%" },
  { praise: "Perfect for occasions", count: 123, percentage: "15%" },
];

const productAnalytics = [
  { product: "Royal Maharani Silk", totalReviews: 456, avgRating: 4.8, highestRated: true },
  { product: "Banaras Splendor", totalReviews: 389, avgRating: 4.6, highestRated: false },
  { product: "Emerald Dream", totalReviews: 312, avgRating: 4.7, highestRated: false },
  { product: "Golden Elegance", totalReviews: 287, avgRating: 4.4, highestRated: false },
  { product: "Crimson Glow", totalReviews: 234, avgRating: 4.2, highestRated: false, lowestRated: true },
  { product: "Royal Blue Silk", totalReviews: 198, avgRating: 4.5, highestRated: false },
];

function Reviews() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    productName: "",
    customerName: "",
    status: "",
    rating: "",
    source: "",
    verified: "",
    dateFrom: "",
    dateTo: "",
    hasImages: "",
  });

  const [showFeedbackInsights, setShowFeedbackInsights] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);

  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const dashboardMetrics = [
    { label: "Total Reviews", value: "2,847", color: "text-blue-600" },
    { label: "Average Rating", value: "4.6", color: "text-yellow-600" },
    { label: "5-Star Reviews", value: "1,562", color: "text-green-600" },
    { label: "4-Star Reviews", value: "892", color: "text-green-500" },
    { label: "3-Star Reviews", value: "243", color: "text-yellow-600" },
    { label: "2-Star Reviews", value: "89", color: "text-orange-600" },
    { label: "1-Star Reviews", value: "61", color: "text-red-600" },
    { label: "Pending Reviews", value: "34", color: "text-blue-500" },
    { label: "Approved Reviews", value: "2,756", color: "text-green-600" },
    { label: "Rejected Reviews", value: "45", color: "text-red-500" },
    { label: "Reviews With Images", value: "412", color: "text-purple-600" },
    { label: "Reviews This Month", value: "287", color: "text-indigo-600" },
    { label: "Positive Reviews", value: "78%", color: "text-green-600" },
    { label: "Negative Reviews", value: "12%", color: "text-red-600" },
    { label: "With Admin Replies", value: "156", color: "text-blue-600" },
  ];

  const adminReplies: Record<string, string> = {
    "REV001": "Thank you for your wonderful feedback! We're thrilled you loved the Maharani Silk collection. We look forward to serving you again!",
    "REV002": "Thank you for your feedback! We're sorry about the delivery delay. We always strive to deliver on time. Hope you enjoy the saree!",
  };

  const handleReplySubmit = (reviewId: string) => {
    if (!adminReply.trim()) {
      alert("Please enter a reply");
      return;
    }
    alert(`Reply submitted for ${reviewId}: ${adminReply}`);
    setAdminReply("");
    setShowReplyModal(false);
  };

  const handleEditReply = (reviewId: string) => {
    const currentReply = adminReplies[reviewId] || "";
    setAdminReply(currentReply);
    setShowReplyModal(true);
  };

  const handleDeleteReply = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this reply?")) {
      alert(`Reply deleted for ${reviewId}`);
    }
  };

  const reviewsListData = [
    {
      id: "REV001",
      date: "2024-01-17",
      status: "Pending Approval",
      source: "Website",
      customerName: "Priya Singh",
      customerId: "CUST001",
      verified: true,
      productName: "Royal Maharani Silk",
      productSku: "SAR-2024-001",
      rating: 5,
      qualityRating: 5,
      fabricRating: 5,
      colorRating: 4,
      valueRating: 4,
      deliveryRating: 5,
      title: "Absolutely Gorgeous!",
      comment: "The saree quality is exceptional. The silk feels luxurious and the weaving is impeccable.",
      hasImages: true,
      hasVideo: false,
      helpfulCount: 124,
      notHelpfulCount: 3,
      totalViews: 456,
      totalLikes: 89,
    },
    {
      id: "REV002",
      date: "2024-01-16",
      status: "Approved",
      source: "App",
      customerName: "Meera Iyer",
      customerId: "CUST002",
      verified: true,
      productName: "Banaras Splendor",
      productSku: "SAR-2024-002",
      rating: 4,
      qualityRating: 4,
      fabricRating: 4,
      colorRating: 5,
      valueRating: 3,
      deliveryRating: 4,
      title: "Lovely fabric, slightly delayed",
      comment: "Beautiful weaving and color. Delivery took 5 days instead of 3, but product is worth it.",
      hasImages: true,
      hasVideo: false,
      helpfulCount: 89,
      notHelpfulCount: 2,
      totalViews: 234,
      totalLikes: 56,
    },
    {
      id: "REV003",
      date: "2024-01-15",
      status: "Rejected",
      source: "Website",
      customerName: "Anjali Verma",
      customerId: "CUST003",
      verified: false,
      productName: "Crimson Glow",
      productSku: "SAR-2024-003",
      rating: 1,
      qualityRating: 1,
      fabricRating: 1,
      colorRating: 1,
      valueRating: 1,
      deliveryRating: 1,
      title: "Terrible quality!!!",
      comment: "This product is garbage and not worth the money. Complete waste!",
      hasImages: false,
      hasVideo: false,
      helpfulCount: 5,
      notHelpfulCount: 234,
      totalViews: 345,
      totalLikes: 12,
    },
    {
      id: "REV004",
      date: "2024-01-14",
      status: "Approved",
      source: "Website",
      customerName: "Rajini Desai",
      customerId: "CUST004",
      verified: true,
      productName: "Emerald Dream",
      productSku: "SAR-2024-004",
      rating: 5,
      qualityRating: 5,
      fabricRating: 5,
      colorRating: 5,
      valueRating: 4,
      deliveryRating: 5,
      title: "Perfect for wedding!",
      comment: "Amazing saree! Perfect drape and color. Got it in time for the wedding.",
      hasImages: true,
      hasVideo: true,
      helpfulCount: 267,
      notHelpfulCount: 8,
      totalViews: 890,
      totalLikes: 156,
    },
    {
      id: "REV005",
      date: "2024-01-13",
      status: "Hidden",
      source: "App",
      customerName: "Sonia Kapoor",
      customerId: "CUST005",
      verified: true,
      productName: "Golden Elegance",
      productSku: "SAR-2024-005",
      rating: 3,
      qualityRating: 3,
      fabricRating: 3,
      colorRating: 3,
      valueRating: 3,
      deliveryRating: 3,
      title: "Average quality",
      comment: "Good saree but nothing special. Average quality for the price.",
      hasImages: false,
      hasVideo: false,
      helpfulCount: 34,
      notHelpfulCount: 12,
      totalViews: 156,
      totalLikes: 28,
    },
  ];

  const handleView = (review) => {
    setSelectedReview(review);
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

  const handleModeration = (review) => {
    setSelectedReview(review);
    setShowModerationModal(true);
  };

  const handleReject = () => {
    if (!rejectionReason) {
      alert("Please select a rejection reason");
      return;
    }
    alert(`Review ${selectedReview.id} rejected with reason: ${rejectionReason}`);
    setShowModerationModal(false);
    setRejectionReason("");
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`${size} ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reviews Management</h1>
        <p className="text-muted-foreground">Manage and moderate customer reviews to build trust</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((metric) => (
          <div key={metric.label} className="bg-card border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className={`text-3xl font-bold mt-2 ${metric.color}`}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button onClick={() => { setShowFeedbackInsights(true); setShowReports(false); setShowAnalytics(false); }} className={`px-4 py-2 font-medium text-sm border-b-2 transition ${showFeedbackInsights ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}>
          <MessageSquare className="w-4 h-4 inline mr-2" />Customer Feedback Insights
        </button>
        <button onClick={() => { setShowFeedbackInsights(false); setShowReports(true); setShowAnalytics(false); }} className={`px-4 py-2 font-medium text-sm border-b-2 transition ${showReports ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}>
          <BarChart3 className="w-4 h-4 inline mr-2" />Review Reports
        </button>
        <button onClick={() => { setShowFeedbackInsights(false); setShowReports(false); setShowAnalytics(true); }} className={`px-4 py-2 font-medium text-sm border-b-2 transition ${showAnalytics ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}>
          <TrendingUp className="w-4 h-4 inline mr-2" />Product Analytics
        </button>
      </div>

      {/* Customer Feedback Insights Section */}
      {showFeedbackInsights && (
        <div className="space-y-6">
          {/* Keywords & Sentiment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Mentioned Positive Keywords */}
            <div className="bg-card border rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" />Most Mentioned Positive Keywords</h3>
              <div className="space-y-2">
                {positiveKeywords.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.keyword}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-green-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${(item.count / 342) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Mentioned Negative Keywords */}
            <div className="bg-card border rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-600" />Most Mentioned Negative Keywords</h3>
              <div className="space-y-2">
                {negativeKeywords.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.keyword}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-red-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${(item.count / 45) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Common Complaints & Praise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Complaints */}
            <div className="bg-card border rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-600" />Common Complaints</h3>
              <div className="space-y-3">
                {commonComplaints.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="text-sm">{item.issue}</span>
                    <div className="text-right">
                      <span className="text-xs font-medium text-red-600">{item.percentage}</span>
                      <span className="text-xs text-muted-foreground ml-2">({item.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Praise Points */}
            <div className="bg-card border rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" />Common Praise Points</h3>
              <div className="space-y-3">
                {commonPraise.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-sm">{item.praise}</span>
                    <div className="text-right">
                      <span className="text-xs font-medium text-green-600">{item.percentage}</span>
                      <span className="text-xs text-muted-foreground ml-2">({item.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Reply Section */}
          <div className="bg-card border rounded-xl p-4">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" />Admin Reply Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => { const review = reviewsListData[0]; setSelectedReview(review); setAdminReply(""); setShowReplyModal(true); }} className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                <Plus className="w-5 h-5" />Reply To Review
              </button>
              <button onClick={() => { const review = reviewsListData[0]; setSelectedReview(review); handleEditReply(review.id); }} className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:border-green-500 hover:bg-green-50 transition">
                <Edit className="w-5 h-5" />Edit Reply
              </button>
              <button onClick={() => { const review = reviewsListData[0]; handleDeleteReply(review.id); }} className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:border-red-500 hover:bg-red-50 transition">
                <Trash2 className="w-5 h-5" />Delete Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Reports Section */}
      {showReports && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Product Rating Report", icon: Star, color: "bg-yellow-100 text-yellow-700" },
              { title: "Customer Feedback Report", icon: MessageSquare, color: "bg-blue-100 text-blue-700" },
              { title: "Negative Reviews Report", icon: TrendingDown, color: "bg-red-100 text-red-700" },
              { title: "Positive Reviews Report", icon: TrendingUp, color: "bg-green-100 text-green-700" },
              { title: "Monthly Reviews Report", icon: Calendar, color: "bg-purple-100 text-purple-700" },
              { title: "Review Reports", icon: BarChart3, color: "bg-indigo-100 text-indigo-700" },
            ].map((report, i) => {
              const Icon = report.icon;
              return (
                <div key={i} className="bg-card border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${report.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{report.title}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">View Report</span>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Analytics Section */}
      {showAnalytics && (
        <div className="space-y-6">
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h3 className="text-lg font-bold">Product Review Analytics</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs font-semibold">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Total Reviews</th>
                  <th className="p-3">Average Rating</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {productAnalytics.map((product, i) => (
                  <tr key={i} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{product.product}</td>
                    <td className="p-3">{product.totalReviews}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.avgRating}</span>
                        <div className="flex gap-0.5">{renderStars(product.avgRating, "w-3 h-3")}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      {product.highestRated && <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">Highest Rated</span>}
                      {product.lowestRated && <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">Lowest Rated</span>}
                      {!product.highestRated && !product.lowestRated && <span className="text-xs text-muted-foreground">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Filters */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-4 border-b bg-muted/50">
          <h2 className="text-lg font-bold">Review Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase font-semibold">Search By Product Name</label>
            <input type="text" placeholder="Search by product name..." value={filters.productName} onChange={(e) => setFilters({ ...filters, productName: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase font-semibold">Search By Customer Name</label>
            <input type="text" placeholder="Search by customer name..." value={filters.customerName} onChange={(e) => setFilters({ ...filters, customerName: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase font-semibold">Filter By Status</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm bg-background">
              <option value="">All Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase font-semibold">Filter By Rating</label>
            <select value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm bg-background">
              <option value="">All Ratings</option>
              <option value="5">5-Star</option>
              <option value="4">4-Star</option>
              <option value="3">3-Star</option>
              <option value="2">2-Star</option>
              <option value="1">1-Star</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase font-semibold">Filter By Date</label>
            <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase font-semibold">Filter By Verified Purchase</label>
            <select value={filters.verified} onChange={(e) => setFilters({ ...filters, verified: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm bg-background">
              <option value="">All</option>
              <option value="true">Verified Only</option>
              <option value="false">Non-Verified</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase font-semibold">Filter By Reviews With Images</label>
            <select value={filters.hasImages} onChange={(e) => setFilters({ ...filters, hasImages: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm bg-background">
              <option value="">All</option>
              <option value="true">With Images</option>
              <option value="false">Without Images</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase font-semibold">Filter By Source</label>
            <select value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm bg-background">
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="App">App</option>
            </select>
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Search className="w-4 h-4" /> Search
          </button>
          <button onClick={() => setFilters({ searchTerm: "", productName: "", customerName: "", status: "", rating: "", source: "", verified: "", dateFrom: "", dateTo: "", hasImages: "" })} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted">
            Clear
          </button>
        </div>
      </div>

      {/* Reviews Listing Table */}
      <div className="bg-card border rounded-xl overflow-x-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Reviews Listing</h2>
          <button onClick={() => exportCSV("reviews.csv", reviewsListData.map(r => ({ ReviewID: r.id, Date: r.date, Customer: r.customerName, CustomerID: r.customerId, Product: r.productName, SKU: r.productSku, Rating: r.rating, QualityRating: r.qualityRating, FabricRating: r.fabricRating, ColorRating: r.colorRating, ValueRating: r.valueRating, DeliveryRating: r.deliveryRating, Title: r.title, Comment: r.comment, Status: r.status, Source: r.source, Verified: r.verified, HasImages: r.hasImages, HelpfulCount: r.helpfulCount })))} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded-lg hover:bg-muted font-medium">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs font-semibold">
            <tr>
              <th className="p-3">Review ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Review Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Source</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviewsListData.map((review) => (
              <tr key={review.id} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">{review.id}</td>
                <td className="p-3">{review.date}</td>
                <td className="p-3">{review.customerName}</td>
                <td className="p-3 text-xs">{review.productName}</td>
                <td className="p-3">
                  <div className="flex gap-0.5">{renderStars(review.rating, "w-3 h-3")}</div>
                </td>
                <td className="p-3 max-w-xs truncate">{review.title}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${statusBadgeColor[review.status as keyof typeof statusBadgeColor]}`}>{review.status}</span>
                </td>
                <td className="p-3 text-xs">{review.source}</td>
                <td className="p-3">{review.verified ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleView(review)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit(review.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Details Modal */}
      {showDetailsModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-muted/50 border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Review Details - {selectedReview.id}</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-xl font-bold">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Review Information */}
              <div>
                <h3 className="text-lg font-bold mb-3">Review Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Review ID", value: selectedReview.id },
                    { label: "Review Date", value: selectedReview.date },
                    { label: "Review Status", value: selectedReview.status },
                    { label: "Review Source", value: selectedReview.source },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</p>
                      <p className="mt-1 font-medium">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-bold mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Customer Name", value: selectedReview.customerName },
                    { label: "Customer ID", value: selectedReview.customerId },
                    { label: "Verified Purchase", value: selectedReview.verified ? "Yes" : "No" },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</p>
                      <p className="mt-1">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Information */}
              <div>
                <h3 className="text-lg font-bold mb-3">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Product Name", value: selectedReview.productName },
                    { label: "Product SKU", value: selectedReview.productSku },
                    { label: "Category", value: "Saree" },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</p>
                      <p className="mt-1">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Information */}
              <div>
                <h3 className="text-lg font-bold mb-3">Rating Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Overall Rating", value: selectedReview.rating },
                    { label: "Quality Rating", value: selectedReview.qualityRating },
                    { label: "Fabric Rating", value: selectedReview.fabricRating },
                    { label: "Color Rating", value: selectedReview.colorRating },
                    { label: "Value For Money", value: selectedReview.valueRating },
                    { label: "Delivery Experience", value: selectedReview.deliveryRating },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</p>
                      <div className="mt-1 flex gap-0.5">{renderStars(field.value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h3 className="text-lg font-bold mb-3">Review Content</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Review Title</p>
                    <p className="mt-1 font-medium text-lg">{selectedReview.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Review Comment</p>
                    <p className="mt-1">{selectedReview.comment}</p>
                  </div>
                  {(selectedReview.hasImages || selectedReview.hasVideo) && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Media</p>
                      <div className="mt-2 flex gap-2">
                        {selectedReview.hasImages && <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"><ImageIcon className="w-3 h-3" /> Has Images</span>}
                        {selectedReview.hasVideo && <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"><MessageCircle className="w-3 h-3" /> Has Video</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Engagement Metrics */}
              <div>
                <h3 className="text-lg font-bold mb-3">Engagement Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Helpful Count", value: selectedReview.helpfulCount, icon: ThumbsUp, color: "text-green-600" },
                    { label: "Not Helpful Count", value: selectedReview.notHelpfulCount, icon: ThumbsDown, color: "text-red-600" },
                    { label: "Total Views", value: selectedReview.totalViews, icon: Eye, color: "text-blue-600" },
                    { label: "Total Likes", value: selectedReview.totalLikes, icon: Star, color: "text-yellow-600" },
                  ].map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.label}>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">{field.label}</p>
                        <div className={`mt-1 flex items-center gap-2 text-2xl font-bold ${field.color}`}>
                          <Icon className="w-5 h-5" /> {field.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Moderation Actions */}
              <div>
                <h3 className="text-lg font-bold mb-3">Review Moderation</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { label: "Approve Review", color: "bg-green-600", icon: Check },
                    { label: "Reject Review", color: "bg-red-600", icon: X },
                    { label: "Hide Review", color: "bg-gray-600", icon: Filter },
                    { label: "Delete Review", color: "bg-red-700", icon: Trash2 },
                    { label: "Restore Review", color: "bg-blue-600", icon: Check },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <button key={action.label} onClick={() => action.label === "Reject Review" && handleModeration(selectedReview)} className={`${action.color} text-white px-2 py-2 rounded text-xs font-medium hover:opacity-90 flex items-center gap-1 justify-center`}>
                        <Icon className="w-3 h-3" /> {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Modal */}
      {showModerationModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-muted/50 border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Reject Review - {selectedReview.id}</h2>
              <button onClick={() => setShowModerationModal(false)} className="text-xl font-bold">&times;</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase font-semibold">Rejection Reason</label>
                <select value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Select a reason</option>
                  {rejectionReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button onClick={handleReject} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
                  Confirm Rejection
                </button>
                <button onClick={() => setShowModerationModal(false)} className="flex-1 border px-4 py-2 rounded-lg font-medium hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Reply Modal */}
      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="bg-muted/50 border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Reply To Review - {selectedReview.id}</h2>
              <button onClick={() => setShowReplyModal(false)} className="text-xl font-bold">&times;</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Original Review</p>
                <p className="text-sm mt-1">{selectedReview.comment}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase font-semibold">Your Reply</label>
                <textarea value={adminReply} onChange={(e) => setAdminReply(e.target.value)} placeholder="Write your reply to this review..." className="mt-2 w-full px-3 py-2 border rounded-lg text-sm h-32 resize-none" />
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => handleReplySubmit(selectedReview.id)} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                  <Send className="w-4 h-4" /> Submit Reply
                </button>
                <button onClick={() => setShowReplyModal(false)} className="flex-1 border px-4 py-2 rounded-lg font-medium hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
