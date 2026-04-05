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
  DollarSign,
  ShoppingBag,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/lib/constants";
import { formatCurrency, formatCount } from "@/lib/utils";
import { AFFILIATE_RATES } from "@/lib/mock-data";
import { useCreatorReferralStats, useCreatorRecentReferrals } from "@/hooks/use-referrals";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type TimePeriod = "7d" | "30d" | "90d" | "all";

const TIME_PERIODS: { key: TimePeriod; label: string }[] = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "all", label: "All Time" },
];

// Mock earnings data
const EARNINGS_DATA: Record<TimePeriod, { total: number; change: number; orders: number; views: number }> = {
  "7d": { total: 342.50, change: 12.5, orders: 28, views: 45200 },
  "30d": { total: 1285.00, change: 8.3, orders: 112, views: 189000 },
  "90d": { total: 3670.00, change: 15.2, orders: 298, views: 534000 },
  all: { total: 8920.00, change: 22.1, orders: 756, views: 1240000 },
};

const RECENT_SALES = [
  { id: "s1", dish: "Margherita Pizza", restaurant: "Bella Napoli", amount: 2.85, date: "2h ago", videoTitle: "Best Margherita in Town" },
  { id: "s2", dish: "Chef's Omakase", restaurant: "Sakura Sushi", amount: 12.50, date: "5h ago", videoTitle: "Omakase Experience" },
  { id: "s3", dish: "Birria Tacos", restaurant: "La Cocina de Abuela", amount: 1.95, date: "8h ago", videoTitle: "Spicy Birria Tacos" },
  { id: "s4", dish: "Dry-Aged Ribeye", restaurant: "The Ember Room", amount: 8.40, date: "12h ago", videoTitle: "Truffle Butter Steak" },
  { id: "s5", dish: "Pad Thai", restaurant: "Bangkok Garden", amount: 2.10, date: "1d ago", videoTitle: "Pad Thai Street Style" },
  { id: "s6", dish: "Butter Chicken", restaurant: "Spice Route", amount: 3.25, date: "1d ago", videoTitle: "Butter Chicken Heaven" },
];

const TOP_VIDEOS = [
  { id: "tv1", title: "Best Margherita in Town", views: 125400, earnings: 2840, conversionRate: 4.2 },
  { id: "tv2", title: "Spicy Birria Tacos", views: 203000, earnings: 4120, conversionRate: 3.8 },
  { id: "tv3", title: "Omakase Experience", views: 89300, earnings: 3560, conversionRate: 5.1 },
];

function getNextPayoutDate(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 21);
  return next.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EarningsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<TimePeriod>("30d");
  const periodDays = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : undefined;
  const { data: realStats } = useCreatorReferralStats(periodDays);
  const { data: realRecent } = useCreatorRecentReferrals();

  // Use real data if available, otherwise fall back to mock
  const mockData = EARNINGS_DATA[period];
  const data = realStats && realStats.totalReferrals > 0
    ? { total: realStats.totalEarnings, change: 0, orders: realStats.orderCount, views: realStats.totalReferrals }
    : mockData;
  const isPositive = data.change >= 0;
  const nextPayoutDate = getNextPayoutDate();
  const nextPayoutAmount = EARNINGS_DATA["7d"].total;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Earnings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Earnings Card */}
        <LinearGradient
          colors={[COLORS.coralDark, COLORS.coral]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.earningsCard}
        >
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsAmount}>
            {formatCurrency(data.total)}
          </Text>
          <View style={styles.changeRow}>
            {isPositive ? (
              <ArrowUpRight size={16} color={COLORS.white} />
            ) : (
              <ArrowDownRight size={16} color={COLORS.white} />
            )}
            <Text style={styles.changeText}>
              {isPositive ? "+" : ""}
              {data.change}% from previous period
            </Text>
          </View>
        </LinearGradient>

        {/* Time Period Selector */}
        <View style={styles.periodRow}>
          {TIME_PERIODS.map((p) => (
            <Pressable
              key={p.key}
              onPress={() => setPeriod(p.key)}
              style={[
                styles.periodBtn,
                period === p.key && styles.periodBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.periodText,
                  period === p.key && styles.periodTextActive,
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Stats Row */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
              <ShoppingBag size={18} color={COLORS.coral} />
            </View>
            <Text style={styles.statValue}>{data.orders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(245,158,11,0.15)" }]}>
              <Eye size={18} color={COLORS.amber} />
            </View>
            <Text style={styles.statValue}>{formatCount(data.views)}</Text>
            <Text style={styles.statLabel}>Video Views</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(34,197,94,0.15)" }]}>
              <TrendingUp size={18} color={COLORS.success} />
            </View>
            <Text style={styles.statValue}>
              {data.views > 0
                ? ((data.orders / data.views) * 100).toFixed(1)
                : "0"}%
            </Text>
            <Text style={styles.statLabel}>Conv. Rate</Text>
          </View>
        </View>

        {/* Top Performing Videos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Videos</Text>
          {TOP_VIDEOS.map((video) => (
            <View key={video.id} style={styles.topVideoCard}>
              <View style={styles.topVideoInfo}>
                <Text style={styles.topVideoTitle} numberOfLines={1}>
                  {video.title}
                </Text>
                <Text style={styles.topVideoStats}>
                  {formatCount(video.views)} views | {video.conversionRate}% conversion
                </Text>
              </View>
              <Text style={styles.topVideoEarnings}>
                {formatCurrency(video.earnings / 100)}
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Sales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sales</Text>
          {RECENT_SALES.map((sale) => (
            <View key={sale.id} style={styles.saleCard}>
              <View style={styles.saleIcon}>
                <DollarSign size={16} color={COLORS.success} />
              </View>
              <View style={styles.saleInfo}>
                <Text style={styles.saleDish}>{sale.dish}</Text>
                <Text style={styles.saleRestaurant}>
                  {sale.restaurant} | {sale.date}
                </Text>
              </View>
              <Text style={styles.saleAmount}>
                +{formatCurrency(sale.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Affiliate Commissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affiliate Commissions</Text>
          {Object.entries(AFFILIATE_RATES).map(([id, affiliate]) => (
            <View key={id} style={styles.affiliateCard}>
              <View style={styles.affiliateInfo}>
                <Text style={styles.affiliateName}>{affiliate.restaurantName}</Text>
                <View style={styles.affiliateMeta}>
                  <View style={[styles.affiliateTypeBadge, {
                    backgroundColor: affiliate.type === "reservation"
                      ? "rgba(59,130,246,0.15)"
                      : "rgba(16,185,129,0.15)",
                  }]}>
                    <Text style={[styles.affiliateTypeText, {
                      color: affiliate.type === "reservation" ? "#3B82F6" : COLORS.coral,
                    }]}>
                      {affiliate.type === "reservation" ? "Reservation" : "Order"}
                    </Text>
                  </View>
                  <Text style={styles.affiliateRate}>{affiliate.rate}% commission</Text>
                </View>
              </View>
              <View style={styles.affiliateStats}>
                <Text style={styles.affiliateEarned}>
                  {formatCurrency(affiliate.totalEarned)}
                </Text>
                <Text style={styles.affiliateReferrals}>
                  {affiliate.totalReferrals} referrals
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payout Info */}
        <View style={styles.payoutCard}>
          <View style={styles.payoutHeader}>
            <Calendar size={18} color={COLORS.coral} />
            <Text style={styles.payoutTitle}>Next Payout</Text>
          </View>
          <Text style={styles.payoutAmount}>{formatCurrency(nextPayoutAmount)}</Text>
          <Text style={styles.payoutDate}>{nextPayoutDate}</Text>
          <View style={styles.payoutProgress}>
            <View style={[styles.payoutBar, { width: "75%" }]} />
          </View>
          <Text style={styles.payoutMinimum}>
            Minimum payout threshold: $50.00
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Earnings Card
  earningsCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  earningsLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  earningsAmount: {
    fontSize: 40,
    fontWeight: "800",
    color: COLORS.white,
    marginVertical: 8,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },

  // Period Selector
  periodRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.darkSurface,
    alignItems: "center",
  },
  periodBtnActive: {
    backgroundColor: COLORS.darkElevated,
    borderWidth: 1,
    borderColor: COLORS.coral,
  },
  periodText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  periodTextActive: {
    color: COLORS.coral,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.darkSurface,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 12,
  },

  // Top Videos
  topVideoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  topVideoInfo: {
    flex: 1,
    gap: 4,
  },
  topVideoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  topVideoStats: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  topVideoEarnings: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.success,
  },

  // Sales
  saleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    gap: 12,
  },
  saleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  saleInfo: {
    flex: 1,
    gap: 2,
  },
  saleDish: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  saleRestaurant: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  saleAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.success,
  },

  // Affiliate
  affiliateCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },
  affiliateInfo: { flex: 1, gap: 4 },
  affiliateName: { fontSize: 14, fontWeight: "700", color: COLORS.white },
  affiliateMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  affiliateTypeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  affiliateTypeText: { fontSize: 10, fontWeight: "700" },
  affiliateRate: { fontSize: 11, color: COLORS.textTertiary },
  affiliateStats: { alignItems: "flex-end", gap: 2 },
  affiliateEarned: { fontSize: 14, fontWeight: "700", color: COLORS.success },
  affiliateReferrals: { fontSize: 10, color: COLORS.textTertiary },

  // Payout
  payoutCard: {
    marginHorizontal: 16,
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  payoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  payoutTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  payoutAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 4,
  },
  payoutDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  payoutProgress: {
    height: 6,
    backgroundColor: COLORS.darkElevated,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  payoutBar: {
    height: 6,
    backgroundColor: COLORS.coral,
    borderRadius: 3,
  },
  payoutMinimum: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
});
