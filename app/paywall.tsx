import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Crown,
  Check,
  X,
  Zap,
  Video,
  BarChart3,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { useSubscriptionStore } from "@/stores/subscription-store";

type SelectedPlan = "monthly" | "yearly";

const PRO_FEATURES = [
  { icon: Video, title: "Unlimited Uploads", desc: "Post unlimited video reviews to grow your audience" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track views, referrals, and conversion rates" },
  { icon: DollarSign, title: "Affiliate Earnings", desc: "Earn commissions when viewers order or reserve" },
  { icon: TrendingUp, title: "Performance Insights", desc: "See which videos drive the most business" },
  { icon: Users, title: "Brand Collaborations", desc: "Get matched with restaurants for paid partnerships" },
  { icon: Zap, title: "Priority Support", desc: "Dedicated support for creator accounts" },
];

export default function PaywallScreen() {
  const { startTrial, subscribe, plan } = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>("yearly");
  const [loading, setLoading] = useState(false);

  const hasUsedTrial = plan === "trial" || useSubscriptionStore.getState().trialStartDate !== null;

  const handleStartTrial = async () => {
    setLoading(true);
    await startTrial();
    setLoading(false);
    router.back();
  };

  const handleSubscribe = async () => {
    setLoading(true);
    await subscribe(selectedPlan);
    setLoading(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <Pressable style={styles.closeBtn} onPress={() => router.back()}>
        <X size={24} color={COLORS.white} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <LinearGradient
          colors={[COLORS.coral, "#059669", "#047857"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBadge}
        >
          <Crown size={32} color={COLORS.white} />
        </LinearGradient>

        <Text style={styles.heroTitle}>Creator Pro</Text>
        <Text style={styles.heroSubtitle}>
          Grow your audience and earn from every review
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {PRO_FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <feature.icon size={18} color={COLORS.coral} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
              <Check size={16} color={COLORS.coral} />
            </View>
          ))}
        </View>

        {/* Plan Cards */}
        <View style={styles.plansContainer}>
          <Pressable
            style={[
              styles.planCard,
              selectedPlan === "yearly" && styles.planCardActive,
            ]}
            onPress={() => setSelectedPlan("yearly")}
          >
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>SAVE 40%</Text>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Yearly</Text>
              <Text style={styles.planPrice}>$49.99</Text>
              <Text style={styles.planPer}>/year</Text>
            </View>
            <Text style={styles.planBreakdown}>$4.17/month</Text>
            <View
              style={[
                styles.planRadio,
                selectedPlan === "yearly" && styles.planRadioActive,
              ]}
            >
              {selectedPlan === "yearly" && (
                <View style={styles.planRadioDot} />
              )}
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.planCard,
              selectedPlan === "monthly" && styles.planCardActive,
            ]}
            onPress={() => setSelectedPlan("monthly")}
          >
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Monthly</Text>
              <Text style={styles.planPrice}>$6.99</Text>
              <Text style={styles.planPer}>/month</Text>
            </View>
            <Text style={styles.planBreakdown}>Billed monthly</Text>
            <View
              style={[
                styles.planRadio,
                selectedPlan === "monthly" && styles.planRadioActive,
              ]}
            >
              {selectedPlan === "monthly" && (
                <View style={styles.planRadioDot} />
              )}
            </View>
          </Pressable>
        </View>

        {/* CTA Buttons */}
        {!hasUsedTrial && (
          <Pressable
            style={[styles.ctaButton, styles.ctaTrialButton]}
            onPress={handleStartTrial}
            disabled={loading}
          >
            <LinearGradient
              colors={[COLORS.coral, "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Zap size={20} color={COLORS.white} />
              <Text style={styles.ctaText}>Start 7-Day Free Trial</Text>
            </LinearGradient>
          </Pressable>
        )}

        <Pressable
          style={[
            styles.ctaButton,
            hasUsedTrial ? styles.ctaTrialButton : styles.ctaSubscribeButton,
          ]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {hasUsedTrial ? (
            <LinearGradient
              colors={[COLORS.coral, "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Crown size={20} color={COLORS.white} />
              <Text style={styles.ctaText}>
                Subscribe {selectedPlan === "yearly" ? "$49.99/yr" : "$6.99/mo"}
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.ctaOutline}>
              <Text style={styles.ctaOutlineText}>
                Subscribe {selectedPlan === "yearly" ? "$49.99/yr" : "$6.99/mo"}
              </Text>
            </View>
          )}
        </Pressable>

        <Text style={styles.termsText}>
          Cancel anytime. Keep 100% of your earnings.
          {"\n"}ReelBite never takes a cut of your commissions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  closeBtn: {
    position: "absolute",
    top: 56,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  heroBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  featuresContainer: {
    width: "100%",
    gap: 4,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.darkSurface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(16,185,129,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.white,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  plansContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.06)",
  },
  planCardActive: {
    borderColor: COLORS.coral,
    backgroundColor: "rgba(16,185,129,0.06)",
  },
  planBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: COLORS.coral,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
  },
  planInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  planName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginRight: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.white,
  },
  planPer: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  planBreakdown: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 12,
  },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  planRadioActive: {
    borderColor: COLORS.coral,
  },
  planRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.coral,
  },
  ctaButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  ctaTrialButton: {},
  ctaSubscribeButton: {},
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  ctaOutline: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaOutlineText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
});
