import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Video, Sparkles, DollarSign, Users, ChevronRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase";

const PERKS = [
  { icon: Video, text: "Post video food reviews" },
  { icon: DollarSign, text: "Earn affiliate commissions" },
  { icon: Users, text: "Build your foodie audience" },
  { icon: Sparkles, text: "Get matched with restaurants" },
];

export default function CreatorOnboarding() {
  const { user, fetchProfile } = useAuthStore();
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update profile as creator
      await supabase
        .from("profiles")
        .update({ is_creator: true, bio: bio.trim() || null } as any)
        .eq("id", user.id);

      // Create creator record
      await supabase
        .from("creators")
        .upsert({
          id: user.id,
          bio: bio.trim() || null,
          total_followers: 0,
          total_likes: 0,
          total_videos: 0,
          is_verified: false,
        } as any);

      await fetchProfile();
      router.replace("/(tabs)/feed");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to set up creator profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <LinearGradient
            colors={[COLORS.coral, "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBadge}
          >
            <Video size={32} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.title}>Welcome, Creator!</Text>
          <Text style={styles.subtitle}>
            Set up your profile and start sharing food reviews
          </Text>
        </Animated.View>

        {/* Perks */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.perksContainer}>
          {PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <View key={perk.text} style={styles.perkRow}>
                <View style={styles.perkIcon}>
                  <Icon size={18} color={COLORS.coral} />
                </View>
                <Text style={styles.perkText}>{perk.text}</Text>
              </View>
            );
          })}
        </Animated.View>

        {/* Bio Input */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <Text style={styles.label}>Tell us about yourself</Text>
          <TextInput
            style={styles.bioInput}
            placeholder="Food blogger, taco enthusiast, always hunting the best bites..."
            placeholderTextColor={COLORS.textTertiary}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
          <Text style={styles.charCount}>{bio.length}/200</Text>
        </Animated.View>

        {/* Complete Button */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <Pressable
            style={[styles.completeBtn, loading && { opacity: 0.7 }]}
            onPress={handleComplete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.completeBtnText}>Start Creating</Text>
                <ChevronRight size={20} color={COLORS.white} />
              </>
            )}
          </Pressable>

          <Pressable
            style={styles.skipBtn}
            onPress={() => router.replace("/(tabs)/feed")}
          >
            <Text style={styles.skipText}>Set up later</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20 },
  header: { alignItems: "center", marginBottom: 32 },
  iconBadge: {
    width: 72, height: 72, borderRadius: 24,
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.white },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 8, textAlign: "center" },
  perksContainer: {
    backgroundColor: COLORS.darkSurface, borderRadius: 16, padding: 16,
    gap: 12, marginBottom: 28,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  perkIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(16,185,129,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  perkText: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  label: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary, marginBottom: 8 },
  bioInput: {
    backgroundColor: COLORS.darkSurface, borderRadius: 14,
    padding: 16, color: COLORS.white, fontSize: 15,
    minHeight: 100, textAlignVertical: "top",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  charCount: { fontSize: 12, color: COLORS.textTertiary, textAlign: "right", marginTop: 6 },
  completeBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.coral, height: 54, borderRadius: 14,
    alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24,
  },
  completeBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  skipBtn: { alignItems: "center", paddingTop: 16 },
  skipText: { fontSize: 14, color: COLORS.textSecondary },
});
