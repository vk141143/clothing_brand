import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Saree } from "./data";

export type CartItem = { id: string; qty: number; saree: Saree };

type CartState = {
  items: CartItem[];
  add: (s: Saree, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  subtotal: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (s, qty = 1) =>
        set((st) => {
          const existing = st.items.find((i) => i.id === s.id);
          if (existing) {
            return { items: st.items.map((i) => (i.id === s.id ? { ...i, qty: i.qty + qty } : i)) };
          }
          return { items: [...st.items, { id: s.id, qty, saree: s }] };
        }),
      remove: (id) => set((st) => ({ items: st.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((st) => ({
          items: st.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((s, i) => s + i.saree.price * i.qty, 0),
      total: () => {
        const sub = get().subtotal();
        const shipping = sub > 2000 ? 0 : 99;
        return sub + shipping;
      },
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: "cms-cart" }
  )
);

type WishState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
};

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((st) => ({
          ids: st.ids.includes(id) ? st.ids.filter((x) => x !== id) : [...st.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      remove: (id) => set((st) => ({ ids: st.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: "cms-wishlist" }
  )
);

type AuthState = {
  user: { name: string; email: string; isAdmin?: boolean } | null;
  login: (email: string, name?: string, isAdmin?: boolean) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, name, isAdmin = false) => set({ user: { email, name: name || email.split("@")[0], isAdmin } }),
      logout: () => set({ user: null }),
    }),
    { name: "cms-auth" }
  )
);

type ThemeState = { theme: "light" | "dark"; toggle: () => void; set: (t: "light" | "dark") => void };
export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggle: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      set: (theme) => set({ theme }),
    }),
    { name: "cms-theme" }
  )
);

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
