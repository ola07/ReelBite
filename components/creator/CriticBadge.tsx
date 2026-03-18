import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Award, Star, Crown, Shield } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

export type CreatorTier = "rising" | "established" | "elite" | "critic";

const TIER_CONFIG: Record<
  CreatorTier,
  { label: string; color: string; bgColor: string; icon: typeof Award }
> = {
  rising: {
    label: "Rising Creator",
    color: "#8B5CF6",
    bgColor: "rgba(139,92,246,0.15)",
    icon: Star,
  },
  established: {
    label: "Established",
    color: COLORS.coral,
    bgColor: "rgba(16,185,129,0.15)",
    icon: Award,
  },
  elite: {
    label: "Elite Creator",
    color: COLORS.amber,
    bgColor: "rgba(245,158,11,0.15)",
    icon: Crown,
  },
  critic: {
    label: "Verified Critic",
    color: "#3B82F6",
    bgColor: "rgba(59,130,246,0.15)",
    icon: Shield,
  },
};

type CriticBadgeProps = {
  tier: CreatorTier;
  size?: "small" | "large";
};

export default function CriticBadge({ tier, size = "small" }: CriticBadgeProps) {
  const config = TIER_CONFIG[tier];
  const Icon = config.icon;
  const isLarge = size === "large";

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor }, isLarge && styles.badgeLarge]}>
      <Icon size={isLarge ? 14 : 10} color={config.color} />
      <Text style={[styles.label, { color: config.color }, isLarge && styles.labelLarge]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
  },
  labelLarge: {
    fontSize: 13,
  },
});
