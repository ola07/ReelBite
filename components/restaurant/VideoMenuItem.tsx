import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Play, Volume2, VolumeX } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/lib/constants";
import { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

type VideoMenuItemProps = {
  item: MenuItem;
  videoUrl?: string;
  onAddToCart?: () => void;
};

export default function VideoMenuItem({
  item,
  videoUrl,
  onAddToCart,
}: VideoMenuItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.card}>
      {/* Video Preview Area */}
      <Pressable
        style={styles.videoArea}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <LinearGradient
          colors={
            videoUrl
              ? [COLORS.coralDark, COLORS.coral, COLORS.amber]
              : [COLORS.darkElevated, COLORS.darkHover]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.videoGradient}
        >
          {videoUrl ? (
            <View style={styles.playButton}>
              <Play size={20} color={COLORS.white} fill={COLORS.white} />
            </View>
          ) : (
            <Text style={styles.noVideoText}>No video</Text>
          )}
        </LinearGradient>
        {videoUrl && (
          <View style={styles.videoBadge}>
            <Play size={8} color={COLORS.white} fill={COLORS.white} />
            <Text style={styles.videoBadgeText}>Video</Text>
          </View>
        )}
      </Pressable>

      {/* Item Info */}
      <View style={styles.infoArea}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {item.is_popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>

        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.footerRow}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>

          {item.tags.length > 0 && (
            <View style={styles.tags}>
              {item.tags.slice(0, 2).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {onAddToCart && (
          <Pressable style={styles.addButton} onPress={onAddToCart}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
  },
  videoArea: {
    width: 110,
    height: 130,
    position: "relative",
  },
  videoGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  noVideoText: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  videoBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  videoBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.white,
  },
  infoArea: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.coral,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.coral,
  },
  tags: {
    flexDirection: "row",
    gap: 4,
  },
  tag: {
    backgroundColor: COLORS.darkElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "500",
    color: COLORS.textTertiary,
    textTransform: "capitalize",
  },
  addButton: {
    backgroundColor: COLORS.coral,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
  },
});
