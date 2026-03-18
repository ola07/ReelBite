import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { TrendingUp, Flame, Star, Clock } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { Restaurant } from "@/types";
import { formatCount } from "@/lib/utils";

type HighlightType = "hot_right_now" | "rising" | "most_reviewed" | "new_arrival";

type Highlight = {
  type: HighlightType;
  restaurant: Restaurant;
  reason: string;
};

const ICONS: Record<HighlightType, typeof Flame> = {
  hot_right_now: Flame,
  rising: TrendingUp,
  most_reviewed: Star,
  new_arrival: Clock,
};

const ICON_COLORS: Record<HighlightType, string> = {
  hot_right_now: COLORS.coral,
  rising: COLORS.amber,
  most_reviewed: COLORS.success,
  new_arrival: "#8B5CF6",
};

type LocalHighlightsProps = {
  highlights: Highlight[];
  onPress: (restaurant: Restaurant) => void;
};

export default function LocalHighlights({
  highlights,
  onPress,
}: LocalHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Flame size={18} color={COLORS.coral} />
        <Text style={styles.title}>Local Highlights</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {highlights.map((h, i) => {
          const Icon = ICONS[h.type];
          const color = ICON_COLORS[h.type];

          return (
            <Pressable
              key={`${h.restaurant.id}-${i}`}
              style={styles.card}
              onPress={() => onPress(h.restaurant)}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${color}20` }]}>
                <Icon size={16} color={color} />
              </View>
              <Text style={styles.restaurantName} numberOfLines={1}>
                {h.restaurant.name}
              </Text>
              <Text style={styles.reason} numberOfLines={2}>
                {h.reason}
              </Text>
              <View style={styles.statsRow}>
                <Star size={10} color={COLORS.amber} fill={COLORS.amber} />
                <Text style={styles.statsText}>
                  {h.restaurant.average_rating} ({formatCount(h.restaurant.total_reviews)})
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    width: 160,
    backgroundColor: COLORS.darkSurface,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  reason: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  statsText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "600",
  },
});
