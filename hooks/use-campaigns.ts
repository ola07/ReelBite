import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";

export interface Campaign {
  id: string;
  restaurant_id: string;
  type: "deal" | "contest";
  title: string;
  description: string | null;
  brief_url: string | null;
  budget: number;
  currency: string;
  status: string;
  requirements: any;
  target_regions: string[];
  max_submissions: number | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  restaurant?: { id: string; name: string; slug: string; cuisine_type: string[] };
  submission_count?: number;
}

export interface Submission {
  id: string;
  campaign_id: string;
  creator_id: string;
  video_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  proposed_bid: number | null;
  status: string;
  feedback: string | null;
  views_count: number;
  engagement_score: number;
  created_at: string;
  creator?: { username: string; display_name: string | null; avatar_url: string | null };
  campaign?: Campaign;
}

/** Fetch active campaigns for creators to browse */
export function useCampaigns(filters?: { type?: "deal" | "contest" }) {
  return useQuery({
    queryKey: ["campaigns", filters],
    queryFn: async (): Promise<Campaign[]> => {
      let query = (supabase as any)
        .from("campaigns")
        .select(`
          *,
          restaurant:restaurants(id, name, slug, cuisine_type)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (filters?.type) {
        query = query.eq("type", filters.type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Campaign[];
    },
  });
}

/** Fetch a single campaign by ID */
export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: async (): Promise<Campaign | null> => {
      const { data, error } = await (supabase as any)
        .from("campaigns")
        .select(`
          *,
          restaurant:restaurants(id, name, slug, cuisine_type)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Campaign;
    },
    enabled: !!id,
  });
}

/** Fetch campaigns owned by the current restaurant owner */
export function useMyRestaurantCampaigns(restaurantId?: string) {
  return useQuery({
    queryKey: ["my-campaigns", restaurantId],
    queryFn: async (): Promise<Campaign[]> => {
      if (!restaurantId) return [];
      const { data, error } = await (supabase as any)
        .from("campaigns")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Campaign[];
    },
    enabled: !!restaurantId,
  });
}

/** Create a new campaign */
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaign: Partial<Campaign>) => {
      const { data, error } = await (supabase as any)
        .from("campaigns")
        .insert(campaign)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["my-campaigns"] });
    },
  });
}

/** Fetch submissions for a campaign */
export function useCampaignSubmissions(campaignId: string) {
  return useQuery({
    queryKey: ["submissions", campaignId],
    queryFn: async (): Promise<Submission[]> => {
      const { data, error } = await (supabase as any)
        .from("submissions")
        .select(`
          *,
          creator:profiles(username, display_name, avatar_url)
        `)
        .eq("campaign_id", campaignId)
        .order("engagement_score", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Submission[];
    },
    enabled: !!campaignId,
  });
}

/** Fetch creator's own submissions */
export function useMySubmissions() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["my-submissions", user?.id],
    queryFn: async (): Promise<Submission[]> => {
      if (!user) return [];
      const { data, error } = await (supabase as any)
        .from("submissions")
        .select(`
          *,
          campaign:campaigns(id, title, type, budget, status, deadline, restaurant:restaurants(name))
        `)
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Submission[];
    },
    enabled: !!user,
  });
}

/** Submit to a campaign */
export function useSubmitToCampaign() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (submission: {
      campaignId: string;
      videoUrl: string;
      caption?: string;
      proposedBid?: number;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await (supabase as any)
        .from("submissions")
        .insert({
          campaign_id: submission.campaignId,
          creator_id: user.id,
          video_url: submission.videoUrl,
          caption: submission.caption || null,
          proposed_bid: submission.proposedBid || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["submissions", vars.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });
}

/** Update submission status (restaurant owner action) */
export function useUpdateSubmissionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      submissionId: string;
      status: string;
      feedback?: string;
    }) => {
      const { error } = await (supabase as any)
        .from("submissions")
        .update({
          status: params.status,
          feedback: params.feedback || null,
        })
        .eq("id", params.submissionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}

/** Fetch creator's payouts */
export function useCreatorPayouts() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["payouts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await (supabase as any)
        .from("payouts")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}
