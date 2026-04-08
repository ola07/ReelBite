import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { WifiOff, RefreshCw } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <WifiOff size={40} color={COLORS.textTertiary} />
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>
        Check your connection and try again
      </Text>
      {onRetry && (
        <Pressable style={styles.retryBtn} onPress={onRetry}>
          <RefreshCw size={16} color={COLORS.white} />
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.coral,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
});
