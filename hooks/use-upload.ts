import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
const ALLOWED_MIME_TYPES = ["video/mp4", "video/quicktime", "video/x-m4v"];
const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".m4v"];
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;

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

      // Validate title
      const title = params.title.trim();
      if (!title) throw new Error("Title is required");
      if (title.length > MAX_TITLE_LENGTH) {
        throw new Error(`Title must be ${MAX_TITLE_LENGTH} characters or fewer`);
      }

      // Validate description
      if (params.description && params.description.length > MAX_DESCRIPTION_LENGTH) {
        throw new Error(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`);
      }

      // Validate file extension
      const uriLower = params.uri.toLowerCase();
      const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => uriLower.endsWith(ext));
      if (!hasValidExtension) {
        throw new Error("Only MP4, MOV, and M4V video files are supported");
      }

      // Fetch blob and validate size + MIME type
      const response = await fetch(params.uri);
      const blob = await response.blob();

      if (blob.size > MAX_FILE_SIZE_BYTES) {
        throw new Error("Video must be 100 MB or smaller");
      }

      const mimeType = blob.type || "video/mp4";
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        throw new Error("Only MP4, MOV, and M4V video files are supported");
      }

      // Validate cuisine tags against whitelist
      const { CUISINES } = await import("@/lib/constants");
      const validCuisines = new Set<string>(CUISINES);
      const cuisineTags = (params.cuisineTags ?? []).filter((tag) => validCuisines.has(tag));

      const fileName = `${user.id}/${Date.now()}.mp4`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, blob, {
          contentType: "video/mp4",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(uploadData.path);

      const { data, error } = await supabase
        .from("videos")
        .insert({
          creator_id: user.id,
          restaurant_id: params.restaurantId || null,
          title,
          description: params.description?.trim() || null,
          video_url: urlData.publicUrl,
          thumbnail_url: null,
          duration_seconds: null,
          tags: cuisineTags,
        })
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
