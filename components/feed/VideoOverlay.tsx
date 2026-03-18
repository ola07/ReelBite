import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BadgeCheck } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import type { VideoWithDetails } from "@/types";

interface VideoOverlayProps {
  video: VideoWithDetails;
  onPressRestaurant: (restaurantId: string) => void;
  onPressCreator: (creatorId: string) => void;
}

function CreatorAvatar({
  displayName,
  avatarUrl,
}: {
  displayName: string | null;
  avatarUrl: string | null;
}) {
  const letter = (displayName ?? "?").charAt(0).toUpperCase();

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{letter}</Text>
    </View>
  );
}

export default function VideoOverlay({
  video,
  onPressRestaurant,
  onPressCreator,
}: VideoOverlayProps) {
  const { creator, restaurant, dish_name, description } = video;

  const truncatedDescription =
    description && description.length > 100
      ? description.slice(0, 100) + "..."
      : description;

  return (
    <LinearGradient
      colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
      locations={[0, 0.4, 1]}
      style={styles.gradient}
    >
      <View style={styles.content}>
        {/* Creator row */}
        <Pressable
          style={styles.creatorRow}
          onPress={() => onPressCreator(creator.id)}
        >
          <CreatorAvatar
            displayName={creator.display_name}
            avatarUrl={creator.avatar_url}
          />
          <View style={styles.creatorInfo}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>@{creator.username}</Text>
              {creator.is_verified && (
                <BadgeCheck
                  size={14}
                  color={COLORS.coral}
                  fill={COLORS.coral}
                  strokeWidth={0}
                  style={styles.verifiedIcon}
                />
              )}
            </View>
          </View>
        </Pressable>

        {/* Restaurant name */}
        {restaurant && (
          <Pressable
            onPress={() => onPressRestaurant(restaurant.id)}
            style={styles.restaurantPressable}
          >
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
          </Pressable>
        )}

        {/* Dish name */}
        {dish_name && <Text style={styles.dishName}>{dish_name}</Text>}

        {/* Description */}
        {truncatedDescription && (
          <Text style={styles.description}>{truncatedDescription}</Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 80,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  content: {
    paddingRight: 64,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.coral,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  creatorInfo: {
    marginLeft: 10,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  restaurantPressable: {
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  restaurantName: {
    color: COLORS.coral,
    fontSize: 13,
    fontWeight: "600",
  },
  dishName: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
