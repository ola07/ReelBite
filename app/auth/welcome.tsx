import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Play } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A0A0A", "#1a0800", "#0A0A0A"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Logo & Branding */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Flame size={48} color={COLORS.coral} fill={COLORS.coral} />
          </View>
          <Text style={styles.appName}>ReelBite</Text>
          <Text style={styles.tagline}>Watch it. Love it. Book it.</Text>
        </Animated.View>

        {/* Feature Highlights */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.features}>
          <FeatureRow icon="play" text="Discover restaurants through short videos" />
          <FeatureRow icon="star" text="Find trending dishes near you" />
          <FeatureRow icon="calendar" text="Book tables & order food instantly" />
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push("/auth/signup")}
          >
            <Text style={styles.primaryBtnText}>Get Started</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.secondaryBtnText}>
              Already have an account? <Text style={{ color: COLORS.coral }}>Sign In</Text>
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            onPress={() => router.replace("/(tabs)/feed")}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureDot} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  safeArea: { flex: 1, justifyContent: "space-between", paddingHorizontal: 24 },
  logoSection: { alignItems: "center", paddingTop: 80 },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "rgba(16,185,129,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: "500",
  },
  features: { gap: 16, paddingHorizontal: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.coral,
  },
  featureText: { fontSize: 15, color: COLORS.white, fontWeight: "500" },
  actions: { alignItems: "center", paddingBottom: 32, gap: 16 },
  primaryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.coral,
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
  },
  secondaryBtn: { paddingVertical: 8 },
  secondaryBtnText: { fontSize: 14, color: COLORS.textSecondary },
  skipText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textDecorationLine: "underline",
    marginTop: 4,
  },
});
