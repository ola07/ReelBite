import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/types";
import { getDistanceKm, UserLocation } from "./use-location";

export type RestaurantWithDistance = Restaurant & { distance_km?: number };

export function useRestaurants(filters?: {
  cuisine?: string;
  featured?: boolean;
  search?: string;
  location?: UserLocation | null;
  sortByDistance?: boolean;
}) {
  return useQuery({
    queryKey: ["restaurants", filters],
    queryFn: async (): Promise<RestaurantWithDistance[]> => {
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

      let restaurants = (data ?? []) as RestaurantWithDistance[];

      // Calculate distance from user and optionally sort by it
      if (filters?.location) {
        const { latitude, longitude } = filters.location;
        restaurants = restaurants.map((r) => ({
          ...r,
          distance_km: getDistanceKm(latitude, longitude, r.latitude, r.longitude),
        }));

        if (filters.sortByDistance) {
          restaurants.sort((a, b) => (a.distance_km ?? 0) - (b.distance_km ?? 0));
        }
      }

      return restaurants;
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
