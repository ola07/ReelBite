import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { COLORS } from "@/lib/constants";

type DiscoveryChip = {
  label: string;
  icon: string;
  active: boolean;
};

type DiscoverySectionProps = {
  title: string;
  chips: DiscoveryChip[];
  onToggle: (label: string) => void;
};

export default function DiscoverySection({
  title,
  chips,
  onToggle,
}: DiscoverySectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {chips.map((chip) => (
          <Pressable
            key={chip.label}
            onPress={() => onToggle(chip.label)}
            style={[styles.chip, chip.active && styles.chipActive]}
          >
            <Text style={styles.chipIcon}>{chip.icon}</Text>
            <Text style={[styles.chipLabel, chip.active && styles.chipLabelActive]}>
              {chip.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.darkSurface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: "rgba(16,185,129,0.15)",
    borderColor: COLORS.coral,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  chipLabelActive: {
    color: COLORS.coral,
  },
});
