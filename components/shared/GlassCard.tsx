import React from "react";
import { View, StyleSheet, type ViewStyle, type StyleProp } from "react-native";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export default function GlassCard({ children, className, style }: GlassCardProps) {
  return (
    <View className={className} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
});
