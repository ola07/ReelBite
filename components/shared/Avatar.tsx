import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { COLORS } from "@/lib/constants";

interface AvatarProps {
  url: string | null;
  name: string;
  size?: number;
}

export default function Avatar({ url, name, size = 40 }: AvatarProps) {
  const initials = name.trim().charAt(0).toUpperCase();

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.initialsText, { fontSize: size * 0.4 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: COLORS.darkElevated,
  },
  fallback: {
    backgroundColor: COLORS.coral,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});
