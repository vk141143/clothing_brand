import { SAREES } from "./data";

export type OrderStatus =
  | "New" | "Confirmed" | "Processing" | "Packed"
  | "Ready for Dispatch" | "Shipped" | "Out for Delivery"
  | "Delivered" | "Cancelled" | "Returned" | "Refunded";

export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Wallet" | "Cash on Delivery";
export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
export type OrderSource = "Website" | "App";

export type OrderProduct = {
  productId: string;
  name: string;
  image: string;
  sku: string;
  category: string;
  color: string;
  qty: number;
  unitPrice: number;
  discount: number; // percentage
  totalAmount: number;
};

export type ShippingAddress = {
  fullName: string;
  mobile: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type DeliveryPartner = "Bluedart" | "Delhivery" | "DTDC" | "Ekart" | "Xpressbees" | "India Post";

export type ReturnStatus = "Requested" | "Approved" | "Picked Up" | "Received" | "Rejected";
export type RefundStatus = "Pending" | "Initiated" | "Completed" | "Failed";

export type ReturnInfo = {
  requestId: string;
  reason: string;
  status: ReturnStatus;
  refundAmount: number;
  refundStatus: RefundStatus;
  refundDate: string;
};

export type Order = {
  id: string;
  date: string; // ISO
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  source: OrderSource;
  customer: {
    id: string;
    name: string;
    mobile: string;
    email: string;
  };
  address: ShippingAddress;
  products: OrderProduct[];
  subtotal: number;
  couponDiscount: number;
  shippingCharges: number;
  tax: number;
  grandTotal: number;
  delivery: {
    partner: DeliveryPartner;
    trackingNumber: string;
    dispatchDate: string;
    estimatedDelivery: string;
    actualDelivery: string;
  };
  returnInfo?: ReturnInfo;
};

const CUSTOMERS = [
  { id: "CUS001", name: "Priya Sharma",   mobile: "9876543210", email: "priya@example.com" },
  { id: "CUS002", name: "Anjali Verma",   mobile: "9123456780", email: "anjali@example.com" },
  { id: "CUS003", name: "Meera Iyer",     mobile: "9988776655", email: "meera@example.com" },
  { id: "CUS004", name: "Kavita Reddy",   mobile: "9871234560", email: "kavita@example.com" },
  { id: "CUS005", name: "Divya Pillai",   mobile: "9765432109", email: "divya@example.com" },
  { id: "CUS006", name: "Sunita Bose",    mobile: "9654321098", email: "sunita@example.com" },
  { id: "CUS007", name: "Rekha Nair",     mobile: "9543210987", email: "rekha@example.com" },
  { id: "CUS008", name: "Lakshmi Das",    mobile: "9432109876", email: "lakshmi@example.com" },
];

const ADDRESSES: ShippingAddress[] = [
  { fullName: "Priya Sharma",  mobile: "9876543210", house: "Flat 4B", street: "MG Road",         landmark: "Near City Mall",    city: "Mumbai",    state: "Maharashtra", pincode: "400001", country: "India" },
  { fullName: "Anjali Verma",  mobile: "9123456780", house: "H.No 12", street: "Lajpat Nagar",    landmark: "Opp. Metro Station",city: "Delhi",     state: "Delhi",       pincode: "110024", country: "India" },
  { fullName: "Meera Iyer",    mobile: "9988776655", house: "No. 7",   street: "Jayanagar 4th Block",landmark: "Near Park",      city: "Bangalore", state: "Karnataka",   pincode: "560011", country: "India" },
  { fullName: "Kavita Reddy",  mobile: "9871234560", house: "Plot 22", street: "Banjara Hills",   landmark: "Near KFC",          city: "Hyderabad", state: "Telangana",   pincode: "500034", country: "India" },
  { fullName: "Divya Pillai",  mobile: "9765432109", house: "TC 3/44", street: "Kowdiar",         landmark: "Near Temple",       city: "Trivandrum",state: "Kerala",      pincode: "695003", country: "India" },
  { fullName: "Sunita Bose",   mobile: "9654321098", house: "Block C3",street: "Salt Lake",       landmark: "Near IT Hub",       city: "Kolkata",   state: "West Bengal", pincode: "700091", country: "India" },
  { fullName: "Rekha Nair",    mobile: "9543210987", house: "12A",     street: "Residency Road",  landmark: "Near Café",         city: "Chennai",   state: "Tamil Nadu",  pincode: "600025", country: "India" },
  { fullName: "Lakshmi Das",   mobile: "9432109876", house: "F-201",   street: "Arera Colony",    landmark: "Near School",       city: "Bhopal",    state: "MP",          pincode: "462016", country: "India" },
];

const STATUSES: OrderStatus[] = [
  "New", "Confirmed", "Processing", "Packed",
  "Shipped", "Delivered", "Delivered", "Delivered",
  "Cancelled", "Returned", "Refunded", "Out for Delivery",
];

const PAYMENT_METHODS: PaymentMethod[] = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet", "Cash on Delivery"];
const PAYMENT_STATUSES: PaymentStatus[] = ["Paid", "Paid", "Paid", "Pending", "Failed", "Refunded"];
const SOURCES: OrderSource[] = ["Website", "App", "Website", "Website", "App"];
const DELIVERY_PARTNERS: DeliveryPartner[] = ["Bluedart", "Delhivery", "DTDC", "Ekart", "Xpressbees", "India Post"];
const RETURN_REASONS = [
  "Wrong product delivered", "Damaged product", "Product not as described",
  "Size/colour mismatch", "Changed my mind", "Late delivery",
];

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function makeDate(daysAgo: number, seed: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(Math.floor(seededRand(seed) * 23), Math.floor(seededRand(seed + 1) * 59));
  return d.toISOString();
}

export const ORDERS: Order[] = Array.from({ length: 30 }, (_, i) => {
  const ci = i % CUSTOMERS.length;
  const cust = CUSTOMERS[ci];
  const addr = ADDRESSES[ci];
  const saree = SAREES[i % SAREES.length];
  const qty = 1 + (i % 3);
  const unitPrice = saree.price;
  const discPct = saree.discount;
  const totalProd = Math.round(unitPrice * qty * (1 - discPct / 100));
  const subtotal = totalProd;
  const coupon = i % 5 === 0 ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 2000 ? 0 : 99;
  const tax = Math.round((subtotal - coupon) * 0.05);
  const grand = subtotal - coupon + shipping + tax;

  const orderDate = makeDate(i % 30, i * 7);
  const status = STATUSES[i % STATUSES.length];
  const hasReturn = status === "Returned" || status === "Refunded";

  return {
    id: `ORD${10000 + i}`,
    date: orderDate,
    status,
    paymentStatus: PAYMENT_STATUSES[i % PAYMENT_STATUSES.length],
    paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
    source: SOURCES[i % SOURCES.length],
    customer: cust,
    address: { ...addr },
    products: [
      {
        productId: saree.id,
        name: saree.name,
        image: saree.images[0],
        sku: `SKU-${saree.id.toUpperCase()}`,
        category: saree.category,
        color: saree.color,
        qty,
        unitPrice,
        discount: discPct,
        totalAmount: totalProd,
      },
    ],
    subtotal,
    couponDiscount: coupon,
    shippingCharges: shipping,
    tax,
    grandTotal: grand,
    delivery: {
      partner: DELIVERY_PARTNERS[i % DELIVERY_PARTNERS.length],
      trackingNumber: `TRK${100000 + i * 13}`,
      dispatchDate: addDays(orderDate, 1),
      estimatedDelivery: addDays(orderDate, 5),
      actualDelivery: status === "Delivered" ? addDays(orderDate, 4 + (i % 2)) : "",
    },
    returnInfo: hasReturn ? {
      requestId: `RET${5000 + i}`,
      reason: RETURN_REASONS[i % RETURN_REASONS.length],
      status: status === "Refunded" ? "Approved" : "Requested",
      refundAmount: grand,
      refundStatus: status === "Refunded" ? "Completed" : "Pending",
      refundDate: status === "Refunded" ? addDays(orderDate, 10) : "",
    } : undefined,
  };
});

export const STATUS_COLORS: Record<OrderStatus, string> = {
  "New":               "bg-blue-100 text-blue-700",
  "Confirmed":         "bg-cyan-100 text-cyan-700",
  "Processing":        "bg-yellow-100 text-yellow-700",
  "Packed":            "bg-orange-100 text-orange-700",
  "Ready for Dispatch":"bg-purple-100 text-purple-700",
  "Shipped":           "bg-sky-100 text-sky-700",
  "Out for Delivery":  "bg-indigo-100 text-indigo-700",
  "Delivered":         "bg-green-100 text-green-700",
  "Cancelled":         "bg-red-100 text-red-700",
  "Returned":          "bg-pink-100 text-pink-700",
  "Refunded":          "bg-gray-100 text-gray-600",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  Paid:     "bg-green-100 text-green-700",
  Pending:  "bg-yellow-100 text-yellow-700",
  Failed:   "bg-red-100 text-red-700",
  Refunded: "bg-gray-100 text-gray-600",
};
