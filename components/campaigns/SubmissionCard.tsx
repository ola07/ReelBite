import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Eye, TrendingUp, Clock } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { getStatusColor } from "@/lib/campaign-utils";
import { formatCount, formatRelativeTime } from "@/lib/utils";
import type { Submission } from "@/hooks/use-campaigns";

interface SubmissionCardProps {
  submission: Submission;
  onPress?: () => void;
  showCreator?: boolean;
}

export default function SubmissionCard({ submission, onPress, showCreator = true }: SubmissionCardProps) {
  const statusColor = getStatusColor(submission.status);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Video Thumbnail */}
      <LinearGradient
        colors={[COLORS.coralDark, COLORS.coral]}
        style={styles.thumbnail}
      >
        <Text style={styles.thumbnailText}>
          {submission.caption?.charAt(0)?.toUpperCase() ?? "V"}
        </Text>
      </LinearGradient>

      <View style={styles.info}>
        {/* Creator Name */}
        {showCreator && (
          <Text style={styles.creator} numberOfLines={1}>
            @{submission.creator?.username ?? "creator"}
          </Text>
        )}

        {/* Caption */}
        {submission.caption && (
          <Text style={styles.caption} numberOfLines={2}>
            {submission.caption}
          </Text>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Eye size={12} color={COLORS.textTertiary} />
            <Text style={styles.statText}>{formatCount(submission.views_count)}</Text>
          </View>
          <View style={styles.stat}>
            <TrendingUp size={12} color={COLORS.textTertiary} />
            <Text style={styles.statText}>{submission.engagement_score.toFixed(1)}</Text>
          </View>
          {submission.proposed_bid && (
            <Text style={styles.bidText}>${submission.proposed_bid}</Text>
          )}
        </View>
      </View>

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {submission.status.replace("_", " ")}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailText: {
    fontSize: 20,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  creator: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.coral,
  },
  caption: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  bidText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.coral,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
