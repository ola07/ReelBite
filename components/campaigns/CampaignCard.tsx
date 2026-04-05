import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Clock, Users, DollarSign, Briefcase, Trophy } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { formatDeadline, formatBudget, getCampaignTypeColor } from "@/lib/campaign-utils";
import type { Campaign } from "@/hooks/use-campaigns";

interface CampaignCardProps {
  campaign: Campaign;
  onPress: () => void;
}

export default function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  const typeColor = getCampaignTypeColor(campaign.type);
  const TypeIcon = campaign.type === "deal" ? Briefcase : Trophy;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Type Badge */}
      <View style={[styles.typeBadge, { backgroundColor: typeColor + "20" }]}>
        <TypeIcon size={14} color={typeColor} />
        <Text style={[styles.typeBadgeText, { color: typeColor }]}>
          {campaign.type === "deal" ? "Brand Deal" : "Contest"}
        </Text>
      </View>

      {/* Title & Restaurant */}
      <Text style={styles.title} numberOfLines={2}>{campaign.title}</Text>
      <Text style={styles.restaurant} numberOfLines={1}>
        {campaign.restaurant?.name ?? "Restaurant"}
      </Text>

      {/* Description */}
      {campaign.description && (
        <Text style={styles.description} numberOfLines={2}>
          {campaign.description}
        </Text>
      )}

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <DollarSign size={14} color={COLORS.coral} />
          <Text style={styles.statText}>
            {formatBudget(campaign.budget, campaign.type)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Clock size={14} color={COLORS.textSecondary} />
          <Text style={styles.statText}>
            {formatDeadline(campaign.deadline)}
          </Text>
        </View>
      </View>

      {/* Cuisine Tags */}
      {campaign.restaurant?.cuisine_type && (
        <View style={styles.tagsRow}>
          {campaign.restaurant.cuisine_type.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  restaurant: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.coral,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    backgroundColor: COLORS.darkElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textTertiary,
  },
});
