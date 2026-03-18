import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { Search, X } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search restaurants, cuisines...",
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const focusProgress = useSharedValue(0);

  const handleFocus = () => {
    focusProgress.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    focusProgress.value = withTiming(0, { duration: 200 });
  };

  const handleClear = () => {
    onChangeText("");
    inputRef.current?.focus();
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [COLORS.darkElevated, COLORS.darkHover]
    );
    return { backgroundColor };
  });

  return (
    <AnimatedView style={[styles.container, containerAnimatedStyle]}>
      <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        onFocus={handleFocus}
        onBlur={handleBlur}
        selectionColor={COLORS.coral}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton} hitSlop={8}>
          <X size={18} color={COLORS.textSecondary} />
        </Pressable>
      )}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.white,
    padding: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 2,
  },
});
