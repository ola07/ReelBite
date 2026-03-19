import React, { useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/lib/constants";
import { useToastStore } from "@/stores/toast-store";

const TOAST_COLORS = {
  success: COLORS.success,
  error: COLORS.error,
  info: "#3B82F6",
  warning: COLORS.warning,
} as const;

const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
} as const;

export default function Toast() {
  const { message, type, visible, hideToast } = useToastStore();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      const timeout = setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 300 }, () => {
          runOnJS(hideToast)();
        });
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      translateY.value = -100;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible && translateY.value === -100) return null;

  const Icon = TOAST_ICONS[type];
  const accentColor = TOAST_COLORS[type];

  return (
    <Animated.View
      style={[
        styles.container,
        { top: insets.top + 8 },
        { borderLeftColor: accentColor },
        animatedStyle,
      ]}
    >
      <Icon size={20} color={accentColor} strokeWidth={2} />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <Pressable onPress={hideToast} hitSlop={8}>
        <X size={16} color={COLORS.textSecondary} strokeWidth={2} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.darkElevated,
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
});
