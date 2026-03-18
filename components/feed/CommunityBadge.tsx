import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TrendingUp, Users, MapPin } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

type BadgeType = "trending" | "local_favorite" | "community_pick";

const BADGE_CONFIG: Record<BadgeType, { label: string; color: string; icon: typeof TrendingUp }> = {
  trending: { label: "Trending", color: COLORS.coral, icon: TrendingUp },
  local_favorite: { label: "Local Favorite", color: COLORS.success, icon: MapPin },
  community_pick: { label: "Community Pick", color: COLORS.amber, icon: Users },
};

type CommunityBadgeProps = {
  type: BadgeType;
};

export default function CommunityBadge({ type }: CommunityBadgeProps) {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;

  return (
    <View style={[styles.badge, { backgroundColor: `${config.color}20` }]}>
      <Icon size={12} color={config.color} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
});
