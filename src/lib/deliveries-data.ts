import { ORDERS } from "./orders-data";

export type DeliveryStatus = 
  | "Pending" | "Processing" | "Packed" | "Ready for Dispatch" | "Shipped" 
  | "In Transit" | "Out for Delivery" | "Delivered" | "Failed" | "Returned" | "Refunded";

export type CourierPartner = "Bluedart" | "Delhivery" | "DTDC" | "Ekart" | "Xpressbees" | "India Post";
export type FailureReason = "Customer Not Available" | "Wrong Address" | "Customer Rejected Delivery" 
  | "Damaged Package" | "Delivery Area Restricted" | "Other Reason";

export type TrackingEvent = {
  status: DeliveryStatus;
  location: string;
  timestamp: string;
};

export type Delivery = {
  id: string;
  orderId: string;
  trackingNumber: string;
  status: DeliveryStatus;
  shippingMethod: CourierPartner;
  dispatchDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate: string;
  
  customer: {
    name: string;
    mobile: string;
    email: string;
  };
  
  deliveryAddress: {
    fullName: string;
    mobile: string;
    line1: string;
    line2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  
  product: {
    name: string;
    sku: string;
    image: string;
    quantity: number;
    packageWeight: string;
  };
  
  deliveryPartner: {
    courierName: string;
    executiveName: string;
    executiveContact: string;
    vehicleNumber: string;
  };
  
  tracking: {
    currentLocation: string;
    lastUpdated: string;
    trackingHistory: TrackingEvent[];
  };
  
  deliveryAttempts: {
    count: number;
    firstAttemptDate: string;
    secondAttemptDate: string;
    thirdAttemptDate: string;
    failureReason: FailureReason | "";
  };
  
  returnDelivery?: {
    requestId: string;
    pickupStatus: "Pending" | "Picked Up" | "In Transit" | "Received";
    pickupDate: string;
    returnReceivedDate: string;
    reason: string;
    refundStatus: "Pending" | "Initiated" | "Completed" | "Failed";
  };
  
  charges: {
    shippingCharge: number;
    codCharge: number;
    discountedShipping: number;
    finalShippingCost: number;
  };
};

const COURIERS: CourierPartner[] = ["Bluedart", "Delhivery", "DTDC", "Ekart", "Xpressbees", "India Post"];
const EXECUTIVES = [
  "Ramesh Kumar", "Sunil Patel", "Vikram Singh", "Mahesh Reddy",
  "Ajay Verma", "Rajesh Sharma", "Amit Gupta", "Sandeep Kumar"
];
const LOCATIONS = [
  "Mumbai Distribution Center", "Delhi Hub", "Bangalore Sorting Facility",
  "Hyderabad Distribution", "Chennai Hub", "Local Delivery Station"
];
const FAILURE_REASONS: FailureReason[] = [
  "Customer Not Available", "Wrong Address", "Customer Rejected Delivery",
  "Damaged Package", "Delivery Area Restricted", "Other Reason"
];

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function addHours(iso: string, hours: number): string {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

export const DELIVERIES: Delivery[] = ORDERS.map((order, i) => {
  const courier = COURIERS[i % COURIERS.length];
  const executive = EXECUTIVES[i % EXECUTIVES.length];
  const status: DeliveryStatus = (() => {
    const rand = seededRand(i * 5);
    if (rand < 0.15) return "Pending";
    if (rand < 0.25) return "Processing";
    if (rand < 0.35) return "Packed";
    if (rand < 0.45) return "Ready for Dispatch";
    if (rand < 0.55) return "Shipped";
    if (rand < 0.65) return "In Transit";
    if (rand < 0.75) return "Out for Delivery";
    if (rand < 0.85) return "Delivered";
    if (rand < 0.92) return "Failed";
    if (rand < 0.97) return "Returned";
    return "Refunded";
  })();

  const dispatchDate = addDays(order.date, 1);
  const expectedDelivery = addDays(dispatchDate, 5);
  const actualDelivery = (status === "Delivered" || status === "Returned") 
    ? addDays(dispatchDate, 3 + (i % 3))
    : "";

  const attempts = status === "Failed" ? {
    count: 1 + (i % 3),
    firstAttemptDate: addDays(dispatchDate, 4),
    secondAttemptDate: i % 3 >= 1 ? addDays(dispatchDate, 5) : "",
    thirdAttemptDate: i % 3 === 2 ? addDays(dispatchDate, 6) : "",
    failureReason: FAILURE_REASONS[i % FAILURE_REASONS.length],
  } : {
    count: 0,
    firstAttemptDate: "",
    secondAttemptDate: "",
    thirdAttemptDate: "",
    failureReason: "" as const,
  };

  const trackingHistory: TrackingEvent[] = [];
  if (status !== "Pending") trackingHistory.push({ status: "Processing", location: "Warehouse", timestamp: addHours(dispatchDate, 2) });
  if (status !== "Pending" && status !== "Processing") trackingHistory.push({ status: "Packed", location: "Packing Center", timestamp: addHours(dispatchDate, 4) });
  if (["Ready for Dispatch", "Shipped", "In Transit", "Out for Delivery", "Delivered", "Returned"].includes(status)) {
    trackingHistory.push({ status: "Ready for Dispatch", location: LOCATIONS[i % LOCATIONS.length], timestamp: addHours(dispatchDate, 6) });
  }
  if (["Shipped", "In Transit", "Out for Delivery", "Delivered", "Returned"].includes(status)) {
    trackingHistory.push({ status: "Shipped", location: "In Transit Hub", timestamp: addDays(dispatchDate, 1) });
  }
  if (["In Transit", "Out for Delivery", "Delivered", "Returned"].includes(status)) {
    trackingHistory.push({ status: "In Transit", location: LOCATIONS[(i + 1) % LOCATIONS.length], timestamp: addDays(dispatchDate, 2) });
  }
  if (["Out for Delivery", "Delivered", "Returned"].includes(status)) {
    trackingHistory.push({ status: "Out for Delivery", location: "Local Delivery Station", timestamp: addDays(dispatchDate, 3) });
  }
  if (["Delivered", "Returned"].includes(status)) {
    trackingHistory.push({ status, location: order.address.city, timestamp: actualDelivery });
  }

  const shippingCharge = order.shippingCharges;
  const codCharge = order.paymentMethod === "Cash on Delivery" ? 50 : 0;
  const discountedShipping = Math.round(shippingCharge * 0.1);
  const finalCost = shippingCharge + codCharge - discountedShipping;

  return {
    id: `DEL${String(10000 + i).slice(-5)}`,
    orderId: order.id,
    trackingNumber: order.delivery.trackingNumber,
    status,
    shippingMethod: courier,
    dispatchDate,
    expectedDeliveryDate: expectedDelivery,
    actualDeliveryDate: actualDelivery,
    
    customer: {
      name: order.customer.name,
      mobile: order.customer.mobile,
      email: order.customer.email,
    },
    
    deliveryAddress: {
      fullName: order.address.fullName,
      mobile: order.address.mobile,
      line1: `${order.address.house}, ${order.address.street}`,
      line2: "",
      landmark: order.address.landmark,
      city: order.address.city,
      state: order.address.state,
      pincode: order.address.pincode,
      country: order.address.country,
    },
    
    product: {
      name: order.products[0].name,
      sku: order.products[0].sku,
      image: order.products[0].image,
      quantity: order.products[0].qty,
      packageWeight: `${0.5 + seededRand(i * 11) * 2.5}kg`,
    },
    
    deliveryPartner: {
      courierName: courier,
      executiveName: executive,
      executiveContact: `9${String(800000000 + i * 11111111).slice(0, 9)}`,
      vehicleNumber: `MH01AB${String(1000 + i).slice(-4)}`,
    },
    
    tracking: {
      currentLocation: LOCATIONS[i % LOCATIONS.length],
      lastUpdated: actualDelivery || addDays(dispatchDate, 2 + (i % 2)),
      trackingHistory,
    },
    
    deliveryAttempts: attempts,
    
    returnDelivery: status === "Returned" ? {
      requestId: `RET${String(5000 + i).slice(-4)}`,
      pickupStatus: ["Pending", "Picked Up", "In Transit", "Received"][i % 4] as any,
      pickupDate: addDays(actualDelivery, 1),
      returnReceivedDate: i % 3 === 0 ? addDays(actualDelivery, 5) : "",
      reason: ["Damaged", "Wrong Size", "Quality Issue", "Changed Mind"][i % 4],
      refundStatus: i % 3 === 0 ? "Completed" : i % 2 === 0 ? "Initiated" : "Pending",
    } : undefined,
    
    charges: {
      shippingCharge,
      codCharge,
      discountedShipping,
      finalShippingCost: finalCost,
    },
  };
});

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  "Pending":              "bg-slate-100 text-slate-700",
  "Processing":           "bg-blue-100 text-blue-700",
  "Packed":               "bg-orange-100 text-orange-700",
  "Ready for Dispatch":   "bg-purple-100 text-purple-700",
  "Shipped":              "bg-sky-100 text-sky-700",
  "In Transit":           "bg-indigo-100 text-indigo-700",
  "Out for Delivery":     "bg-cyan-100 text-cyan-700",
  "Delivered":            "bg-green-100 text-green-700",
  "Failed":               "bg-red-100 text-red-700",
  "Returned":             "bg-pink-100 text-pink-700",
  "Refunded":             "bg-gray-100 text-gray-600",
};
