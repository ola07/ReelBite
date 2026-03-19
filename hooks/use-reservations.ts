import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Reservation } from "@/types";
import { useAuthStore } from "@/stores/auth-store";

export function useReservations() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["reservations"],
    queryFn: async (): Promise<Reservation[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("user_id", user.id)
        .order("reservation_date", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Reservation[];
    },
    enabled: !!user,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (reservation: {
      restaurantId: string;
      date: string;
      time: string;
      partySize: number;
      specialRequests?: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("reservations")
        .insert({
          user_id: user.id,
          restaurant_id: reservation.restaurantId,
          reservation_date: reservation.date,
          reservation_time: reservation.time,
          party_size: reservation.partySize,
          status: "pending",
          special_requests: reservation.specialRequests ?? null,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}
