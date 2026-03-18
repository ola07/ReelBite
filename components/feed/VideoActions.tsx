import React, { useCallback } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { formatCount } from "@/lib/utils";
import type { VideoWithDetails } from "@/types";

interface VideoActionsProps {
  video: VideoWithDetails;
  onLike: () => void;
  onComment: () => void;
  onBookmark: () => void;
  onShare: () => void;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  count: number;
  onPress: () => void;
}

function ActionButton({ icon, count, onPress }: ActionButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSpring(0.75, { damping: 4, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 6, stiffness: 200 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress, scale]);

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.actionButton, animatedStyle]}>
        {icon}
        <Text style={styles.actionCount}>{formatCount(count)}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function VideoActions({
  video,
  onLike,
  onComment,
  onBookmark,
  onShare,
}: VideoActionsProps) {
  return (
    <View style={styles.container}>
      <ActionButton
        icon={
          <Heart
            size={28}
            color={video.is_liked ? COLORS.coral : COLORS.white}
            fill={video.is_liked ? COLORS.coral : "transparent"}
            strokeWidth={video.is_liked ? 0 : 2}
          />
        }
        count={video.like_count}
        onPress={onLike}
      />

      <ActionButton
        icon={
          <MessageCircle size={28} color={COLORS.white} strokeWidth={2} />
        }
        count={video.comment_count}
        onPress={onComment}
      />

      <ActionButton
        icon={
          <Bookmark
            size={28}
            color={video.is_bookmarked ? COLORS.amber : COLORS.white}
            fill={video.is_bookmarked ? COLORS.amber : "transparent"}
            strokeWidth={video.is_bookmarked ? 0 : 2}
          />
        }
        count={video.bookmark_count}
        onPress={onBookmark}
      />

      <ActionButton
        icon={<Share2 size={28} color={COLORS.white} strokeWidth={2} />}
        count={video.share_count}
        onPress={onShare}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 8,
    bottom: 120,
    alignItems: "center",
    gap: 18,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionCount: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
