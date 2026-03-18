import React, { useState } from "react";
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
  TrendingUp,
  Users,
  Eye,
  Clock,
  MapPin,
  BarChart3,
  Heart,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { formatCount } from "@/lib/utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type TimePeriod = "7d" | "30d" | "90d";

// ─── Mock Analytics Data ──────────────────────────────────────────────────

const OVERVIEW_STATS = {
  "7d": { views: 45200, likes: 3200, followers: 820, avgWatchTime: 12.4 },
  "30d": { views: 189000, likes: 14500, followers: 3400, avgWatchTime: 14.1 },
  "90d": { views: 534000, likes: 42100, followers: 9800, avgWatchTime: 13.6 },
};

const AUDIENCE_DEMOGRAPHICS = {
  age: [
    { label: "18-24", pct: 28 },
    { label: "25-34", pct: 38 },
    { label: "35-44", pct: 20 },
    { label: "45-54", pct: 9 },
    { label: "55+", pct: 5 },
  ],
  gender: [
    { label: "Female", pct: 56, color: "#EC4899" },
    { label: "Male", pct: 40, color: "#3B82F6" },
    { label: "Other", pct: 4, color: "#8B5CF6" },
  ],
  topCities: [
    { city: "New York", pct: 32 },
    { city: "Los Angeles", pct: 18 },
    { city: "Chicago", pct: 12 },
    { city: "Houston", pct: 8 },
    { city: "Miami", pct: 7 },
  ],
};

const PEAK_TIMES = [
  { hour: "8 AM", engagement: 25 },
  { hour: "10 AM", engagement: 35 },
  { hour: "12 PM", engagement: 72 },
  { hour: "2 PM", engagement: 55 },
  { hour: "4 PM", engagement: 40 },
  { hour: "6 PM", engagement: 85 },
  { hour: "8 PM", engagement: 100 },
  { hour: "10 PM", engagement: 78 },
  { hour: "12 AM", engagement: 30 },
];

const CONTENT_PERFORMANCE = [
  { id: "1", title: "Spicy Birria Tacos", views: 203000, likes: 15200, engagement: 7.5, saves: 4500 },
  { id: "2", title: "Truffle Butter Steak", views: 156000, likes: 11200, engagement: 7.2, saves: 3200 },
  { id: "3", title: "Best Margherita", views: 125400, likes: 8920, engagement: 7.1, saves: 1205 },
  { id: "4", title: "Butter Chicken Heaven", views: 98500, likes: 7100, engagement: 7.2, saves: 1560 },
  { id: "5", title: "Omakase Experience", views: 89300, likes: 6540, engagement: 7.3, saves: 2340 },
];

const PEAK_DAYS = [
  { day: "Mon", value: 55 },
  { day: "Tue", value: 62 },
  { day: "Wed", value: 48 },
  { day: "Thu", value: 70 },
  { day: "Fri", value: 88 },
  { day: "Sat", value: 100 },
  { day: "Sun", value: 75 },
];

// ─── Bar Chart Component ─────────────────────────────────────────────────

function MiniBar({ value, maxValue, color, label }: { value: number; maxValue: number; color: string; label: string }) {
  const height = Math.max(4, (value / maxValue) * 80);
  return (
    <View style={barStyles.column}>
      <View style={[barStyles.bar, { height, backgroundColor: color }]} />
      <Text style={barStyles.label}>{label}</Text>
    </View>
  );
}

const barStyles = StyleSheet.create({
  column: { alignItems: "center", gap: 4, flex: 1 },
  bar: { width: 20, borderRadius: 4 },
  label: { fontSize: 9, color: COLORS.textTertiary, fontWeight: "600" },
});

// ─── Main Screen ─────────────────────────────────────────────────────────

export default function AnalyticsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<TimePeriod>("30d");
  const stats = OVERVIEW_STATS[period];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodRow}>
          {(["7d", "30d", "90d"] as TimePeriod[]).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Overview Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
              <Eye size={16} color={COLORS.coral} />
            </View>
            <Text style={styles.statValue}>{formatCount(stats.views)}</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(239,68,68,0.15)" }]}>
              <Heart size={16} color={COLORS.error} />
            </View>
            <Text style={styles.statValue}>{formatCount(stats.likes)}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(59,130,246,0.15)" }]}>
              <Users size={16} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>+{formatCount(stats.followers)}</Text>
            <Text style={styles.statLabel}>New Followers</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(245,158,11,0.15)" }]}>
              <Clock size={16} color={COLORS.amber} />
            </View>
            <Text style={styles.statValue}>{stats.avgWatchTime}s</Text>
            <Text style={styles.statLabel}>Avg. Watch</Text>
          </View>
        </View>

        {/* Peak Engagement Times */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={18} color={COLORS.coral} />
            <Text style={styles.sectionTitle}>Peak Engagement Times</Text>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.barChart}>
              {PEAK_TIMES.map((t) => (
                <MiniBar
                  key={t.hour}
                  value={t.engagement}
                  maxValue={100}
                  color={t.engagement >= 80 ? COLORS.coral : t.engagement >= 50 ? COLORS.amber : COLORS.darkHover}
                  label={t.hour}
                />
              ))}
            </View>
            <Text style={styles.chartHint}>Best time to post: 6-8 PM</Text>
          </View>
        </View>

        {/* Peak Days */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={18} color={COLORS.amber} />
            <Text style={styles.sectionTitle}>Engagement by Day</Text>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.barChart}>
              {PEAK_DAYS.map((d) => (
                <MiniBar
                  key={d.day}
                  value={d.value}
                  maxValue={100}
                  color={d.value >= 80 ? COLORS.coral : d.value >= 60 ? COLORS.amber : COLORS.darkHover}
                  label={d.day}
                />
              ))}
            </View>
            <Text style={styles.chartHint}>Most engagement: Friday & Saturday</Text>
          </View>
        </View>

        {/* Audience Demographics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={18} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Audience Demographics</Text>
          </View>

          {/* Age Distribution */}
          <View style={styles.demoCard}>
            <Text style={styles.demoSubtitle}>Age Distribution</Text>
            {AUDIENCE_DEMOGRAPHICS.age.map((a) => (
              <View key={a.label} style={styles.demoRow}>
                <Text style={styles.demoLabel}>{a.label}</Text>
                <View style={styles.demoBarTrack}>
                  <View
                    style={[
                      styles.demoBarFill,
                      { width: `${a.pct}%`, backgroundColor: COLORS.coral },
                    ]}
                  />
                </View>
                <Text style={styles.demoPct}>{a.pct}%</Text>
              </View>
            ))}
          </View>

          {/* Gender Split */}
          <View style={styles.demoCard}>
            <Text style={styles.demoSubtitle}>Gender</Text>
            <View style={styles.genderRow}>
              {AUDIENCE_DEMOGRAPHICS.gender.map((g) => (
                <View key={g.label} style={styles.genderItem}>
                  <View style={[styles.genderDot, { backgroundColor: g.color }]} />
                  <Text style={styles.genderLabel}>{g.label}</Text>
                  <Text style={[styles.genderPct, { color: g.color }]}>{g.pct}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Top Cities */}
          <View style={styles.demoCard}>
            <Text style={styles.demoSubtitle}>Top Cities</Text>
            {AUDIENCE_DEMOGRAPHICS.topCities.map((c, i) => (
              <View key={c.city} style={styles.cityRow}>
                <View style={styles.cityRank}>
                  <Text style={styles.cityRankText}>{i + 1}</Text>
                </View>
                <MapPin size={14} color={COLORS.textTertiary} />
                <Text style={styles.cityName}>{c.city}</Text>
                <Text style={styles.cityPct}>{c.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Content Performance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={18} color={COLORS.success} />
            <Text style={styles.sectionTitle}>Content Performance</Text>
          </View>
          {CONTENT_PERFORMANCE.map((video, i) => (
            <View key={video.id} style={styles.perfCard}>
              <View style={styles.perfRank}>
                <Text style={styles.perfRankText}>#{i + 1}</Text>
              </View>
              <View style={styles.perfInfo}>
                <Text style={styles.perfTitle} numberOfLines={1}>
                  {video.title}
                </Text>
                <View style={styles.perfStats}>
                  <Text style={styles.perfStat}>
                    {formatCount(video.views)} views
                  </Text>
                  <Text style={styles.perfDot}>•</Text>
                  <Text style={styles.perfStat}>
                    {formatCount(video.likes)} likes
                  </Text>
                  <Text style={styles.perfDot}>•</Text>
                  <Text style={styles.perfStat}>
                    {formatCount(video.saves)} saves
                  </Text>
                </View>
              </View>
              <View style={styles.perfEngagement}>
                <Text style={styles.perfEngValue}>{video.engagement}%</Text>
                <Text style={styles.perfEngLabel}>Eng.</Text>
              </View>
            </View>
          ))}
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
    backgroundColor: COLORS.darkElevated,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  scrollContent: { paddingBottom: 100 },

  // Period
  periodRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  periodBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 10,
    backgroundColor: COLORS.darkSurface, alignItems: "center",
  },
  periodBtnActive: { backgroundColor: COLORS.darkElevated, borderWidth: 1, borderColor: COLORS.coral },
  periodText: { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary },
  periodTextActive: { color: COLORS.coral },

  // Stats Grid
  statsGrid: {
    flexDirection: "row", flexWrap: "wrap",
    paddingHorizontal: 16, gap: 10, marginBottom: 24,
  },
  statCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 14, gap: 6,
  },
  statIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 20, fontWeight: "700", color: COLORS.white },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: "600" },

  // Sections
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white },

  // Chart
  chartCard: { backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 16 },
  barChart: { flexDirection: "row", alignItems: "flex-end", height: 100, gap: 2 },
  chartHint: { fontSize: 12, color: COLORS.coral, fontWeight: "600", marginTop: 12, textAlign: "center" },

  // Demographics
  demoCard: { backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 14, marginBottom: 10 },
  demoSubtitle: { fontSize: 14, fontWeight: "700", color: COLORS.white, marginBottom: 12 },
  demoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  demoLabel: { fontSize: 12, color: COLORS.textSecondary, width: 40 },
  demoBarTrack: { flex: 1, height: 8, backgroundColor: COLORS.darkElevated, borderRadius: 4, overflow: "hidden" },
  demoBarFill: { height: 8, borderRadius: 4 },
  demoPct: { fontSize: 12, fontWeight: "700", color: COLORS.white, width: 36, textAlign: "right" },

  // Gender
  genderRow: { flexDirection: "row", gap: 16 },
  genderItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  genderDot: { width: 10, height: 10, borderRadius: 5 },
  genderLabel: { fontSize: 12, color: COLORS.textSecondary },
  genderPct: { fontSize: 14, fontWeight: "700" },

  // Cities
  cityRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  cityRank: {
    width: 22, height: 22, borderRadius: 6,
    backgroundColor: COLORS.darkElevated, alignItems: "center", justifyContent: "center",
  },
  cityRankText: { fontSize: 10, fontWeight: "700", color: COLORS.textSecondary },
  cityName: { flex: 1, fontSize: 13, color: COLORS.white, fontWeight: "600" },
  cityPct: { fontSize: 13, fontWeight: "700", color: COLORS.coral },

  // Performance
  perfCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.darkSurface, borderRadius: 12, padding: 12, marginBottom: 8, gap: 12,
  },
  perfRank: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: COLORS.darkElevated, alignItems: "center", justifyContent: "center",
  },
  perfRankText: { fontSize: 12, fontWeight: "700", color: COLORS.coral },
  perfInfo: { flex: 1, gap: 4 },
  perfTitle: { fontSize: 14, fontWeight: "700", color: COLORS.white },
  perfStats: { flexDirection: "row", alignItems: "center", gap: 4 },
  perfStat: { fontSize: 11, color: COLORS.textTertiary },
  perfDot: { fontSize: 11, color: COLORS.textTertiary },
  perfEngagement: { alignItems: "center" },
  perfEngValue: { fontSize: 16, fontWeight: "700", color: COLORS.success },
  perfEngLabel: { fontSize: 9, color: COLORS.textTertiary, fontWeight: "600" },
});
