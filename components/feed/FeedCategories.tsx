import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { COLORS } from "@/lib/constants";

export type FeedCategory = "for_you" | "trending" | "near_me" | "following";

const CATEGORIES: { key: FeedCategory; label: string }[] = [
  { key: "for_you", label: "For You" },
  { key: "trending", label: "Trending" },
  { key: "near_me", label: "Near Me" },
  { key: "following", label: "Following" },
];

type FeedCategoriesProps = {
  active: FeedCategory;
  onChange: (category: FeedCategory) => void;
};

export default function FeedCategories({
  active,
  onChange,
}: FeedCategoriesProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.key;
          return (
            <Pressable
              key={cat.key}
              onPress={() => onChange(cat.key)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 11,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  tabActive: {
    backgroundColor: COLORS.coral,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: "700",
  },
});
