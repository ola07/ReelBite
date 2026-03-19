import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Skeleton from "./Skeleton";
import { COLORS } from "@/lib/constants";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export function RestaurantCardSkeleton() {
  return (
    <View style={styles.restaurantCard}>
      <Skeleton width="100%" height={160} borderRadius={12} />
      <View style={styles.restaurantContent}>
        <Skeleton width="65%" height={18} borderRadius={6} />
        <View style={{ height: 8 }} />
        <Skeleton width="40%" height={14} borderRadius={6} />
        <View style={{ height: 8 }} />
        <Skeleton width="30%" height={12} borderRadius={6} />
      </View>
    </View>
  );
}

export function VideoCardSkeleton() {
  return (
    <View style={styles.videoCard}>
      {/* Action buttons on the right */}
      <View style={styles.videoActions}>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} width={44} height={44} borderRadius={22} style={{ marginBottom: 16 }} />
        ))}
      </View>
      {/* Caption area bottom-left */}
      <View style={styles.videoCaption}>
        <Skeleton width={120} height={16} borderRadius={6} />
        <View style={{ height: 8 }} />
        <Skeleton width={200} height={14} borderRadius={6} />
        <View style={{ height: 6 }} />
        <Skeleton width={160} height={14} borderRadius={6} />
      </View>
    </View>
  );
}

export function OrderCardSkeleton() {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderRow}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.orderText}>
          <Skeleton width="70%" height={16} borderRadius={6} />
          <View style={{ height: 6 }} />
          <Skeleton width="50%" height={13} borderRadius={6} />
        </View>
      </View>
      <View style={{ height: 12 }} />
      <Skeleton width={80} height={24} borderRadius={12} />
    </View>
  );
}

const styles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  restaurantContent: {
    padding: 14,
  },
  videoCard: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: COLORS.dark,
    justifyContent: "flex-end",
  },
  videoActions: {
    position: "absolute",
    right: 12,
    bottom: 160,
    alignItems: "center",
  },
  videoCaption: {
    padding: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderText: {
    flex: 1,
    marginLeft: 12,
  },
});
