import { ORDERS } from "./orders-data";

export type MembershipLevel = "Bronze" | "Silver" | "Gold" | "Platinum";
export type CustomerStatus = "Active" | "Inactive" | "VIP" | "Blocked";
export type TicketStatus = "Open" | "Resolved";

export type CustomerAddress = {
  type: "Home" | "Office";
  fullName: string;
  house: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
};

export type SupportTicket = {
  id: string;
  subject: string;
  status: TicketStatus;
  date: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  gender: "Female" | "Male" | "Other";
  dob: string;
  registrationDate: string;
  lastLogin: string;
  loginCount: number;
  status: CustomerStatus;
  membership: MembershipLevel;
  emailVerified: boolean;
  mobileVerified: boolean;
  avatar: string;
  username: string;
  addresses: CustomerAddress[];
  rewardPoints: number;
  couponsUsed: number;
  availableCoupons: number;
  wishlistCount: number;
  cartAbandonments: number;
  favoriteCategory: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  tickets: SupportTicket[];
  reviewsGiven: number;
  internalNotes: string;
  preferredCategories: string[];
};

const NAMES = [
  "Priya Sharma", "Anjali Verma", "Meera Iyer", "Kavita Reddy",
  "Divya Pillai", "Sunita Bose", "Rekha Nair", "Lakshmi Das",
  "Nisha Gupta", "Pooja Mehta", "Sonal Joshi", "Rani Desai",
  "Usha Pandey", "Geeta Rao", "Archana Singh",
];

const CATEGORIES = ["Silk", "Banarasi", "Kanjivaram", "Cotton", "Designer", "Bridal", "Georgette", "Handloom"];
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur"];
const STATES = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal", "Maharashtra", "Rajasthan"];
const MEMBERSHIPS: MembershipLevel[] = ["Bronze", "Silver", "Gold", "Platinum"];
const STATUSES: CustomerStatus[] = ["Active", "Active", "Active", "VIP", "Inactive", "Blocked"];

function seeded(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}
function addDays(iso: string, days: number) {
  const d = new Date(iso); d.setDate(d.getDate() + days); return d.toISOString();
}
function makeDate(daysAgo: number, seed: number) {
  const d = new Date(); d.setDate(d.getDate() - daysAgo);
  d.setHours(Math.floor(seeded(seed) * 23)); return d.toISOString();
}

export const CUSTOMERS: Customer[] = Array.from({ length: 15 }, (_, i) => {
  const name = NAMES[i];
  const ci = i % CITIES.length;
  const totalOrders = Math.floor(2 + seeded(i * 3) * 18);
  const completed = Math.floor(totalOrders * 0.75);
  const cancelled = Math.floor(totalOrders * 0.1);
  const returned = totalOrders - completed - cancelled;
  const spent = Math.round(3000 + seeded(i * 7) * 80000);
  const regDate = makeDate(180 + i * 10, i);
  const lastOrder = addDays(regDate, Math.floor(seeded(i * 11) * 150));

  return {
    id: `CUS${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${name.split(" ")[0].toLowerCase()}@example.com`,
    mobile: `9${String(800000000 + i * 13456789).slice(0, 9)}`,
    gender: "Female",
    dob: `${1985 + (i % 15)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    registrationDate: regDate,
    lastLogin: makeDate(i % 10, i * 2),
    loginCount: Math.floor(5 + seeded(i * 5) * 120),
    status: STATUSES[i % STATUSES.length],
    membership: MEMBERSHIPS[Math.floor(seeded(i * 4) * 4)],
    emailVerified: i % 5 !== 0,
    mobileVerified: i % 7 !== 0,
    avatar: `https://i.pravatar.cc/100?img=${40 + i}`,
    username: `${name.split(" ")[0].toLowerCase()}${i + 1}`,
    addresses: [
      {
        type: "Home",
        fullName: name,
        house: `${i + 1}A`,
        street: `MG Road`,
        city: CITIES[ci],
        state: STATES[ci],
        country: "India",
        pincode: `${400000 + i * 1000}`,
        isDefault: true,
      },
      {
        type: "Office",
        fullName: name,
        house: `Block ${i + 1}`,
        street: `IT Park Road`,
        city: CITIES[(ci + 1) % CITIES.length],
        state: STATES[(ci + 1) % STATES.length],
        country: "India",
        pincode: `${500000 + i * 1000}`,
        isDefault: false,
      },
    ],
    rewardPoints: Math.floor(seeded(i * 6) * 5000),
    couponsUsed: Math.floor(seeded(i * 8) * 10),
    availableCoupons: Math.floor(seeded(i * 9) * 5),
    wishlistCount: Math.floor(seeded(i * 10) * 15),
    cartAbandonments: Math.floor(seeded(i * 12) * 8),
    favoriteCategory: CATEGORIES[i % CATEGORIES.length],
    totalOrders,
    completedOrders: completed,
    cancelledOrders: cancelled,
    returnedOrders: Math.max(0, returned),
    totalSpent: spent,
    lastOrderDate: lastOrder,
    tickets: i % 3 === 0
      ? [{ id: `TKT${1000 + i}`, subject: "Wrong item received", status: "Open", date: makeDate(5 + i, i) }]
      : i % 4 === 0
        ? [{ id: `TKT${2000 + i}`, subject: "Refund not received", status: "Resolved", date: makeDate(20 + i, i) }]
        : [],
    reviewsGiven: Math.floor(seeded(i * 13) * 8),
    internalNotes: i % 6 === 0 ? "Prefers bridal collection, high AOV customer" : "",
    preferredCategories: [CATEGORIES[i % CATEGORIES.length], CATEGORIES[(i + 2) % CATEGORIES.length]],
  };
});

export const MEMBERSHIP_COLORS: Record<MembershipLevel, string> = {
  Bronze:   "bg-amber-100 text-amber-700",
  Silver:   "bg-gray-100 text-gray-600",
  Gold:     "bg-yellow-100 text-yellow-700",
  Platinum: "bg-purple-100 text-purple-700",
};

export const STATUS_COLORS: Record<CustomerStatus, string> = {
  Active:   "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
  VIP:      "bg-purple-100 text-purple-700",
  Blocked:  "bg-red-100 text-red-700",
};
