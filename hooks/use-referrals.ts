import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";

interface ReferralStats {
  totalEarnings: number;
  totalReferrals: number;
  orderCount: number;
  reservationCount: number;
  websiteClicks: number;
  callCount: number;
  directionCount: number;
}

interface RecentReferral {
  id: string;
  action: string;
  restaurant_name: string;
  created_at: string;
  metadata: Record<string, any>;
}

/** Fetch creator's referral stats for a given time period */
export function useCreatorReferralStats(periodDays?: number) {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["creator-referral-stats", user?.id, periodDays],
    queryFn: async (): Promise<ReferralStats> => {
      if (!user) return { totalEarnings: 0, totalReferrals: 0, orderCount: 0, reservationCount: 0, websiteClicks: 0, callCount: 0, directionCount: 0 };

      let query = (supabase as any)
        .from("referrals")
        .select("action, metadata, created_at")
        .eq("creator_id", user.id);

      if (periodDays) {
        const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte("created_at", since);
      }

      const { data, error } = await query;
      if (error) throw error;

      const referrals = (data ?? []) as any[];

      const stats: ReferralStats = {
        totalEarnings: 0,
        totalReferrals: referrals.length,
        orderCount: 0,
        reservationCount: 0,
        websiteClicks: 0,
        callCount: 0,
        directionCount: 0,
      };

      for (const ref of referrals) {
        switch (ref.action) {
          case "order":
            stats.orderCount++;
            // Commission from order total (stored in metadata)
            stats.totalEarnings += (ref.metadata?.total ?? 0) * 0.07; // 7% default commission
            break;
          case "reservation":
            stats.reservationCount++;
            stats.totalEarnings += 5; // flat $5 per reservation referral
            break;
          case "website":
            stats.websiteClicks++;
            break;
          case "call":
            stats.callCount++;
            break;
          case "direction":
            stats.directionCount++;
            break;
        }
      }

      return stats;
    },
    enabled: !!user,
  });
}

/** Fetch creator's recent referrals */
export function useCreatorRecentReferrals(limit = 10) {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["creator-recent-referrals", user?.id, limit],
    queryFn: async (): Promise<RecentReferral[]> => {
      if (!user) return [];

      const { data, error } = await (supabase as any)
        .from("referrals")
        .select(`
          id,
          action,
          metadata,
          created_at,
          restaurant:restaurants!referrals_restaurant_id_fkey(name)
        `)
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        // Fallback without join if FK name doesn't match
        const { data: fallback } = await (supabase as any)
          .from("referrals")
          .select("id, action, metadata, created_at, restaurant_id")
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        return (fallback ?? []).map((r: any) => ({
          ...r,
          restaurant_name: r.restaurant_id,
        }));
      }

      return (data ?? []).map((r: any) => ({
        ...r,
        restaurant_name: r.restaurant?.name ?? "Unknown",
      }));
    },
    enabled: !!user,
  });
}
