import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

interface RatingStarsProps {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: number;
}

export default function RatingStars({
  rating,
  size = 16,
  showCount = false,
  count = 0,
}: RatingStarsProps) {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {Array.from({ length: filledStars }).map((_, i) => (
          <Star
            key={`filled-${i}`}
            size={size}
            color={COLORS.amber}
            fill={COLORS.amber}
          />
        ))}
        {hasHalfStar && (
          <View style={{ width: size, height: size, overflow: "hidden" }}>
            <View style={styles.halfStarContainer}>
              <View style={{ width: size / 2, overflow: "hidden" }}>
                <Star size={size} color={COLORS.amber} fill={COLORS.amber} />
              </View>
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              >
                <Star
                  size={size}
                  color={COLORS.amber}
                  fill="transparent"
                />
              </View>
            </View>
          </View>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            color={COLORS.textTertiary}
            fill="transparent"
          />
        ))}
      </View>
      {showCount && (
        <Text style={[styles.countText, { fontSize: size * 0.75 }]}>
          ({count})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  halfStarContainer: {
    position: "relative",
    flexDirection: "row",
  },
  countText: {
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
});
