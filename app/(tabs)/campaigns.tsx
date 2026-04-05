import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Briefcase, Trophy, Sparkles, TrendingUp } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { useCampaigns, type Campaign } from "@/hooks/use-campaigns";
import CampaignCard from "@/components/campaigns/CampaignCard";

type FilterType = "all" | "deal" | "contest";

const FILTERS: { key: FilterType; label: string; icon: any }[] = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "deal", label: "Deals", icon: Briefcase },
  { key: "contest", label: "Contests", icon: Trophy },
];

export default function CampaignsTabScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useAuthStore();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: campaigns, isLoading, refetch, isRefetching } = useCampaigns(
    filter === "all" ? undefined : { type: filter }
  );

  const handleCampaignPress = useCallback(
    (campaign: Campaign) => {
      router.push(`/campaigns/${campaign.id}` as any);
    },
    [router]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Campaigns</Text>
          <Text style={styles.subtitle}>Deals & contests from restaurants</Text>
        </View>
        {profile?.is_creator && (
          <Pressable
            style={styles.dashboardBtn}
            onPress={() => router.push("/campaigns/dashboard" as any)}
          >
            <TrendingUp size={16} color={COLORS.coral} />
            <Text style={styles.dashboardBtnText}>Dashboard</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const isActive = filter === f.key;
          return (
            <Pressable
              key={f.key}
              style={[styles.filterBtn, isActive && styles.filterBtnActive]}
              onPress={() => setFilter(f.key)}
            >
              <Icon size={14} color={isActive ? COLORS.white : COLORS.textSecondary} />
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Campaign List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.coral} />
        </View>
      ) : (
        <FlatList
          data={campaigns ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CampaignCard
              campaign={item}
              onPress={() => handleCampaignPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.coral}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Briefcase size={48} color={COLORS.textTertiary} />
              <Text style={styles.emptyTitle}>No campaigns yet</Text>
              <Text style={styles.emptySubtitle}>
                Restaurants are creating opportunities for creators — check back soon!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.white },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  dashboardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16,185,129,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  dashboardBtnText: { fontSize: 13, fontWeight: "600", color: COLORS.coral },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.darkSurface,
  },
  filterBtnActive: { backgroundColor: COLORS.coral },
  filterText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.white },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingBottom: 120 },
  emptyContainer: {
    alignItems: "center", justifyContent: "center",
    paddingVertical: 80, paddingHorizontal: 40, gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  emptySubtitle: {
    fontSize: 14, color: COLORS.textSecondary,
    textAlign: "center", lineHeight: 20,
  },
});
