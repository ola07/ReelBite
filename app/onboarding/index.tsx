import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import {
  Flame,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Bell,
  Utensils,
  Heart,
  Sparkles,
  TrendingUp,
  Users,
  Star,
  DollarSign,
  Check,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { useOnboardingStore } from "@/stores/onboarding-store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Data ──────────────────────────────────────────────────────────────────

const DISCOVERY_OPTIONS = [
  "TikTok / Instagram Reels",
  "Friends & Family",
  "Google Search",
  "Walking by restaurants",
  "Food blogs & reviews",
  "Other apps",
];

const CUISINE_OPTIONS = [
  { label: "Italian", emoji: "🍕" },
  { label: "Japanese", emoji: "🍱" },
  { label: "Mexican", emoji: "🌮" },
  { label: "Thai", emoji: "🍜" },
  { label: "Indian", emoji: "🍛" },
  { label: "American", emoji: "🍔" },
  { label: "Chinese", emoji: "🥡" },
  { label: "Korean", emoji: "🥘" },
  { label: "Mediterranean", emoji: "🥙" },
  { label: "French", emoji: "🥐" },
  { label: "Seafood", emoji: "🦞" },
  { label: "BBQ", emoji: "🔥" },
];

const VIBE_OPTIONS = [
  { label: "Date Night", emoji: "💕" },
  { label: "Quick Bite", emoji: "⚡" },
  { label: "Group Hangout", emoji: "👯" },
  { label: "Solo Dining", emoji: "🧘" },
  { label: "Family Meal", emoji: "👨‍👩‍👧‍👦" },
  { label: "Late Night", emoji: "🌙" },
  { label: "Business Lunch", emoji: "💼" },
  { label: "Celebration", emoji: "🎉" },
];

const DIETARY_OPTIONS = [
  { label: "No Restrictions", emoji: "✅" },
  { label: "Vegetarian", emoji: "🥬" },
  { label: "Vegan", emoji: "🌱" },
  { label: "Gluten-Free", emoji: "🌾" },
  { label: "Halal", emoji: "☪️" },
  { label: "Kosher", emoji: "✡️" },
  { label: "Keto", emoji: "🥩" },
  { label: "Dairy-Free", emoji: "🥛" },
];

const CRAVING_OPTIONS = [
  { label: "Spicy", emoji: "🌶️" },
  { label: "Sweet", emoji: "🍰" },
  { label: "Savory", emoji: "🧂" },
  { label: "Fresh & Light", emoji: "🥗" },
  { label: "Comfort Food", emoji: "🍲" },
  { label: "Fried & Crispy", emoji: "🍟" },
  { label: "Grilled", emoji: "🔥" },
  { label: "Raw & Clean", emoji: "🐟" },
];

const BUDGET_LABELS = ["Budget-Friendly", "Moderate", "Upscale", "Fine Dining"];
const BUDGET_ICONS = ["$", "$$", "$$$", "$$$$"];

// ─── Shared Components ─────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = ((step + 1) / total) * 100;
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressFill, { width: `${progress}%` }]}
        />
      </View>
    </View>
  );
}

function OptionChip({
  label,
  emoji,
  selected,
  onPress,
}: {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      {emoji && <Text style={styles.chipEmoji}>{emoji}</Text>}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
      {selected && <Check size={16} color={COLORS.white} />}
    </Pressable>
  );
}

function SingleSelectOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.singleOption, selected && styles.singleOptionSelected]}
      onPress={onPress}
    >
      <Text style={[styles.singleOptionText, selected && styles.singleOptionTextSelected]}>
        {label}
      </Text>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
  );
}

function ContinueButton({
  onPress,
  label = "Continue",
  disabled = false,
}: {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={[styles.continueBtn, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.continueBtnText}>{label}</Text>
      <ChevronRight size={20} color={COLORS.white} />
    </Pressable>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const {
    step, nextStep, prevStep, setStep,
    discoveryMethod, cuisines, vibes, budget, dietary, cravings,
    setAnswer, toggleArrayItem, completeOnboarding,
  } = useOnboardingStore();

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/auth/signup");
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/auth/signup");
  };

  const renderStep = () => {
    switch (step) {
      // ── Step 0: Welcome ─────────────────────────────────────────────
      case 0:
        return (
          <Animated.View entering={FadeIn.duration(500)} style={styles.centerContent}>
            <LinearGradient
              colors={[COLORS.coral, "#059669"]}
              style={styles.logoBadge}
            >
              <Flame size={48} color={COLORS.white} fill={COLORS.white} />
            </LinearGradient>
            <Text style={styles.heroTitle}>ReelBite</Text>
            <Text style={styles.heroSubtitle}>
              Discover restaurants through{"\n"}short-form video reviews
            </Text>

            <View style={styles.featureList}>
              {[
                { icon: Sparkles, text: "Watch real food reviews from creators" },
                { icon: MapPin, text: "Find restaurants near you" },
                { icon: Utensils, text: "Order & reserve in seconds" },
                { icon: TrendingUp, text: "Earn money as a food creator" },
              ].map((f) => (
                <View key={f.text} style={styles.featureRow}>
                  <View style={styles.featureIcon}>
                    <f.icon size={18} color={COLORS.coral} />
                  </View>
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>

            <ContinueButton onPress={nextStep} label="Let's Go" />
          </Animated.View>
        );

      // ── Step 1: Social Proof ────────────────────────────────────────
      case 1:
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.centerContent}>
            <View style={styles.statCircle}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Restaurants</Text>
            </View>
            <Text style={styles.stepTitle}>
              Join thousands of food lovers
            </Text>
            <Text style={styles.stepSubtitle}>
              92% of ReelBite users discover a new favorite restaurant in their first week
            </Text>

            <View style={styles.proofRow}>
              <View style={styles.proofItem}>
                <Star size={20} color="#FFD700" fill="#FFD700" />
                <Text style={styles.proofValue}>4.8</Text>
                <Text style={styles.proofLabel}>App Rating</Text>
              </View>
              <View style={styles.proofDivider} />
              <View style={styles.proofItem}>
                <Users size={20} color={COLORS.coral} />
                <Text style={styles.proofValue}>50K+</Text>
                <Text style={styles.proofLabel}>Users</Text>
              </View>
              <View style={styles.proofDivider} />
              <View style={styles.proofItem}>
                <Heart size={20} color="#EF4444" fill="#EF4444" />
                <Text style={styles.proofValue}>1M+</Text>
                <Text style={styles.proofLabel}>Reviews</Text>
              </View>
            </View>

            <ContinueButton onPress={nextStep} />
          </Animated.View>
        );

      // ── Step 2: Discovery Method ────────────────────────────────────
      case 2:
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>How do you usually discover{"\n"}new restaurants?</Text>
            <Text style={styles.stepSubtitle}>This helps us personalize your experience</Text>
            <View style={styles.optionsList}>
              {DISCOVERY_OPTIONS.map((opt) => (
                <SingleSelectOption
                  key={opt}
                  label={opt}
                  selected={discoveryMethod === opt}
                  onPress={() => setAnswer("discoveryMethod", opt)}
                />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={!discoveryMethod} />
          </Animated.View>
        );

      // ── Step 3: Cuisines ────────────────────────────────────────────
      case 3:
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What cuisines do you love?</Text>
            <Text style={styles.stepSubtitle}>Pick as many as you want</Text>
            <View style={styles.chipGrid}>
              {CUISINE_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt.label}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={cuisines.includes(opt.label)}
                  onPress={() => toggleArrayItem("cuisines", opt.label)}
                />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={cuisines.length === 0} />
          </Animated.View>
        );

      // ── Step 4: Vibes ───────────────────────────────────────────────
      case 4:
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your dining vibe?</Text>
            <Text style={styles.stepSubtitle}>Select all that apply</Text>
            <View style={styles.chipGrid}>
              {VIBE_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt.label}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={vibes.includes(opt.label)}
                  onPress={() => toggleArrayItem("vibes", opt.label)}
                />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={vibes.length === 0} />
          </Animated.View>
        );

      // ── Step 5: Budget ──────────────────────────────────────────────
      case 5:
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your typical budget?</Text>
            <Text style={styles.stepSubtitle}>Per person, per meal</Text>
            <View style={styles.budgetGrid}>
              {BUDGET_LABELS.map((label, i) => (
                <Pressable
                  key={label}
                  style={[styles.budgetCard, budget === i + 1 && styles.budgetCardSelected]}
                  onPress={() => setAnswer("budget", i + 1)}
                >
                  <Text style={[styles.budgetIcon, budget === i + 1 && styles.budgetIconSelected]}>
                    {BUDGET_ICONS[i]}
                  </Text>
                  <Text style={[styles.budgetLabel, budget === i + 1 && styles.budgetLabelSelected]}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <ContinueButton onPress={nextStep} />
          </Animated.View>
        );

      // ── Step 6: Dietary ─────────────────────────────────────────────
      case 6:
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Any dietary needs?</Text>
            <Text style={styles.stepSubtitle}>We'll filter restaurants for you</Text>
            <View style={styles.chipGrid}>
              {DIETARY_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt.label}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={dietary.includes(opt.label)}
                  onPress={() => toggleArrayItem("dietary", opt.label)}
                />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={dietary.length === 0} />
          </Animated.View>
        );

      // ── Step 7: Cravings ────────────────────────────────────────────
      case 7:
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What are you craving?</Text>
            <Text style={styles.stepSubtitle}>Right now, in this moment</Text>
            <View style={styles.chipGrid}>
              {CRAVING_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt.label}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={cravings.includes(opt.label)}
                  onPress={() => toggleArrayItem("cravings", opt.label)}
                />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={cravings.length === 0} />
          </Animated.View>
        );

      // ── Step 8: Validation ──────────────────────────────────────────
      case 8:
        return (
          <Animated.View entering={FadeIn.duration(600)} style={styles.centerContent}>
            <LinearGradient
              colors={[COLORS.coral, "#059669"]}
              style={styles.validationBadge}
            >
              <Check size={40} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.validationTitle}>Perfect taste!</Text>
            <Text style={styles.validationSubtitle}>
              You love {cuisines.slice(0, 3).join(", ")} food
              {vibes.length > 0 ? ` and ${vibes[0].toLowerCase()} vibes` : ""}.
              {"\n\n"}We'll find the best spots for you.
            </Text>
            <View style={styles.validationStat}>
              <Text style={styles.validationStatNumber}>
                {Math.floor(Math.random() * 50) + 120}
              </Text>
              <Text style={styles.validationStatLabel}>
                restaurants match your taste in your area
              </Text>
            </View>
            <ContinueButton onPress={nextStep} label="Find My Restaurants" />
          </Animated.View>
        );

      // ── Step 9: Location Permission ─────────────────────────────────
      case 9:
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.centerContent}>
            <View style={styles.permissionIcon}>
              <MapPin size={40} color={COLORS.coral} />
            </View>
            <Text style={styles.stepTitle}>Enable location</Text>
            <Text style={styles.stepSubtitle}>
              Find restaurants near you and see{"\n"}real-time distance to every spot
            </Text>
            <ContinueButton
              onPress={async () => {
                await Location.requestForegroundPermissionsAsync();
                nextStep();
              }}
              label="Enable Location"
            />
            <Pressable style={styles.skipLink} onPress={nextStep}>
              <Text style={styles.skipText}>Not now</Text>
            </Pressable>
          </Animated.View>
        );

      // ── Step 10: Notifications ──────────────────────────────────────
      case 10:
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.centerContent}>
            <View style={styles.permissionIcon}>
              <Bell size={40} color={COLORS.coral} />
            </View>
            <Text style={styles.stepTitle}>Stay in the loop</Text>
            <Text style={styles.stepSubtitle}>
              Get notified about new restaurants,{"\n"}deals, and order updates
            </Text>
            <ContinueButton
              onPress={nextStep}
              label="Enable Notifications"
            />
            <Pressable style={styles.skipLink} onPress={nextStep}>
              <Text style={styles.skipText}>Not now</Text>
            </Pressable>
          </Animated.View>
        );

      // ── Step 11: Building Feed (Loading) ────────────────────────────
      case 11:
        return (
          <Animated.View entering={FadeIn.duration(500)} style={styles.centerContent}>
            <ActivityIndicator size="large" color={COLORS.coral} style={{ marginBottom: 24 }} />
            <Text style={styles.stepTitle}>Building your feed...</Text>
            <Text style={styles.stepSubtitle}>
              Personalizing recommendations{"\n"}just for you
            </Text>
            <Text style={styles.loadingDetail}>
              No two feeds are the same.{"\n"}Yours is unique to your taste.
            </Text>
            {/* Auto-advance after 2.5 seconds */}
            <AutoAdvance onComplete={handleComplete} delay={2500} />
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      {step > 0 && step < 11 && <ProgressBar step={step} total={12} />}

      {/* Back + Skip */}
      {step > 0 && step < 11 && (
        <View style={styles.topBar}>
          <Pressable style={styles.backBtn} onPress={prevStep}>
            <ChevronLeft size={24} color={COLORS.white} />
          </Pressable>
          <Pressable onPress={handleSkip}>
            <Text style={styles.skipTopText}>Skip</Text>
          </Pressable>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        key={step}
      >
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
}

function AutoAdvance({ onComplete, delay }: { onComplete: () => void; delay: number }) {
  const called = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!called.current) {
        called.current = true;
        onComplete();
      }
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  return null;
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  // Progress
  progressContainer: { paddingHorizontal: 24, paddingTop: 8 },
  progressTrack: {
    height: 4, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 2,
  },
  progressFill: {
    height: 4, backgroundColor: COLORS.coral, borderRadius: 2,
  },

  // Top bar
  topBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center", justifyContent: "center",
  },
  skipTopText: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary },

  // Center content
  centerContent: {
    flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40,
  },

  // Step content
  stepContent: { paddingTop: 20 },

  // Hero (Step 0)
  logoBadge: {
    width: 88, height: 88, borderRadius: 28,
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  heroTitle: { fontSize: 36, fontWeight: "800", color: COLORS.white, marginBottom: 8 },
  heroSubtitle: {
    fontSize: 16, color: COLORS.textSecondary,
    textAlign: "center", lineHeight: 24, marginBottom: 32,
  },
  featureList: { width: "100%", gap: 12, marginBottom: 40 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  featureIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(16,185,129,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  featureText: { fontSize: 15, fontWeight: "600", color: COLORS.white, flex: 1 },

  // Social Proof (Step 1)
  statCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(16,185,129,0.12)",
    borderWidth: 2, borderColor: COLORS.coral,
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  statNumber: { fontSize: 28, fontWeight: "800", color: COLORS.coral },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600" },
  proofRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.darkSurface, borderRadius: 16, padding: 20,
    marginTop: 24, marginBottom: 32, width: "100%",
  },
  proofItem: { flex: 1, alignItems: "center", gap: 6 },
  proofValue: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  proofLabel: { fontSize: 11, color: COLORS.textSecondary },
  proofDivider: { width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.08)" },

  // Step titles
  stepTitle: {
    fontSize: 24, fontWeight: "800", color: COLORS.white,
    textAlign: "center", marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14, color: COLORS.textSecondary,
    textAlign: "center", marginBottom: 24, lineHeight: 20,
  },

  // Single select options
  optionsList: { gap: 8, marginBottom: 24 },
  singleOption: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 16,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.06)",
  },
  singleOptionSelected: {
    borderColor: COLORS.coral, backgroundColor: "rgba(16,185,129,0.06)",
  },
  singleOptionText: { fontSize: 15, fontWeight: "600", color: COLORS.white },
  singleOptionTextSelected: { color: COLORS.coral },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  radioSelected: { borderColor: COLORS.coral },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.coral },

  // Chip grid
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: COLORS.darkSurface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.06)",
  },
  chipSelected: {
    borderColor: COLORS.coral, backgroundColor: "rgba(16,185,129,0.1)",
  },
  chipEmoji: { fontSize: 18 },
  chipText: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  chipTextSelected: { color: COLORS.coral },

  // Budget
  budgetGrid: { gap: 10, marginBottom: 24 },
  budgetCard: {
    flexDirection: "row", alignItems: "center", gap: 16,
    backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 18,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.06)",
  },
  budgetCardSelected: {
    borderColor: COLORS.coral, backgroundColor: "rgba(16,185,129,0.06)",
  },
  budgetIcon: { fontSize: 20, fontWeight: "800", color: COLORS.textSecondary, width: 50 },
  budgetIconSelected: { color: COLORS.coral },
  budgetLabel: { fontSize: 15, fontWeight: "600", color: COLORS.white, flex: 1 },
  budgetLabelSelected: { color: COLORS.coral },

  // Validation
  validationBadge: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  validationTitle: { fontSize: 28, fontWeight: "800", color: COLORS.white, marginBottom: 8 },
  validationSubtitle: {
    fontSize: 15, color: COLORS.textSecondary,
    textAlign: "center", lineHeight: 22, marginBottom: 24,
  },
  validationStat: {
    backgroundColor: COLORS.darkSurface, borderRadius: 16, padding: 20,
    alignItems: "center", marginBottom: 32, width: "100%",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  validationStatNumber: { fontSize: 36, fontWeight: "800", color: COLORS.coral },
  validationStatLabel: {
    fontSize: 13, color: COLORS.textSecondary, textAlign: "center", marginTop: 4,
  },

  // Permission screens
  permissionIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(16,185,129,0.12)",
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  skipLink: { marginTop: 16 },
  skipText: { fontSize: 14, color: COLORS.textSecondary },

  // Loading
  loadingDetail: {
    fontSize: 13, color: COLORS.textTertiary,
    textAlign: "center", marginTop: 16, lineHeight: 20,
  },

  // Continue button
  continueBtn: {
    flexDirection: "row", backgroundColor: COLORS.coral,
    height: 54, borderRadius: 14, width: "100%",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  continueBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
});
