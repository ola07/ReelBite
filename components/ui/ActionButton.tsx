import React from "react";
import { Text, StyleSheet, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import { COLORS } from "@/lib/constants";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

type ButtonVariant = "coral" | "outline";

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
}

export default function ActionButton({
  title,
  onPress,
  variant = "coral",
  loading = false,
  disabled = false,
  icon: Icon,
}: ActionButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const isDisabled = disabled || loading;
  const isCoral = variant === "coral";

  const buttonStyle: ViewStyle = {
    ...styles.button,
    backgroundColor: isCoral ? COLORS.coral : "transparent",
    borderWidth: isCoral ? 0 : 1.5,
    borderColor: isCoral ? undefined : COLORS.coral,
    opacity: isDisabled ? 0.5 : 1,
  };

  const textColor = isCoral ? COLORS.white : COLORS.coral;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={buttonStyle}
      >
        {loading ? (
          <LoadingSpinner
            size={20}
            color={isCoral ? COLORS.white : COLORS.coral}
          />
        ) : (
          <>
            {Icon && (
              <Icon
                size={18}
                color={textColor}
                style={styles.icon}
              />
            )}
            <Text style={[styles.title, { color: textColor }]}>
              {title}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 48,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
});
