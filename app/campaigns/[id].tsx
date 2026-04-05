import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Hash,
  FileText,
  Send,
  Trophy,
  Briefcase,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/lib/constants";
import {
  formatDeadline,
  formatBudget,
  getCampaignTypeColor,
  calculateCreatorPayout,
} from "@/lib/campaign-utils";
import {
  useCampaign,
  useCampaignSubmissions,
  useSubmitToCampaign,
} from "@/hooks/use-campaigns";
import SubmissionCard from "@/components/campaigns/SubmissionCard";

export default function CampaignDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: campaign, isLoading } = useCampaign(id);
  const { data: submissions } = useCampaignSubmissions(id);
  const submitMutation = useSubmitToCampaign();

  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [caption, setCaption] = useState("");
  const [bid, setBid] = useState("");

  const typeColor = campaign ? getCampaignTypeColor(campaign.type) : COLORS.coral;

  const handleSubmit = async () => {
    if (!campaign) return;

    // In production, this would open expo-image-picker for video selection
    // For now, use a placeholder URL
    const videoUrl = "https://assets.mixkit.co/videos/44001/44001-720.mp4";

    try {
      await submitMutation.mutateAsync({
        campaignId: campaign.id,
        videoUrl,
        caption: caption.trim() || undefined,
        proposedBid: bid ? parseFloat(bid) : undefined,
      });

      Alert.alert("Submitted!", "Your submission is under review.");
      setShowSubmitForm(false);
      setCaption("");
      setBid("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to submit");
    }
  };

  if (isLoading || !campaign) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.coral} />
        </View>
      </SafeAreaView>
    );
  }

  const reqs = campaign.requirements || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={22} color={COLORS.white} />
          </Pressable>
        </View>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <LinearGradient
            colors={[typeColor + "30", COLORS.darkSurface]}
            style={styles.heroCard}
          >
            <View style={[styles.typeBadge, { backgroundColor: typeColor + "20" }]}>
              {campaign.type === "deal" ? (
                <Briefcase size={14} color={typeColor} />
              ) : (
                <Trophy size={14} color={typeColor} />
              )}
              <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                {campaign.type === "deal" ? "Brand Deal" : "Contest"}
              </Text>
            </View>

            <Text style={styles.title}>{campaign.title}</Text>
            <Text style={styles.restaurant}>{campaign.restaurant?.name}</Text>

            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <DollarSign size={16} color={COLORS.coral} />
                <Text style={styles.heroStatValue}>
                  {formatBudget(campaign.budget, campaign.type)}
                </Text>
              </View>
              <View style={styles.heroStat}>
                <Clock size={16} color={COLORS.textSecondary} />
                <Text style={styles.heroStatValue}>
                  {formatDeadline(campaign.deadline)}
                </Text>
              </View>
              <View style={styles.heroStat}>
                <Users size={16} color={COLORS.textSecondary} />
                <Text style={styles.heroStatValue}>
                  {submissions?.length ?? 0} submissions
                </Text>
              </View>
            </View>

            {campaign.type === "deal" && (
              <Text style={styles.payoutNote}>
                You'll earn ${calculateCreatorPayout(campaign.budget).toFixed(0)} per video (after 15% platform fee)
              </Text>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Description */}
        {campaign.description && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>About This Campaign</Text>
            <Text style={styles.description}>{campaign.description}</Text>
          </Animated.View>
        )}

        {/* Requirements */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.reqsCard}>
            {reqs.min_duration_sec && (
              <View style={styles.reqRow}>
                <Clock size={14} color={COLORS.textSecondary} />
                <Text style={styles.reqText}>
                  Video: {reqs.min_duration_sec}s - {reqs.max_duration_sec || 60}s
                </Text>
              </View>
            )}
            {reqs.hashtags?.length > 0 && (
              <View style={styles.reqRow}>
                <Hash size={14} color={COLORS.textSecondary} />
                <Text style={styles.reqText}>
                  Hashtags: {reqs.hashtags.map((h: string) => `#${h}`).join(" ")}
                </Text>
              </View>
            )}
            {reqs.must_include?.length > 0 && (
              <View style={styles.reqRow}>
                <FileText size={14} color={COLORS.textSecondary} />
                <Text style={styles.reqText}>
                  Must include: {reqs.must_include.join(", ")}
                </Text>
              </View>
            )}
            {reqs.style_notes && (
              <View style={styles.reqRow}>
                <FileText size={14} color={COLORS.textSecondary} />
                <Text style={styles.reqText}>{reqs.style_notes}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Contest Leaderboard */}
        {campaign.type === "contest" && submissions && submissions.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            {submissions.slice(0, 10).map((sub, index) => (
              <View key={sub.id} style={styles.leaderRow}>
                <Text style={[
                  styles.leaderRank,
                  index === 0 && { color: "#FFD700" },
                  index === 1 && { color: "#C0C0C0" },
                  index === 2 && { color: "#CD7F32" },
                ]}>
                  #{index + 1}
                </Text>
                <View style={styles.leaderInfo}>
                  <Text style={styles.leaderName}>
                    @{sub.creator?.username ?? "creator"}
                  </Text>
                </View>
                <View style={styles.leaderStats}>
                  <Eye size={12} color={COLORS.textTertiary} />
                  <Text style={styles.leaderStatText}>
                    {sub.views_count.toLocaleString()}
                  </Text>
                  <TrendingUp size={12} color={COLORS.textTertiary} />
                  <Text style={styles.leaderStatText}>
                    {sub.engagement_score.toFixed(1)}
                  </Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Submit Form */}
        {showSubmitForm && (
          <Animated.View entering={FadeInDown} style={styles.submitForm}>
            <Text style={styles.sectionTitle}>Submit Your Video</Text>
            <TextInput
              style={styles.input}
              placeholder="Caption for your video..."
              placeholderTextColor={COLORS.textTertiary}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={200}
            />
            {campaign.type === "deal" && (
              <TextInput
                style={styles.input}
                placeholder="Your bid price ($)"
                placeholderTextColor={COLORS.textTertiary}
                value={bid}
                onChangeText={setBid}
                keyboardType="numeric"
              />
            )}
            <Pressable
              style={[styles.submitBtn, submitMutation.isPending && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Send size={18} color={COLORS.white} />
                  <Text style={styles.submitBtnText}>Submit Video</Text>
                </>
              )}
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      {!showSubmitForm && (
        <View style={styles.bottomCta}>
          <Pressable
            style={styles.ctaBtn}
            onPress={() => setShowSubmitForm(true)}
          >
            <Send size={18} color={COLORS.white} />
            <Text style={styles.ctaBtnText}>Submit Video</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { paddingHorizontal: 16, paddingVertical: 8 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center", justifyContent: "center",
  },
  heroCard: {
    marginHorizontal: 16, borderRadius: 20, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  typeBadge: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12,
  },
  typeBadgeText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.white, marginBottom: 4 },
  restaurant: { fontSize: 15, fontWeight: "600", color: COLORS.coral, marginBottom: 16 },
  heroStats: { flexDirection: "row", gap: 16, marginBottom: 12 },
  heroStat: { flexDirection: "row", alignItems: "center", gap: 6 },
  heroStatValue: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  payoutNote: {
    fontSize: 12, color: COLORS.coral, fontWeight: "600",
    backgroundColor: "rgba(16,185,129,0.1)",
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginTop: 4,
  },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.white, marginBottom: 10 },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  reqsCard: {
    backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 14, gap: 10,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  reqRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  reqText: { fontSize: 13, color: COLORS.textSecondary, flex: 1 },
  leaderRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: COLORS.darkSurface, borderRadius: 12, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.04)",
  },
  leaderRank: { fontSize: 16, fontWeight: "800", color: COLORS.textSecondary, width: 30 },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  leaderStats: { flexDirection: "row", alignItems: "center", gap: 4 },
  leaderStatText: { fontSize: 12, color: COLORS.textTertiary },
  submitForm: { paddingHorizontal: 16, marginBottom: 20 },
  input: {
    backgroundColor: COLORS.darkSurface, borderRadius: 12, padding: 14,
    color: COLORS.white, fontSize: 15, marginBottom: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  submitBtn: {
    flexDirection: "row", backgroundColor: COLORS.coral, height: 50,
    borderRadius: 14, alignItems: "center", justifyContent: "center", gap: 8,
  },
  submitBtnText: { fontSize: 15, fontWeight: "700", color: COLORS.white },
  bottomCta: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 32,
    backgroundColor: COLORS.dark, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)",
  },
  ctaBtn: {
    flexDirection: "row", backgroundColor: COLORS.coral, height: 54,
    borderRadius: 14, alignItems: "center", justifyContent: "center", gap: 8,
  },
  ctaBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
});
