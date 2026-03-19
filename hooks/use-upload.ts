import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";

interface UploadVideoParams {
  uri: string;
  title: string;
  description?: string;
  restaurantId?: string;
  cuisineTags?: string[];
}

export function useUploadVideo() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (params: UploadVideoParams) => {
      if (!user) throw new Error("Must be logged in");

      // Read the file and upload to storage
      const fileName = `${user.id}/${Date.now()}.mp4`;
      const response = await fetch(params.uri);
      const blob = await response.blob();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, blob, {
          contentType: "video/mp4",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(uploadData.path);

      // Insert video record
      const { data, error } = await supabase
        .from("videos")
        .insert({
          creator_id: user.id,
          restaurant_id: params.restaurantId || null,
          title: params.title,
          description: params.description || null,
          video_url: urlData.publicUrl,
          thumbnail_url: null,
          duration: 0,
          cuisine_tags: params.cuisineTags || [],
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}
