import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MenuCategory, MenuItem } from "@/types";

export function useMenuCategories(restaurantId: string) {
  return useQuery({
    queryKey: ["menu-categories", restaurantId],
    queryFn: async (): Promise<MenuCategory[]> => {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      return (data ?? []) as MenuCategory[];
    },
    enabled: !!restaurantId,
  });
}

export function useMenuItems(restaurantId: string) {
  return useQuery({
    queryKey: ["menu-items", restaurantId],
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("is_available", true)
        .order("sort_order");

      if (error) throw error;
      return (data ?? []) as MenuItem[];
    },
    enabled: !!restaurantId,
  });
}
