import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, CheckCircle, Play, Grid3X3, DollarSign, ChevronRight, BarChart3, Handshake } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { formatCount } from "@/lib/utils";
import { MOCK_CREATORS, MOCK_VIDEOS, CREATOR_TIERS } from "@/lib/mock-data";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import CriticBadge from "@/components/creator/CriticBadge";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 2;
const THUMB_SIZE = (SCREEN_WIDTH - GRID_GAP * 2) / 3;

export default function CreatorProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const creator = MOCK_CREATORS.find((c) => c.profile.username === username) || MOCK_CREATORS[0];
  const creatorVideos = MOCK_VIDEOS.filter((v) => v.creator_id === creator.id);
  const [isFollowing, setIsFollowing] = useState(creator.is_following);
  const tier = CREATOR_TIERS[creator.id];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={creatorVideos}
        numColumns={3}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: GRID_GAP }}
        contentContainerStyle={{ gap: GRID_GAP, paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <View>
            {/* Header */}
            <View style={styles.header}>
              <Pressable style={styles.backBtn} onPress={() => router.back()}>
                <ArrowLeft size={22} color={COLORS.white} />
              </Pressable>
              <Text style={styles.headerUsername}>@{creator.profile.username}</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Profile Info */}
            <View style={styles.profileSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(creator.profile.display_name || creator.profile.username)[0].toUpperCase()}
                </Text>
              </View>

              <View style={styles.nameRow}>
                <Text style={styles.displayName}>
                  {creator.profile.display_name || creator.profile.username}
                </Text>
                {creator.is_verified && (
                  <CheckCircle size={18} color={COLORS.coral} fill={COLORS.coral} />
                )}
              </View>

              {/* Creator Tier Badge */}
              {tier && (
                <View style={styles.tierRow}>
                  <CriticBadge tier={tier} size="large" />
                </View>
              )}

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{formatCount(creator.total_followers)}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{formatCount(creator.total_likes)}</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{creator.total_videos}</Text>
                  <Text style={styles.statLabel}>Videos</Text>
                </View>
              </View>

              {/* Bio */}
              {creator.bio && <Text style={styles.bio}>{creator.bio}</Text>}

              {/* Follow Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.followBtn,
                  isFollowing && styles.followingBtn,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => setIsFollowing(!isFollowing)}
              >
                <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </Pressable>
            </View>

            {/* Creator Tools Section */}
            <View style={styles.toolsSection}>
              <Text style={styles.toolsSectionTitle}>Creator Tools</Text>

              {/* Earnings Card */}
              <Pressable
                style={styles.toolCard}
                onPress={() => router.push("/creator/earnings")}
              >
                <View style={styles.toolCardLeft}>
                  <View style={[styles.toolIcon, { backgroundColor: "rgba(34,197,94,0.12)" }]}>
                    <DollarSign size={18} color={COLORS.success} />
                  </View>
                  <View>
                    <Text style={styles.toolTitle}>Earnings</Text>
                    <Text style={styles.toolSubtitle}>Pay-per-sale & commissions</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={COLORS.textSecondary} />
              </Pressable>

              {/* Analytics Card */}
              <Pressable
                style={styles.toolCard}
                onPress={() => router.push("/creator/analytics")}
              >
                <View style={styles.toolCardLeft}>
                  <View style={[styles.toolIcon, { backgroundColor: "rgba(59,130,246,0.12)" }]}>
                    <BarChart3 size={18} color="#3B82F6" />
                  </View>
                  <View>
                    <Text style={styles.toolTitle}>Analytics</Text>
                    <Text style={styles.toolSubtitle}>Audience & performance insights</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={COLORS.textSecondary} />
              </Pressable>

              {/* Collaborations Card */}
              <Pressable
                style={styles.toolCard}
                onPress={() => router.push("/creator/collaborations")}
              >
                <View style={styles.toolCardLeft}>
                  <View style={[styles.toolIcon, { backgroundColor: "rgba(245,158,11,0.12)" }]}>
                    <Handshake size={18} color={COLORS.amber} />
                  </View>
                  <View>
                    <Text style={styles.toolTitle}>Collaborations</Text>
                    <Text style={styles.toolSubtitle}>Restaurant partnerships & sponsorships</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={COLORS.textSecondary} />
              </Pressable>
            </View>

            {/* Videos Grid Header */}
            <View style={styles.gridHeader}>
              <Grid3X3 size={20} color={COLORS.coral} />
              <Text style={styles.gridHeaderText}>Videos</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable style={styles.videoThumb}>
            <LinearGradient
              colors={[COLORS.darkElevated, COLORS.darkHover, COLORS.darkElevated]}
              style={styles.thumbGradient}
            >
              <Play size={24} color="rgba(255,255,255,0.6)" fill="rgba(255,255,255,0.3)" />
            </LinearGradient>
            <View style={styles.thumbOverlay}>
              <Play size={10} color={COLORS.white} fill={COLORS.white} />
              <Text style={styles.thumbViews}>{formatCount(item.view_count)}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyGrid}>
            <Text style={styles.emptyText}>No videos yet</Text>
          </View>
        )}
      />
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
  headerUsername: {
    fontSize: 16, fontWeight: "600", color: COLORS.white,
  },
  profileSection: {
    alignItems: "center", paddingHorizontal: 20, paddingBottom: 16,
  },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: COLORS.coral,
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: COLORS.dark,
  },
  avatarText: { fontSize: 36, fontWeight: "700", color: COLORS.white },
  nameRow: {
    flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14,
  },
  displayName: { fontSize: 22, fontWeight: "700", color: COLORS.white },
  tierRow: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row", gap: 32, marginTop: 16,
  },
  stat: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  bio: {
    fontSize: 14, color: COLORS.textSecondary,
    textAlign: "center", marginTop: 14, lineHeight: 20,
    paddingHorizontal: 20,
  },
  followBtn: {
    marginTop: 18, paddingVertical: 10, paddingHorizontal: 48,
    borderRadius: 12, backgroundColor: COLORS.coral,
  },
  followingBtn: {
    backgroundColor: "transparent",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.2)",
  },
  followBtnText: { fontSize: 15, fontWeight: "700", color: COLORS.white },
  followingBtnText: { color: COLORS.textSecondary },

  // Creator Tools
  toolsSection: {
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8,
  },
  toolsSectionTitle: {
    fontSize: 13, fontWeight: "700", color: COLORS.textTertiary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10,
  },
  toolCard: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 14,
    marginBottom: 8,
  },
  toolCardLeft: {
    flexDirection: "row", alignItems: "center", gap: 12,
  },
  toolIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  toolTitle: {
    fontSize: 14, fontWeight: "700", color: COLORS.white,
  },
  toolSubtitle: {
    fontSize: 11, color: COLORS.textSecondary, marginTop: 2,
  },

  // Grid
  gridHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 16, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)",
  },
  gridHeaderText: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  videoThumb: {
    width: THUMB_SIZE, height: THUMB_SIZE * 1.35,
    backgroundColor: COLORS.darkSurface, position: "relative",
  },
  thumbGradient: {
    flex: 1, alignItems: "center", justifyContent: "center",
  },
  thumbOverlay: {
    position: "absolute", bottom: 6, left: 6,
    flexDirection: "row", alignItems: "center", gap: 4,
  },
  thumbViews: { fontSize: 11, color: COLORS.white, fontWeight: "600" },
  emptyGrid: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 14, color: COLORS.textSecondary },
});
