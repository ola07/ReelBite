import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Handshake,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Star,
  DollarSign,
  ChevronRight,
  Sparkles,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useToastStore } from "@/stores/toast-store";

type CollabStatus = "pending" | "active" | "completed" | "declined";

type Collaboration = {
  id: string;
  restaurantName: string;
  restaurantCuisine: string;
  type: "sponsored_review" | "featured_video" | "menu_launch" | "event_coverage";
  status: CollabStatus;
  budget: number;
  deliverables: string;
  deadline: string;
  notes: string;
};

const STATUS_CONFIG: Record<CollabStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: COLORS.amber, icon: Clock },
  active: { label: "In Progress", color: COLORS.coral, icon: Sparkles },
  completed: { label: "Completed", color: COLORS.success, icon: CheckCircle2 },
  declined: { label: "Declined", color: COLORS.error, icon: XCircle },
};

const TYPE_LABELS: Record<string, string> = {
  sponsored_review: "Sponsored Review",
  featured_video: "Featured Video",
  menu_launch: "Menu Launch",
  event_coverage: "Event Coverage",
};

const MOCK_COLLABS: Collaboration[] = [
  {
    id: "col1", restaurantName: "Bella Napoli", restaurantCuisine: "Italian",
    type: "sponsored_review", status: "active", budget: 500,
    deliverables: "2 videos (60s + 30s), 1 story series",
    deadline: "Mar 25, 2026", notes: "Focus on new spring menu items",
  },
  {
    id: "col2", restaurantName: "Sakura Sushi", restaurantCuisine: "Japanese",
    type: "featured_video", status: "pending", budget: 750,
    deliverables: "1 premium video (90s), behind-the-scenes content",
    deadline: "Apr 5, 2026", notes: "Omakase chef feature",
  },
  {
    id: "col3", restaurantName: "The Ember Room", restaurantCuisine: "Steakhouse",
    type: "menu_launch", status: "completed", budget: 1200,
    deliverables: "3 videos, menu showcase, giveaway",
    deadline: "Mar 10, 2026", notes: "New dry-aging room opening",
  },
  {
    id: "col4", restaurantName: "Bangkok Garden", restaurantCuisine: "Thai",
    type: "event_coverage", status: "pending", budget: 350,
    deliverables: "Live event coverage, 1 highlight reel",
    deadline: "Mar 30, 2026", notes: "Thai New Year celebration",
  },
  {
    id: "col5", restaurantName: "Spice Route", restaurantCuisine: "Indian",
    type: "sponsored_review", status: "declined", budget: 200,
    deliverables: "1 review video", deadline: "Mar 15, 2026",
    notes: "Budget too low for deliverables",
  },
];

type TabKey = "all" | "active" | "pending" | "completed";

export default function CollaborationsScreen() {
  const router = useRouter();
  const { showToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [collabs, setCollabs] = useState<Collaboration[]>(MOCK_COLLABS);

  const updateCollabStatus = (id: string, status: CollabStatus) => {
    setCollabs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const filteredCollabs = activeTab === "all"
    ? collabs
    : collabs.filter((c) => c.status === activeTab);

  const totalEarnings = useMemo(
    () => collabs.filter((c) => c.status === "completed").reduce((s, c) => s + c.budget, 0),
    [collabs]
  );
  const activeCount = useMemo(
    () => collabs.filter((c) => c.status === "active").length,
    [collabs]
  );
  const pendingCount = useMemo(
    () => collabs.filter((c) => c.status === "pending").length,
    [collabs]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Collaborations</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <DollarSign size={18} color={COLORS.success} />
            <Text style={styles.summaryValue}>{formatCurrency(totalEarnings)}</Text>
            <Text style={styles.summaryLabel}>Earned</Text>
          </View>
          <View style={styles.summaryCard}>
            <Sparkles size={18} color={COLORS.coral} />
            <Text style={styles.summaryValue}>{activeCount}</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
          <View style={styles.summaryCard}>
            <Clock size={18} color={COLORS.amber} />
            <Text style={styles.summaryValue}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>

        {/* Tab Filter */}
        <View style={styles.tabRow}>
          {(["all", "active", "pending", "completed"] as TabKey[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Collaboration Cards */}
        {filteredCollabs.map((collab) => {
          const statusConfig = STATUS_CONFIG[collab.status];
          const StatusIcon = statusConfig.icon;

          return (
            <View key={collab.id} style={styles.collabCard}>
              {/* Header Row */}
              <View style={styles.collabHeader}>
                <View style={styles.collabNameRow}>
                  <Text style={styles.collabRestaurant}>{collab.restaurantName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
                    <StatusIcon size={10} color={statusConfig.color} />
                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.collabCuisine}>{collab.restaurantCuisine}</Text>
              </View>

              {/* Type & Budget */}
              <View style={styles.collabMeta}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{TYPE_LABELS[collab.type]}</Text>
                </View>
                <Text style={styles.collabBudget}>{formatCurrency(collab.budget)}</Text>
              </View>

              {/* Deliverables */}
              <View style={styles.collabSection}>
                <Text style={styles.collabSectionLabel}>Deliverables</Text>
                <Text style={styles.collabSectionText}>{collab.deliverables}</Text>
              </View>

              {/* Deadline & Notes */}
              <View style={styles.collabFooter}>
                <View style={styles.deadlineRow}>
                  <Clock size={12} color={COLORS.textTertiary} />
                  <Text style={styles.deadlineText}>{collab.deadline}</Text>
                </View>
                {collab.status === "pending" && (
                  <View style={styles.actionRow}>
                    <Pressable
                      style={styles.acceptBtn}
                      onPress={() => {
                        updateCollabStatus(collab.id, "active");
                        showToast(
                          `Accepted collaboration with ${collab.restaurantName}`,
                          "success"
                        );
                      }}
                    >
                      <Text style={styles.acceptBtnText}>Accept</Text>
                    </Pressable>
                    <Pressable
                      style={styles.declineBtn}
                      onPress={() => {
                        Alert.alert(
                          "Decline Collaboration",
                          `Are you sure you want to decline the offer from ${collab.restaurantName}?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Decline",
                              style: "destructive",
                              onPress: () => {
                                updateCollabStatus(collab.id, "declined");
                                showToast("Collaboration declined", "info");
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <Text style={styles.declineBtnText}>Decline</Text>
                    </Pressable>
                  </View>
                )}
                {collab.status === "active" && (
                  <Pressable style={styles.chatBtn}>
                    <MessageSquare size={14} color={COLORS.coral} />
                    <Text style={styles.chatBtnText}>Message</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}

        {filteredCollabs.length === 0 && (
          <View style={styles.emptyState}>
            <Handshake size={48} color={COLORS.textTertiary} />
            <Text style={styles.emptyTitle}>No collaborations</Text>
            <Text style={styles.emptySubtitle}>
              Your restaurant partnership offers will appear here
            </Text>
          </View>
        )}
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
  scrollContent: { paddingBottom: 100, paddingHorizontal: 16 },

  // Summary
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1, backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 14,
    alignItems: "center", gap: 6,
  },
  summaryValue: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  summaryLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: "600" },

  // Tabs
  tabRow: { flexDirection: "row", gap: 6, marginBottom: 16 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, backgroundColor: COLORS.darkSurface },
  tabBtnActive: { backgroundColor: COLORS.darkElevated, borderWidth: 1, borderColor: COLORS.coral },
  tabText: { fontSize: 12, fontWeight: "600", color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.coral },

  // Collab Card
  collabCard: {
    backgroundColor: COLORS.darkSurface, borderRadius: 16, padding: 16,
    marginBottom: 12, gap: 12,
  },
  collabHeader: { gap: 4 },
  collabNameRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  collabRestaurant: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  collabCuisine: { fontSize: 12, color: COLORS.textTertiary },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: "700" },
  collabMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  typeBadge: { backgroundColor: COLORS.darkElevated, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 11, fontWeight: "600", color: COLORS.textSecondary },
  collabBudget: { fontSize: 18, fontWeight: "700", color: COLORS.coral },
  collabSection: { gap: 4 },
  collabSectionLabel: { fontSize: 11, fontWeight: "700", color: COLORS.textTertiary, textTransform: "uppercase", letterSpacing: 0.5 },
  collabSectionText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  collabFooter: { gap: 10 },
  deadlineRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  deadlineText: { fontSize: 12, color: COLORS.textTertiary },
  actionRow: { flexDirection: "row", gap: 8 },
  acceptBtn: { flex: 1, backgroundColor: COLORS.coral, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  acceptBtnText: { fontSize: 13, fontWeight: "700", color: COLORS.white },
  declineBtn: {
    flex: 1, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
    paddingVertical: 10, borderRadius: 10, alignItems: "center",
  },
  declineBtnText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  chatBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: COLORS.darkElevated, paddingVertical: 10, borderRadius: 10 },
  chatBtnText: { fontSize: 13, fontWeight: "600", color: COLORS.coral },

  // Empty
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center" },
});
