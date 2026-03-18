import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Star, ChevronDown, ChevronUp, Quote } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

type ReviewCardProps = {
  rating: number;
  title: string;
  body: string;
  authorName: string;
  date: string;
};

export default function ReviewCard({
  rating,
  title,
  body,
  authorName,
  date,
}: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = body.length > 120;
  const displayBody = expanded || !isLong ? body : body.slice(0, 120) + "...";

  return (
    <View style={styles.card}>
      {/* Quote Icon */}
      <View style={styles.quoteIcon}>
        <Quote size={14} color={COLORS.amber} />
      </View>

      {/* Rating Stars */}
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            color={COLORS.amber}
            fill={i < rating ? COLORS.amber : "transparent"}
          />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Body */}
      <Text style={styles.body}>{displayBody}</Text>

      {/* Expand/Collapse */}
      {isLong && (
        <Pressable
          onPress={() => setExpanded(!expanded)}
          style={styles.expandBtn}
        >
          <Text style={styles.expandText}>
            {expanded ? "Show less" : "Read more"}
          </Text>
          {expanded ? (
            <ChevronUp size={14} color={COLORS.coral} />
          ) : (
            <ChevronDown size={14} color={COLORS.coral} />
          )}
        </Pressable>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.author}>{authorName}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(15,26,21,0.85)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.12)",
    maxWidth: 280,
  },
  quoteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    opacity: 0.5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.amber,
    marginLeft: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  body: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  expandBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 4,
  },
  expandText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.coral,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  author: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.white,
  },
  date: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
});
