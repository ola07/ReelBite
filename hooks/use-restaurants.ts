import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";

export function useRestaurants(filters?: {
  cuisine?: string;
  featured?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ["restaurants", filters],
    queryFn: async (): Promise<Restaurant[]> => {
      let query = supabase
        .from("restaurants")
        .select("*")
        .eq("is_active", true)
        .order("average_rating", { ascending: false });

      if (filters?.cuisine) {
        query = query.contains("cuisine_type", [filters.cuisine]);
      }

      if (filters?.featured) {
        query = query.eq("is_featured", true);
      }

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Restaurant[];
    },
  });
}

export function useRestaurant(slug: string) {
  return useQuery({
    queryKey: ["restaurant", slug],
    queryFn: async (): Promise<Restaurant | null> => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Restaurant;
    },
    enabled: !!slug,
  });
}
