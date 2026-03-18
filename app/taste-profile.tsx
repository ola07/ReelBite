import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Heart,
  Compass,
  Zap,
  Coffee,
  Wine,
  Leaf,
  Star,
  TrendingUp,
  MapPin,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { useTasteStore } from "@/stores/taste-store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Simulated Taste Profile (would come from real usage data) ──────────

const MOCK_TASTE_DATA = {
  profileStrength: 78,
  topCuisines: [
    { name: "Japanese", score: 88, icon: "🍣" },
    { name: "Italian", score: 82, icon: "🍕" },
    { name: "Mexican", score: 75, icon: "🌮" },
    { name: "Thai", score: 68, icon: "🍜" },
    { name: "Indian", score: 55, icon: "🍛" },
  ],
  flavorProfile: [
    { name: "Savory", score: 92 },
    { name: "Spicy", score: 78 },
    { name: "Fresh", score: 71 },
    { name: "Grilled", score: 65 },
    { name: "Sweet", score: 45 },
    { name: "Fried", score: 38 },
  ],
  diningVibes: [
    { name: "Date Night", score: 85 },
    { name: "Casual", score: 72 },
    { name: "Trendy", score: 68 },
    { name: "Cozy", score: 55 },
  ],
  insights: {
    adventureScore: 76,
    spiceLevel: 78,
    healthScore: 62,
    valueSeeker: 45,
  },
  recentActivity: {
    videosWatched: 245,
    restaurantsVisited: 18,
    dishesOrdered: 34,
    reviewsRead: 89,
  },
  personalityTag: "Adventurous Foodie",
  personalityDescription: "You love exploring bold flavors and trying new cuisines. You gravitate toward date-night spots with trendy vibes and aren't afraid of heat.",
};

function ProgressBar({ value, color, height = 8 }: { value: number; color: string; height?: number }) {
  return (
    <View style={[barStyles.track, { height }]}>
      <View style={[barStyles.fill, { width: `${value}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: { flex: 1, backgroundColor: COLORS.darkElevated, borderRadius: 4, overflow: "hidden" },
  fill: { borderRadius: 4 },
});

function StatCircle({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={circleStyles.container}>
      <View style={[circleStyles.circle, { borderColor: color }]}>
        <Text style={[circleStyles.value, { color }]}>{value}</Text>
      </View>
      <Text style={circleStyles.label}>{label}</Text>
    </View>
  );
}

const circleStyles = StyleSheet.create({
  container: { alignItems: "center", gap: 6, flex: 1 },
  circle: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 3, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  value: { fontSize: 18, fontWeight: "700" },
  label: { fontSize: 10, color: COLORS.textTertiary, fontWeight: "600", textAlign: "center" },
});

export default function TasteProfileScreen() {
  const router = useRouter();
  const data = MOCK_TASTE_DATA;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Your Taste Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Personality Card */}
        <View style={styles.personalityCard}>
          <View style={styles.personalityIcon}>
            <Sparkles size={28} color={COLORS.coral} />
          </View>
          <Text style={styles.personalityTag}>{data.personalityTag}</Text>
          <Text style={styles.personalityDesc}>{data.personalityDescription}</Text>

          {/* Profile Strength */}
          <View style={styles.strengthRow}>
            <Text style={styles.strengthLabel}>Profile Strength</Text>
            <Text style={styles.strengthValue}>{data.profileStrength}%</Text>
          </View>
          <ProgressBar value={data.profileStrength} color={COLORS.coral} height={6} />
          <Text style={styles.strengthHint}>Keep watching & ordering to improve your recommendations</Text>
        </View>

        {/* Insight Circles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Food DNA</Text>
          <View style={styles.insightRow}>
            <StatCircle value={data.insights.adventureScore} label="Adventure" color={COLORS.coral} />
            <StatCircle value={data.insights.spiceLevel} label="Spice Level" color={COLORS.error} />
            <StatCircle value={data.insights.healthScore} label="Health" color={COLORS.success} />
            <StatCircle value={data.insights.valueSeeker} label="Value" color={COLORS.amber} />
          </View>
        </View>

        {/* Top Cuisines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Cuisines</Text>
          {data.topCuisines.map((cuisine, i) => (
            <View key={cuisine.name} style={styles.cuisineRow}>
              <Text style={styles.cuisineIcon}>{cuisine.icon}</Text>
              <Text style={styles.cuisineName}>{cuisine.name}</Text>
              <View style={styles.cuisineBarWrap}>
                <ProgressBar value={cuisine.score} color={COLORS.coral} />
              </View>
              <Text style={styles.cuisineScore}>{cuisine.score}%</Text>
            </View>
          ))}
        </View>

        {/* Flavor Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flavor Profile</Text>
          <View style={styles.flavorGrid}>
            {data.flavorProfile.map((f) => (
              <View key={f.name} style={styles.flavorCard}>
                <Text style={styles.flavorName}>{f.name}</Text>
                <Text style={[styles.flavorScore, { color: f.score > 70 ? COLORS.coral : f.score > 50 ? COLORS.amber : COLORS.textTertiary }]}>
                  {f.score}%
                </Text>
                <ProgressBar
                  value={f.score}
                  color={f.score > 70 ? COLORS.coral : f.score > 50 ? COLORS.amber : COLORS.textTertiary}
                  height={4}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Dining Vibes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Vibes</Text>
          <View style={styles.vibeGrid}>
            {data.diningVibes.map((v) => (
              <View key={v.name} style={styles.vibeCard}>
                <Text style={styles.vibeName}>{v.name}</Text>
                <ProgressBar value={v.score} color={COLORS.coral} height={4} />
                <Text style={styles.vibeScore}>{v.score}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Activity Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.activityGrid}>
            <View style={styles.activityCard}>
              <Flame size={18} color={COLORS.coral} />
              <Text style={styles.activityValue}>{data.recentActivity.videosWatched}</Text>
              <Text style={styles.activityLabel}>Videos</Text>
            </View>
            <View style={styles.activityCard}>
              <MapPin size={18} color={COLORS.amber} />
              <Text style={styles.activityValue}>{data.recentActivity.restaurantsVisited}</Text>
              <Text style={styles.activityLabel}>Restaurants</Text>
            </View>
            <View style={styles.activityCard}>
              <Coffee size={18} color="#3B82F6" />
              <Text style={styles.activityValue}>{data.recentActivity.dishesOrdered}</Text>
              <Text style={styles.activityLabel}>Dishes</Text>
            </View>
            <View style={styles.activityCard}>
              <Star size={18} color="#8B5CF6" />
              <Text style={styles.activityValue}>{data.recentActivity.reviewsRead}</Text>
              <Text style={styles.activityLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* AI Tip */}
        <View style={styles.aiTipCard}>
          <Sparkles size={18} color={COLORS.coral} />
          <Text style={styles.aiTipText}>
            Your taste profile powers personalized recommendations across the app — from your video feed to AI menu suggestions. The more you interact, the smarter it gets.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.darkElevated, alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },

  // Personality
  personalityCard: {
    backgroundColor: COLORS.darkSurface, borderRadius: 20, padding: 20,
    alignItems: "center", marginBottom: 24, borderWidth: 1, borderColor: "rgba(16,185,129,0.12)",
  },
  personalityIcon: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  personalityTag: { fontSize: 22, fontWeight: "700", color: COLORS.white, marginBottom: 6 },
  personalityDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", lineHeight: 19, marginBottom: 16 },
  strengthRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 6 },
  strengthLabel: { fontSize: 12, fontWeight: "600", color: COLORS.textTertiary },
  strengthValue: { fontSize: 12, fontWeight: "700", color: COLORS.coral },
  strengthHint: { fontSize: 11, color: COLORS.textTertiary, marginTop: 6 },

  // Sections
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white, marginBottom: 14 },

  // Insights
  insightRow: { flexDirection: "row", gap: 10 },

  // Cuisines
  cuisineRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  cuisineIcon: { fontSize: 20, width: 28 },
  cuisineName: { fontSize: 14, fontWeight: "600", color: COLORS.white, width: 70 },
  cuisineBarWrap: { flex: 1 },
  cuisineScore: { fontSize: 13, fontWeight: "700", color: COLORS.coral, width: 36, textAlign: "right" },

  // Flavors
  flavorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  flavorCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: COLORS.darkSurface, borderRadius: 12, padding: 12, gap: 6,
  },
  flavorName: { fontSize: 13, fontWeight: "600", color: COLORS.white },
  flavorScore: { fontSize: 16, fontWeight: "700" },

  // Vibes
  vibeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  vibeCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: COLORS.darkSurface, borderRadius: 12, padding: 12, gap: 6,
  },
  vibeName: { fontSize: 13, fontWeight: "600", color: COLORS.white },
  vibeScore: { fontSize: 12, fontWeight: "700", color: COLORS.coral },

  // Activity
  activityGrid: { flexDirection: "row", gap: 8 },
  activityCard: {
    flex: 1, backgroundColor: COLORS.darkSurface, borderRadius: 14,
    padding: 14, alignItems: "center", gap: 6,
  },
  activityValue: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  activityLabel: { fontSize: 10, color: COLORS.textTertiary, fontWeight: "600" },

  // AI Tip
  aiTipCard: {
    flexDirection: "row", gap: 10,
    backgroundColor: "rgba(16,185,129,0.08)", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "rgba(16,185,129,0.12)",
  },
  aiTipText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
});
