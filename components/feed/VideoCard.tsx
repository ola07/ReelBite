import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Heart } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import type { VideoWithDetails } from "@/types";
import VideoPlayer from "./VideoPlayer";
import VideoOverlay from "./VideoOverlay";
import VideoActions from "./VideoActions";

interface VideoCardProps {
  video: VideoWithDetails;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onBookmark?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
  onPressRestaurant?: (restaurantId: string) => void;
  onPressCreator?: (creatorId: string) => void;
}

export default function VideoCard({
  video,
  isActive,
  isMuted,
  onToggleMute,
  onLike,
  onComment,
  onBookmark,
  onShare,
  onPressRestaurant,
  onPressCreator,
}: VideoCardProps) {
  const lastTapRef = useRef<number>(0);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  const triggerLikeAnimation = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    heartScale.value = withSequence(
      withSpring(1.2, { damping: 6, stiffness: 300 }),
      withDelay(400, withTiming(0, { duration: 250 }))
    );
    heartOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withDelay(400, withTiming(0, { duration: 250 }))
    );
  }, [heartScale, heartOpacity]);

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      triggerLikeAnimation();
      onLike?.(video.id);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [video.id, onLike, triggerLikeAnimation]);

  const handleLike = useCallback(() => {
    onLike?.(video.id);
  }, [video.id, onLike]);

  const handleComment = useCallback(() => {
    onComment?.(video.id);
  }, [video.id, onComment]);

  const handleBookmark = useCallback(() => {
    onBookmark?.(video.id);
  }, [video.id, onBookmark]);

  const handleShare = useCallback(() => {
    onShare?.(video.id);
  }, [video.id, onShare]);

  const handlePressRestaurant = useCallback(
    (restaurantId: string) => {
      onPressRestaurant?.(restaurantId);
    },
    [onPressRestaurant]
  );

  const handlePressCreator = useCallback(
    (creatorId: string) => {
      onPressCreator?.(creatorId);
    },
    [onPressCreator]
  );

  return (
    <View style={styles.container}>
      {/* Double-tap overlay (captures taps, passes mute toggle down) */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleDoubleTap}>
        <VideoPlayer
          videoUrl={video.video_url}
          shouldPlay={isActive}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
        />
      </Pressable>

      {/* Bottom overlay with creator/restaurant info */}
      <VideoOverlay
        video={video}
        onPressRestaurant={handlePressRestaurant}
        onPressCreator={handlePressCreator}
      />

      {/* Right-side action bar */}
      <VideoActions
        video={video}
        onLike={handleLike}
        onComment={handleComment}
        onBookmark={handleBookmark}
        onShare={handleShare}
      />

      {/* Double-tap heart burst animation */}
      <Animated.View
        style={[styles.heartBurst, heartAnimatedStyle]}
        pointerEvents="none"
      >
        <Heart
          size={80}
          color={COLORS.coral}
          fill={COLORS.coral}
          strokeWidth={0}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  heartBurst: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -40,
    marginLeft: -40,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});
