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
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Briefcase, Trophy, Sparkles } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { useCampaigns, type Campaign } from "@/hooks/use-campaigns";
import CampaignCard from "@/components/campaigns/CampaignCard";

type FilterType = "all" | "deal" | "contest";

const FILTERS: { key: FilterType; label: string; icon: any }[] = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "deal", label: "Deals", icon: Briefcase },
  { key: "contest", label: "Contests", icon: Trophy },
];

export default function CampaignFeedScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Campaigns</Text>
        <View style={{ width: 40 }} />
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
              <Sparkles size={48} color={COLORS.textTertiary} />
              <Text style={styles.emptyTitle}>No campaigns yet</Text>
              <Text style={styles.emptySubtitle}>
                Check back soon — restaurants are creating opportunities for creators like you!
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
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
  filterBtnActive: {
    backgroundColor: COLORS.coral,
  },
  filterText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.white },
  loadingContainer: {
    flex: 1, alignItems: "center", justifyContent: "center",
  },
  listContent: { paddingBottom: 100 },
  emptyContainer: {
    alignItems: "center", justifyContent: "center",
    paddingVertical: 80, paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  emptySubtitle: {
    fontSize: 14, color: COLORS.textSecondary,
    textAlign: "center", lineHeight: 20,
  },
});
