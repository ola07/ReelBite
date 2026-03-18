import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Icon size={48} color={COLORS.textTertiary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconWrapper: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
