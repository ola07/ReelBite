import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { OrderWithItems } from "@/types";
import { useAuthStore } from "@/stores/auth-store";

interface OrderItem {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: { name: string; option: string; priceDelta: number }[];
  specialInstructions?: string;
}

interface PlaceOrderParams {
  restaurantId: string;
  orderType: "delivery" | "pickup";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  deliveryAddress?: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  specialInstructions?: string;
}

export function useOrders(status?: "active" | "past") {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["orders", status],
    queryFn: async (): Promise<OrderWithItems[]> => {
      if (!user) return [];

      let query = supabase
        .from("orders")
        .select(`
          *,
          restaurant:restaurants!orders_restaurant_id_fkey(name, slug, cover_image_url),
          items:order_items(
            *,
            menu_item:menu_items!order_items_menu_item_id_fkey(name, image_url)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (status === "active") {
        query = query.in("status", ["placed", "confirmed", "preparing", "ready", "out_for_delivery"]);
      } else if (status === "past") {
        query = query.in("status", ["delivered", "picked_up", "cancelled"]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as OrderWithItems[];
    },
    enabled: !!user,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (orderData: PlaceOrderParams) => {
      if (!user) throw new Error("Must be logged in");

      // Client-side sanity bounds (server trigger enforces the real validation)
      if (orderData.items.length === 0) throw new Error("Order must contain at least one item");
      if (orderData.subtotal < 0) throw new Error("Invalid subtotal");
      if (orderData.tip < 0 || orderData.tip > orderData.subtotal * 0.5) {
        throw new Error("Tip must be between 0 and 50% of the subtotal");
      }
      if (orderData.deliveryFee < 0) throw new Error("Invalid delivery fee");

      for (const item of orderData.items) {
        if (item.quantity < 1 || item.quantity > 99) throw new Error("Invalid item quantity");
        if (item.unitPrice < 0) throw new Error("Invalid item price");
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          restaurant_id: orderData.restaurantId,
          order_type: orderData.orderType,
          status: "placed",
          subtotal: orderData.subtotal,
          tax: orderData.tax,
          delivery_fee: orderData.deliveryFee,
          tip: orderData.tip,
          total: orderData.total,
          delivery_address: orderData.deliveryAddress ?? null,
          estimated_ready_at: null,
          special_instructions: orderData.specialInstructions ?? null,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        customizations: item.customizations ?? {},
        special_instructions: item.specialInstructions ?? null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
