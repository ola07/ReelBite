import React, { useEffect } from "react";
import { View, StyleSheet, useWindowDimensions, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/lib/constants";

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 90 : 80;

function ShimmerBar({ width, height, borderRadius = 8, style }: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: "rgba(255,255,255,0.08)",
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/** Full-screen feed skeleton shown while videos load */
export function FeedSkeleton() {
  const { width, height } = useWindowDimensions();
  const cardHeight = height - TAB_BAR_HEIGHT;

  return (
    <View style={[styles.feedSkeleton, { width, height: cardHeight }]}>
      {/* Gradient background to simulate video area */}
      <LinearGradient
        colors={["#0A1A14", "#0D2818", "#0A1A14"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top: Logo + categories placeholder */}
      <View style={styles.feedSkeletonTop}>
        <ShimmerBar width={90} height={22} borderRadius={6} />
        <View style={styles.feedSkeletonCategories}>
          <ShimmerBar width={60} height={28} borderRadius={14} />
          <ShimmerBar width={70} height={28} borderRadius={14} />
          <ShimmerBar width={55} height={28} borderRadius={14} />
          <ShimmerBar width={75} height={28} borderRadius={14} />
        </View>
      </View>

      {/* Center: Play icon shimmer */}
      <View style={styles.feedSkeletonCenter}>
        <ShimmerBar width={64} height={64} borderRadius={32} />
      </View>

      {/* Right: Action bar */}
      <View style={styles.feedSkeletonActions}>
        <ShimmerBar width={40} height={40} borderRadius={20} />
        <ShimmerBar width={40} height={40} borderRadius={20} />
        <ShimmerBar width={40} height={40} borderRadius={20} />
        <ShimmerBar width={40} height={40} borderRadius={20} />
      </View>

      {/* Bottom: Video info overlay */}
      <View style={styles.feedSkeletonBottom}>
        <ShimmerBar width={120} height={14} borderRadius={4} />
        <ShimmerBar width={200} height={18} borderRadius={4} style={{ marginTop: 8 }} />
        <ShimmerBar width={width * 0.7} height={14} borderRadius={4} style={{ marginTop: 8 }} />
        <View style={styles.feedSkeletonTags}>
          <ShimmerBar width={70} height={24} borderRadius={12} />
          <ShimmerBar width={80} height={24} borderRadius={12} />
          <ShimmerBar width={60} height={24} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

/** Card skeleton for restaurant lists */
export function RestaurantCardSkeleton() {
  return (
    <View style={styles.restaurantSkeleton}>
      <ShimmerBar width={110} height={120} borderRadius={0} />
      <View style={styles.restaurantSkeletonInfo}>
        <ShimmerBar width={140} height={16} />
        <ShimmerBar width={100} height={12} style={{ marginTop: 8 }} />
        <ShimmerBar width={80} height={12} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  feedSkeleton: {
    position: "relative",
  },
  feedSkeletonTop: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  feedSkeletonCategories: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  feedSkeletonCenter: {
    position: "absolute",
    top: "45%",
    left: "50%",
    marginLeft: -32,
    marginTop: -32,
  },
  feedSkeletonActions: {
    position: "absolute",
    right: 12,
    bottom: 160,
    gap: 20,
    alignItems: "center",
  },
  feedSkeletonBottom: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 80,
  },
  feedSkeletonTags: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  restaurantSkeleton: {
    flexDirection: "row",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 12,
    height: 120,
  },
  restaurantSkeletonInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
});
