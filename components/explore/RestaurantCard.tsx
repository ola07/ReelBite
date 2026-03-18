import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { Restaurant } from "@/types";
import RatingStars from "@/components/shared/RatingStars";
import PriceLevel from "@/components/shared/PriceLevel";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RestaurantCard({
  restaurant,
  onPress,
  compact = false,
}: RestaurantCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  if (compact) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.compactCard, animatedStyle]}
      >
        <LinearGradient
          colors={[COLORS.coral, COLORS.amber]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.compactImage}
        >
          <Text style={styles.compactImageText}>
            {restaurant.name.charAt(0)}
          </Text>
        </LinearGradient>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.compactRating}>
            <RatingStars rating={restaurant.average_rating} size={12} />
          </View>
          <Text style={styles.compactCuisine} numberOfLines={1}>
            {restaurant.cuisine_type.join(" \u00B7 ")}
          </Text>
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle]}
    >
      <LinearGradient
        colors={[COLORS.coralDark, COLORS.coral, COLORS.amber]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.imagePlaceholder}
      >
        <Text style={styles.imagePlaceholderText}>
          {restaurant.name.charAt(0)}
        </Text>
      </LinearGradient>

      <View style={styles.info}>
        <View style={styles.infoTop}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <PriceLevel level={restaurant.price_level as 1 | 2 | 3 | 4} size={12} />
          </View>

          <View style={styles.cuisineTags}>
            {restaurant.cuisine_type.map((cuisine) => (
              <View key={cuisine} style={styles.cuisineBadge}>
                <Text style={styles.cuisineBadgeText}>{cuisine}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoBottom}>
          <RatingStars
            rating={restaurant.average_rating}
            size={14}
            showCount
            count={restaurant.total_reviews}
          />
          <View style={styles.distanceRow}>
            <MapPin size={14} color={COLORS.textSecondary} />
            <Text style={styles.distanceText}>0.5 km</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: 110,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    fontSize: 36,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  infoTop: {
    gap: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    flex: 1,
  },
  cuisineTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  cuisineBadge: {
    backgroundColor: COLORS.darkElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cuisineBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  infoBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  // Compact card styles for trending horizontal scroll
  compactCard: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 14,
    overflow: "hidden",
    width: 150,
    marginRight: 12,
  },
  compactImage: {
    width: 150,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  compactImageText: {
    fontSize: 32,
    fontWeight: "800",
    color: "rgba(255,255,255,0.35)",
  },
  compactInfo: {
    padding: 10,
    gap: 4,
  },
  compactName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  compactRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactCuisine: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
