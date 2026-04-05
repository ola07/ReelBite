import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  DollarSign,
  Briefcase,
  Trophy,
  TrendingUp,
  ChevronRight,
  Send,
  Clock,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { getStatusColor } from "@/lib/campaign-utils";
import { useMySubmissions, useCreatorPayouts } from "@/hooks/use-campaigns";

export default function CreatorDashboardScreen() {
  const router = useRouter();
  const { data: submissions, isLoading: subsLoading } = useMySubmissions();
  const { data: payouts, isLoading: payoutsLoading } = useCreatorPayouts();

  const totalEarnings = (payouts ?? [])
    .filter((p: any) => p.status === "completed")
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  const pendingEarnings = (payouts ?? [])
    .filter((p: any) => p.status === "pending" || p.status === "processing")
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  const completedDeals = (submissions ?? []).filter(
    (s) => s.status === "approved" || s.status === "published"
  ).length;

  const pendingSubmissions = (submissions ?? []).filter(
    (s) => s.status === "pending"
  ).length;

  const isLoading = subsLoading || payoutsLoading;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Creator Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.coral} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Earnings Card */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <LinearGradient
              colors={[COLORS.coralDark, COLORS.coral]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.earningsCard}
            >
              <Text style={styles.earningsLabel}>Total Earnings</Text>
              <Text style={styles.earningsAmount}>{formatCurrency(totalEarnings)}</Text>
              {pendingEarnings > 0 && (
                <Text style={styles.pendingText}>
                  {formatCurrency(pendingEarnings)} pending
                </Text>
              )}
            </LinearGradient>
          </Animated.View>

          {/* Stats Grid */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Briefcase size={20} color="#3B82F6" />
              <Text style={styles.statValue}>{completedDeals}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={20} color="#F59E0B" />
              <Text style={styles.statValue}>{pendingSubmissions}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Send size={20} color={COLORS.coral} />
              <Text style={styles.statValue}>{(submissions ?? []).length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <Pressable
              style={styles.actionCard}
              onPress={() => router.push("/campaigns" as any)}
            >
              <View style={[styles.actionIcon, { backgroundColor: "rgba(16,185,129,0.12)" }]}>
                <Briefcase size={20} color={COLORS.coral} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Browse Campaigns</Text>
                <Text style={styles.actionSubtitle}>Find deals & contests to join</Text>
              </View>
              <ChevronRight size={18} color={COLORS.textSecondary} />
            </Pressable>
          </Animated.View>

          {/* Recent Submissions */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Submissions</Text>
            {(submissions ?? []).length === 0 ? (
              <View style={styles.emptyCard}>
                <Send size={32} color={COLORS.textTertiary} />
                <Text style={styles.emptyText}>No submissions yet</Text>
                <Text style={styles.emptySubtext}>Browse campaigns and submit your first video!</Text>
              </View>
            ) : (
              (submissions ?? []).slice(0, 5).map((sub) => {
                const statusColor = getStatusColor(sub.status);
                return (
                  <View key={sub.id} style={styles.submissionRow}>
                    <View style={styles.submissionInfo}>
                      <Text style={styles.submissionTitle} numberOfLines={1}>
                        {(sub.campaign as any)?.title ?? "Campaign"}
                      </Text>
                      <Text style={styles.submissionRestaurant}>
                        {(sub.campaign as any)?.restaurant?.name ?? ""}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {sub.status.replace("_", " ")}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </Animated.View>

          {/* Payout History */}
          {(payouts ?? []).length > 0 && (
            <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
              <Text style={styles.sectionTitle}>Payout History</Text>
              {(payouts ?? []).slice(0, 5).map((payout: any) => {
                const statusColor = getStatusColor(payout.status);
                return (
                  <View key={payout.id} style={styles.payoutRow}>
                    <View style={styles.payoutIcon}>
                      <DollarSign size={16} color={COLORS.success} />
                    </View>
                    <View style={styles.payoutInfo}>
                      <Text style={styles.payoutAmount}>
                        {formatCurrency(payout.amount)}
                      </Text>
                      <Text style={styles.payoutFee}>
                        Fee: {formatCurrency(payout.platform_fee)}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {payout.status}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </Animated.View>
          )}
        </ScrollView>
      )}
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
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  scrollContent: { paddingBottom: 100 },
  earningsCard: {
    marginHorizontal: 16, borderRadius: 20, padding: 24, marginBottom: 16,
  },
  earningsLabel: { fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  earningsAmount: { fontSize: 40, fontWeight: "800", color: COLORS.white, marginVertical: 8 },
  pendingText: { fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: "600" },
  statsGrid: {
    flexDirection: "row", paddingHorizontal: 16, gap: 10, marginBottom: 20,
  },
  statCard: {
    flex: 1, backgroundColor: COLORS.darkSurface, borderRadius: 14,
    padding: 14, alignItems: "center", gap: 6,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.04)",
  },
  statValue: { fontSize: 20, fontWeight: "700", color: COLORS.white },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: "600" },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.white, marginBottom: 12 },
  actionCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  actionIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  actionInfo: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: "700", color: COLORS.white },
  actionSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  emptyCard: {
    backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 32,
    alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.04)",
  },
  emptyText: { fontSize: 15, fontWeight: "600", color: COLORS.white },
  emptySubtext: { fontSize: 12, color: COLORS.textSecondary, textAlign: "center" },
  submissionRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.darkSurface, borderRadius: 12, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.04)",
  },
  submissionInfo: { flex: 1, gap: 2 },
  submissionTitle: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  submissionRestaurant: { fontSize: 11, color: COLORS.textTertiary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: "700", textTransform: "capitalize" },
  payoutRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: COLORS.darkSurface, borderRadius: 12, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.04)",
  },
  payoutIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  payoutInfo: { flex: 1, gap: 2 },
  payoutAmount: { fontSize: 15, fontWeight: "700", color: COLORS.white },
  payoutFee: { fontSize: 11, color: COLORS.textTertiary },
});
