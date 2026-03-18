import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/lib/constants";

type BadgeVariant = "coral" | "amber" | "gray" | "success";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<
  BadgeVariant,
  { backgroundColor: string; textColor: string }
> = {
  coral: {
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    textColor: COLORS.coral,
  },
  amber: {
    backgroundColor: "rgba(255, 170, 64, 0.15)",
    textColor: COLORS.amber,
  },
  gray: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    textColor: COLORS.textSecondary,
  },
  success: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    textColor: COLORS.success,
  },
};

export default function Badge({ label, variant = "coral" }: BadgeProps) {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: variantStyle.backgroundColor },
      ]}
    >
      <Text style={[styles.label, { color: variantStyle.textColor }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
