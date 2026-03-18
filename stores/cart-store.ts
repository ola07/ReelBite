import { create } from "zustand";
import { CartItem } from "@/types";
import { generateId } from "@/lib/utils";

interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  orderType: "delivery" | "pickup";
  tip: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: "delivery" | "pickup") => void;
  setTip: (tip: number) => void;
  setRestaurant: (id: string, name: string) => void;
  subtotal: () => number;
  tax: () => number;
  deliveryFee: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  restaurantName: null,
  items: [],
  orderType: "pickup",
  tip: 0,

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, id: generateId() }],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) =>
              i.id === id
                ? { ...i, quantity, totalPrice: (i.totalPrice / i.quantity) * quantity }
                : i
            ),
    })),

  clearCart: () =>
    set({ items: [], restaurantId: null, restaurantName: null, tip: 0 }),

  setOrderType: (orderType) => set({ orderType }),
  setTip: (tip) => set({ tip }),
  setRestaurant: (id, name) => set({ restaurantId: id, restaurantName: name }),

  subtotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
  tax: () => get().subtotal() * 0.0875,
  deliveryFee: () => (get().orderType === "delivery" ? 4.99 : 0),
  total: () => get().subtotal() + get().tax() + get().deliveryFee() + get().tip,
  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
