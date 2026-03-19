import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CreatorWithProfile, VideoWithDetails } from "@/types";
import { useAuthStore } from "@/stores/auth-store";

export function useCreator(username: string) {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["creator", username],
    queryFn: async (): Promise<CreatorWithProfile | null> => {
      // Get profile by username
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError || !profile) return null;
      const p = profile as any;

      // Get creator data
      const { data: creator, error: creatorError } = await supabase
        .from("creators")
        .select("*")
        .eq("id", p.id)
        .single();

      if (creatorError || !creator) return null;

      // Check if current user follows
      let is_following = false;
      if (user) {
        const { data: follow } = await supabase
          .from("follows")
          .select("follower_id")
          .eq("follower_id", user.id)
          .eq("following_id", p.id)
          .maybeSingle();

        is_following = !!follow;
      }

      return {
        ...(creator as any),
        profile: {
          username: p.username,
          display_name: p.display_name,
          avatar_url: p.avatar_url,
        },
        is_following,
      } as CreatorWithProfile;
    },
    enabled: !!username,
  });
}

export function useCreatorVideos(creatorId: string) {
  return useQuery({
    queryKey: ["creator-videos", creatorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select(`
          *,
          creator:profiles!videos_creator_id_fkey(id, username, display_name, avatar_url),
          restaurant:restaurants!videos_restaurant_id_fkey(id, name, slug, cuisine_type)
        `)
        .eq("creator_id", creatorId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((v: any) => ({
        ...v,
        creator: { ...v.creator, is_verified: false },
        is_liked: false,
        is_bookmarked: false,
      })) as VideoWithDetails[];
    },
    enabled: !!creatorId,
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({ creatorId, isFollowing }: { creatorId: string; isFollowing: boolean }) => {
      if (!user) throw new Error("Must be logged in");

      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", creatorId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: user.id, following_id: creatorId } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}
