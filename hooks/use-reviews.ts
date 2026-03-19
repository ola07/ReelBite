import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ReviewWithProfile } from "@/types";
import { useAuthStore } from "@/stores/auth-store";

export function useReviews(restaurantId: string) {
  return useQuery({
    queryKey: ["reviews", restaurantId],
    queryFn: async (): Promise<ReviewWithProfile[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profile:profiles!reviews_user_id_fkey(username, display_name, avatar_url)
        `)
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as ReviewWithProfile[];
    },
    enabled: !!restaurantId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (review: {
      restaurantId: string;
      rating: number;
      title?: string;
      body?: string;
      orderId?: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          user_id: user.id,
          restaurant_id: review.restaurantId,
          rating: review.rating,
          title: review.title ?? null,
          body: review.body ?? null,
          order_id: review.orderId ?? null,
          image_urls: [],
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
    },
  });
}
