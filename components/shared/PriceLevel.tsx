import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/lib/constants";

interface PriceLevelProps {
  level: 1 | 2 | 3 | 4;
  size?: number;
}

export default function PriceLevel({ level, size = 14 }: PriceLevelProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Text
          key={i}
          style={[
            styles.dollarSign,
            {
              fontSize: size,
              color: i < level ? COLORS.white : COLORS.textTertiary,
            },
          ]}
        >
          $
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dollarSign: {
    fontWeight: "700",
  },
});
