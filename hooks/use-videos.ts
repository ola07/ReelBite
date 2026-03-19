import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { VideoWithDetails } from "@/types";
import { useAuthStore } from "@/stores/auth-store";

const PAGE_SIZE = 10;

export function useVideos(filter: "for_you" | "trending" | "near_me" | "following" = "for_you") {
  const user = useAuthStore((s) => s.user);

  return useInfiniteQuery({
    queryKey: ["videos", filter],
    queryFn: async ({ pageParam = 0 }): Promise<VideoWithDetails[]> => {
      let query = supabase
        .from("videos")
        .select(`
          *,
          creator:profiles!videos_creator_id_fkey(id, username, display_name, avatar_url),
          restaurant:restaurants!videos_restaurant_id_fkey(id, name, slug, cuisine_type)
        `)
        .eq("is_active", true)
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      switch (filter) {
        case "trending":
          query = query.order("engagement_score", { ascending: false });
          break;
        case "following":
          if (user) {
            const { data: followedIds } = await supabase
              .from("follows")
              .select("following_id")
              .eq("follower_id", user.id);
            const ids = (followedIds as any[])?.map((f: any) => f.following_id) ?? [];
            if (ids.length > 0) {
              query = query.in("creator_id", ids);
            }
          }
          query = query.order("created_at", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Enrich with like/bookmark status for current user
      if (user && data) {
        const videoIds = data.map((v: any) => v.id);

        const [{ data: likes }, { data: bookmarks }] = await Promise.all([
          supabase.from("likes").select("video_id").eq("user_id", user.id).in("video_id", videoIds),
          supabase.from("bookmarks").select("video_id").eq("user_id", user.id).in("video_id", videoIds),
        ]);

        const likedSet = new Set((likes as any[])?.map((l: any) => l.video_id));
        const bookmarkedSet = new Set((bookmarks as any[])?.map((b: any) => b.video_id));

        return data.map((video: any) => ({
          ...video,
          creator: {
            ...video.creator,
            is_verified: false,
          },
          is_liked: likedSet.has(video.id),
          is_bookmarked: bookmarkedSet.has(video.id),
        })) as VideoWithDetails[];
      }

      return (data ?? []).map((video: any) => ({
        ...video,
        creator: { ...video.creator, is_verified: false },
        is_liked: false,
        is_bookmarked: false,
      })) as VideoWithDetails[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({ videoId, isLiked }: { videoId: string; isLiked: boolean }) => {
      if (!user) throw new Error("Must be logged in");

      if (isLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", videoId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: user.id, video_id: videoId } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async ({ videoId, isBookmarked }: { videoId: string; isBookmarked: boolean }) => {
      if (!user) throw new Error("Must be logged in");

      if (isBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", videoId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, video_id: videoId } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}
