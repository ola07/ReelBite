import React, { useEffect, useRef, useMemo } from "react";
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
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  Flame, ChevronRight, ChevronLeft, MapPin, Bell, Utensils,
  Heart, Sparkles, TrendingUp, Users, Star, Check,
  Video, Store,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { useOnboardingStore } from "@/stores/onboarding-store";

// ─── Data ──────────────────────────────────────────────────────────────────

const DISCOVERY_OPTIONS = [
  "TikTok / Instagram Reels", "Friends & Family", "Google Search",
  "Walking by restaurants", "Food blogs & reviews", "Other apps",
];

const CUISINE_OPTIONS = [
  { label: "Italian", emoji: "🍕" }, { label: "Japanese", emoji: "🍱" },
  { label: "Mexican", emoji: "🌮" }, { label: "Thai", emoji: "🍜" },
  { label: "Indian", emoji: "🍛" }, { label: "American", emoji: "🍔" },
  { label: "Chinese", emoji: "🥡" }, { label: "Korean", emoji: "🥘" },
  { label: "Mediterranean", emoji: "🥙" }, { label: "French", emoji: "🥐" },
  { label: "Seafood", emoji: "🦞" }, { label: "BBQ", emoji: "🔥" },
];

const VIBE_OPTIONS = [
  { label: "Date Night", emoji: "💕" }, { label: "Quick Bite", emoji: "⚡" },
  { label: "Group Hangout", emoji: "👯" }, { label: "Solo Dining", emoji: "🧘" },
  { label: "Family Meal", emoji: "👨‍👩‍👧‍👦" }, { label: "Late Night", emoji: "🌙" },
  { label: "Business Lunch", emoji: "💼" }, { label: "Celebration", emoji: "🎉" },
];

const DIETARY_OPTIONS = [
  { label: "No Restrictions", emoji: "✅" }, { label: "Vegetarian", emoji: "🥬" },
  { label: "Vegan", emoji: "🌱" }, { label: "Gluten-Free", emoji: "🌾" },
  { label: "Halal", emoji: "☪️" }, { label: "Kosher", emoji: "✡️" },
  { label: "Keto", emoji: "🥩" }, { label: "Dairy-Free", emoji: "🥛" },
];

const CRAVING_OPTIONS = [
  { label: "Spicy", emoji: "🌶️" }, { label: "Sweet", emoji: "🍰" },
  { label: "Savory", emoji: "🧂" }, { label: "Fresh & Light", emoji: "🥗" },
  { label: "Comfort Food", emoji: "🍲" }, { label: "Fried & Crispy", emoji: "🍟" },
  { label: "Grilled", emoji: "🔥" }, { label: "Raw & Clean", emoji: "🐟" },
];

const CONTENT_STYLE_OPTIONS = [
  { label: "Food Reviews", emoji: "⭐" }, { label: "Cooking Shows", emoji: "👨‍🍳" },
  { label: "ASMR / Mukbang", emoji: "🎧" }, { label: "Restaurant Tours", emoji: "🏪" },
  { label: "Street Food", emoji: "🛒" }, { label: "Fine Dining", emoji: "🍷" },
];

const BUDGET_LABELS = ["Budget-Friendly", "Moderate", "Upscale", "Fine Dining"];
const BUDGET_ICONS = ["$", "$$", "$$$", "$$$$"];

type UserRole = "foodie" | "creator" | "restaurant";

// ─── Step definitions per role ─────────────────────────────────────────────
// Each role gets a different set of steps after the shared intro

type StepId =
  | "welcome" | "social_proof" | "role_select"
  // Foodie path
  | "discovery" | "cuisines" | "vibes" | "budget" | "dietary" | "cravings" | "validation"
  // Creator path
  | "creator_cuisines" | "content_style" | "creator_validation"
  // Shared ending
  | "location" | "notifications" | "loading";

function getSteps(role: UserRole): StepId[] {
  const shared: StepId[] = ["welcome", "social_proof", "role_select"];
  const ending: StepId[] = ["location", "notifications", "loading"];

  switch (role) {
    case "foodie":
      return [...shared, "discovery", "cuisines", "vibes", "budget", "dietary", "cravings", "validation", ...ending];
    case "creator":
      return [...shared, "creator_cuisines", "content_style", "creator_validation", ...ending];
    case "restaurant":
      return [...shared, ...ending];
  }
}

// ─── Shared Components ─────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = ((step + 1) / total) * 100;
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

function OptionChip({ label, emoji, selected, onPress }: {
  label: string; emoji?: string; selected: boolean; onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      {emoji && <Text style={styles.chipEmoji}>{emoji}</Text>}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
      {selected && <Check size={16} color={COLORS.white} />}
    </Pressable>
  );
}

function SingleSelectOption({ label, selected, onPress }: {
  label: string; selected: boolean; onPress: () => void;
}) {
  return (
    <Pressable style={[styles.singleOption, selected && styles.singleOptionSelected]} onPress={onPress}>
      <Text style={[styles.singleOptionText, selected && styles.singleOptionTextSelected]}>{label}</Text>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
  );
}

function ContinueButton({ onPress, label = "Continue", disabled = false }: {
  onPress: () => void; label?: string; disabled?: boolean;
}) {
  return (
    <Pressable style={[styles.continueBtn, disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
      <Text style={styles.continueBtnText}>{label}</Text>
      <ChevronRight size={20} color={COLORS.white} />
    </Pressable>
  );
}

function RoleCard({ icon: Icon, title, desc, selected, onPress }: {
  icon: any; title: string; desc: string; selected: boolean; onPress: () => void;
}) {
  return (
    <Pressable style={[styles.roleCard, selected && styles.roleCardActive]} onPress={onPress}>
      <View style={[styles.roleIconBox, selected && styles.roleIconBoxActive]}>
        <Icon size={24} color={selected ? COLORS.white : COLORS.coral} />
      </View>
      <View style={styles.roleInfo}>
        <Text style={[styles.roleTitle, selected && styles.roleTitleActive]}>{title}</Text>
        <Text style={styles.roleDesc}>{desc}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
  );
}

function AutoAdvance({ onComplete, delay }: { onComplete: () => void; delay: number }) {
  const called = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!called.current) { called.current = true; onComplete(); }
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  return null;
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const store = useOnboardingStore();
  const {
    step, nextStep, prevStep, setStep,
    discoveryMethod, cuisines, vibes, budget, dietary, cravings,
    setAnswer, toggleArrayItem, completeOnboarding,
  } = store;

  const role = (store as any).role as UserRole | undefined;
  const contentStyles = ((store as any).contentStyles ?? []) as string[];
  const currentRole: UserRole = role ?? "foodie";

  const steps = useMemo(() => getSteps(currentRole), [currentRole]);
  const currentStepId = steps[step] ?? "welcome";
  const totalSteps = steps.length;

  const setRole = (r: UserRole) => setAnswer("role", r);
  const toggleContentStyle = (s: string) => toggleArrayItem("contentStyles", s);

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/auth/signup");
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace("/auth/signup");
  };

  const renderStep = () => {
    switch (currentStepId) {
      // ── Welcome ─────────────────────────────────────────────────────
      case "welcome":
        return (
          <Animated.View entering={FadeIn.duration(500)} style={styles.centerContent}>
            <LinearGradient colors={[COLORS.coral, "#059669"]} style={styles.logoBadge}>
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
                  <View style={styles.featureIcon}><f.icon size={18} color={COLORS.coral} /></View>
                  <Text style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>
            <ContinueButton onPress={nextStep} label="Let's Go" />
          </Animated.View>
        );

      // ── Social Proof ────────────────────────────────────────────────
      case "social_proof":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.centerContent}>
            <View style={styles.statCircle}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Restaurants</Text>
            </View>
            <Text style={styles.stepTitle}>Join thousands of food lovers</Text>
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

      // ── Role Selection ──────────────────────────────────────────────
      case "role_select":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>How will you use ReelBite?</Text>
            <Text style={styles.stepSubtitle}>This personalizes your experience</Text>
            <View style={styles.rolesContainer}>
              <RoleCard
                icon={Utensils} title="Food Lover"
                desc="Discover & order from amazing restaurants"
                selected={currentRole === "foodie"} onPress={() => setRole("foodie")}
              />
              <RoleCard
                icon={Video} title="Food Creator"
                desc="Post reviews, earn commissions & grow your audience"
                selected={currentRole === "creator"} onPress={() => setRole("creator")}
              />
              <RoleCard
                icon={Store} title="Restaurant Owner"
                desc="Get discovered & grow your business"
                selected={currentRole === "restaurant"} onPress={() => setRole("restaurant")}
              />
            </View>
            <ContinueButton onPress={() => {
              // Reset step to 3 (first step after role_select in the new steps array)
              // Since changing role changes the steps array, we just go to next
              nextStep();
            }} />
          </Animated.View>
        );

      // ── Foodie: Discovery ───────────────────────────────────────────
      case "discovery":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>How do you usually discover{"\n"}new restaurants?</Text>
            <Text style={styles.stepSubtitle}>This helps us personalize your feed</Text>
            <View style={styles.optionsList}>
              {DISCOVERY_OPTIONS.map((opt) => (
                <SingleSelectOption key={opt} label={opt} selected={discoveryMethod === opt}
                  onPress={() => setAnswer("discoveryMethod", opt)} />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={!discoveryMethod} />
          </Animated.View>
        );

      // ── Foodie: Cuisines ────────────────────────────────────────────
      case "cuisines":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What cuisines do you love?</Text>
            <Text style={styles.stepSubtitle}>Pick as many as you want</Text>
            <View style={styles.chipGrid}>
              {CUISINE_OPTIONS.map((opt) => (
                <OptionChip key={opt.label} label={opt.label} emoji={opt.emoji}
                  selected={cuisines.includes(opt.label)}
                  onPress={() => toggleArrayItem("cuisines", opt.label)} />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={cuisines.length === 0} />
          </Animated.View>
        );

      // ── Foodie: Vibes ───────────────────────────────────────────────
      case "vibes":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your dining vibe?</Text>
            <Text style={styles.stepSubtitle}>Select all that apply</Text>
            <View style={styles.chipGrid}>
              {VIBE_OPTIONS.map((opt) => (
                <OptionChip key={opt.label} label={opt.label} emoji={opt.emoji}
                  selected={vibes.includes(opt.label)}
                  onPress={() => toggleArrayItem("vibes", opt.label)} />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={vibes.length === 0} />
          </Animated.View>
        );

      // ── Foodie: Budget ──────────────────────────────────────────────
      case "budget":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your typical budget?</Text>
            <Text style={styles.stepSubtitle}>Per person, per meal</Text>
            <View style={styles.budgetGrid}>
              {BUDGET_LABELS.map((label, i) => (
                <Pressable key={label}
                  style={[styles.budgetCard, budget === i + 1 && styles.budgetCardSelected]}
                  onPress={() => setAnswer("budget", i + 1)}>
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

      // ── Foodie: Dietary ─────────────────────────────────────────────
      case "dietary":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Any dietary needs?</Text>
            <Text style={styles.stepSubtitle}>We'll filter restaurants for you</Text>
            <View style={styles.chipGrid}>
              {DIETARY_OPTIONS.map((opt) => (
                <OptionChip key={opt.label} label={opt.label} emoji={opt.emoji}
                  selected={dietary.includes(opt.label)}
                  onPress={() => toggleArrayItem("dietary", opt.label)} />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={dietary.length === 0} />
          </Animated.View>
        );

      // ── Foodie: Cravings ────────────────────────────────────────────
      case "cravings":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What are you craving?</Text>
            <Text style={styles.stepSubtitle}>Right now, in this moment</Text>
            <View style={styles.chipGrid}>
              {CRAVING_OPTIONS.map((opt) => (
                <OptionChip key={opt.label} label={opt.label} emoji={opt.emoji}
                  selected={cravings.includes(opt.label)}
                  onPress={() => toggleArrayItem("cravings", opt.label)} />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={cravings.length === 0} />
          </Animated.View>
        );

      // ── Foodie: Validation ──────────────────────────────────────────
      case "validation":
        return (
          <Animated.View entering={FadeIn.duration(600)} style={styles.centerContent}>
            <LinearGradient colors={[COLORS.coral, "#059669"]} style={styles.validationBadge}>
              <Check size={40} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.validationTitle}>Perfect taste!</Text>
            <Text style={styles.validationSubtitle}>
              You love {cuisines.slice(0, 3).join(", ")} food
              {vibes.length > 0 ? ` and ${vibes[0].toLowerCase()} vibes` : ""}.
              {"\n\n"}We'll find the best spots for you.
            </Text>
            <View style={styles.validationStat}>
              <Text style={styles.validationStatNumber}>{Math.floor(Math.random() * 50) + 120}</Text>
              <Text style={styles.validationStatLabel}>restaurants match your taste in your area</Text>
            </View>
            <ContinueButton onPress={nextStep} label="Find My Restaurants" />
          </Animated.View>
        );

      // ── Creator: Cuisines ───────────────────────────────────────────
      case "creator_cuisines":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What food do you review?</Text>
            <Text style={styles.stepSubtitle}>Pick your specialties</Text>
            <View style={styles.chipGrid}>
              {CUISINE_OPTIONS.map((opt) => (
                <OptionChip key={opt.label} label={opt.label} emoji={opt.emoji}
                  selected={cuisines.includes(opt.label)}
                  onPress={() => toggleArrayItem("cuisines", opt.label)} />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={cuisines.length === 0} />
          </Animated.View>
        );

      // ── Creator: Content Style ──────────────────────────────────────
      case "content_style":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your content style?</Text>
            <Text style={styles.stepSubtitle}>Restaurants will find you based on this</Text>
            <View style={styles.chipGrid}>
              {CONTENT_STYLE_OPTIONS.map((opt) => (
                <OptionChip key={opt.label} label={opt.label} emoji={opt.emoji}
                  selected={contentStyles.includes(opt.label)}
                  onPress={() => toggleContentStyle(opt.label)} />
              ))}
            </View>
            <ContinueButton onPress={nextStep} disabled={contentStyles.length === 0} />
          </Animated.View>
        );

      // ── Creator: Validation ─────────────────────────────────────────
      case "creator_validation":
        return (
          <Animated.View entering={FadeIn.duration(600)} style={styles.centerContent}>
            <LinearGradient colors={[COLORS.coral, "#059669"]} style={styles.validationBadge}>
              <Video size={40} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.validationTitle}>You're all set!</Text>
            <Text style={styles.validationSubtitle}>
              As a {cuisines.slice(0, 2).join(" & ")} creator, you'll get matched
              with restaurants looking for your style.
              {"\n\n"}Start earning from your very first review.
            </Text>
            <View style={styles.validationStat}>
              <Text style={styles.validationStatNumber}>$2,400</Text>
              <Text style={styles.validationStatLabel}>avg. monthly earnings for active creators</Text>
            </View>
            <ContinueButton onPress={nextStep} label="Start Creating" />
          </Animated.View>
        );

      // ── Location Permission ─────────────────────────────────────────
      case "location":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.centerContent}>
            <View style={styles.permissionIcon}><MapPin size={40} color={COLORS.coral} /></View>
            <Text style={styles.stepTitle}>Enable location</Text>
            <Text style={styles.stepSubtitle}>
              {currentRole === "restaurant"
                ? "Help customers find your restaurant"
                : "Find restaurants near you and see\nreal-time distance to every spot"}
            </Text>
            <ContinueButton onPress={async () => {
              await Location.requestForegroundPermissionsAsync();
              nextStep();
            }} label="Enable Location" />
            <Pressable style={styles.skipLink} onPress={nextStep}>
              <Text style={styles.skipText}>Not now</Text>
            </Pressable>
          </Animated.View>
        );

      // ── Notifications ───────────────────────────────────────────────
      case "notifications":
        return (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.centerContent}>
            <View style={styles.permissionIcon}><Bell size={40} color={COLORS.coral} /></View>
            <Text style={styles.stepTitle}>Stay in the loop</Text>
            <Text style={styles.stepSubtitle}>
              {currentRole === "restaurant"
                ? "Get notified when creators review\nyour restaurant"
                : currentRole === "creator"
                ? "Get notified about new campaigns,\npayouts, and submission updates"
                : "Get notified about new restaurants,\ndeals, and order updates"}
            </Text>
            <ContinueButton onPress={nextStep} label="Enable Notifications" />
            <Pressable style={styles.skipLink} onPress={nextStep}>
              <Text style={styles.skipText}>Not now</Text>
            </Pressable>
          </Animated.View>
        );

      // ── Loading ─────────────────────────────────────────────────────
      case "loading":
        return (
          <Animated.View entering={FadeIn.duration(500)} style={styles.centerContent}>
            <ActivityIndicator size="large" color={COLORS.coral} style={{ marginBottom: 24 }} />
            <Text style={styles.stepTitle}>
              {currentRole === "restaurant"
                ? "Setting up your restaurant..."
                : currentRole === "creator"
                ? "Building your creator profile..."
                : "Building your feed..."}
            </Text>
            <Text style={styles.stepSubtitle}>
              {currentRole === "restaurant"
                ? "Getting everything ready for\nyour restaurant"
                : "Personalizing recommendations\njust for you"}
            </Text>
            <Text style={styles.loadingDetail}>
              {currentRole === "foodie"
                ? "No two feeds are the same.\nYours is unique to your taste."
                : currentRole === "creator"
                ? "We'll match you with the best\ncampaigns and restaurants."
                : "Food creators are ready to\ndiscover your restaurant."}
            </Text>
            <AutoAdvance onComplete={handleComplete} delay={2500} />
          </Animated.View>
        );

      default:
        return null;
    }
  };

  const showNav = step > 0 && currentStepId !== "loading";

  return (
    <SafeAreaView style={styles.container}>
      {showNav && <ProgressBar step={step} total={totalSteps} />}
      {showNav && (
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
        key={`${currentRole}-${step}`}
      >
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  progressContainer: { paddingHorizontal: 24, paddingTop: 8 },
  progressTrack: { height: 4, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: COLORS.coral, borderRadius: 2 },

  topBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.darkElevated,
    alignItems: "center", justifyContent: "center",
  },
  skipTopText: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary },

  centerContent: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40 },
  stepContent: { paddingTop: 20 },

  // Hero
  logoBadge: { width: 88, height: 88, borderRadius: 28, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  heroTitle: { fontSize: 36, fontWeight: "800", color: COLORS.white, marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: COLORS.textSecondary, textAlign: "center", lineHeight: 24, marginBottom: 32 },
  featureList: { width: "100%", gap: 12, marginBottom: 40 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  featureIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center" },
  featureText: { fontSize: 15, fontWeight: "600", color: COLORS.white, flex: 1 },

  // Social proof
  statCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(16,185,129,0.12)", borderWidth: 2, borderColor: COLORS.coral, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  statNumber: { fontSize: 28, fontWeight: "800", color: COLORS.coral },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600" },
  proofRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.darkSurface, borderRadius: 16, padding: 20, marginTop: 24, marginBottom: 32, width: "100%" },
  proofItem: { flex: 1, alignItems: "center", gap: 6 },
  proofValue: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  proofLabel: { fontSize: 11, color: COLORS.textSecondary },
  proofDivider: { width: 1, height: 40, backgroundColor: "rgba(255,255,255,0.08)" },

  // Step titles
  stepTitle: { fontSize: 24, fontWeight: "800", color: COLORS.white, textAlign: "center", marginBottom: 8 },
  stepSubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center", marginBottom: 24, lineHeight: 20 },

  // Role selection
  rolesContainer: { gap: 12, marginBottom: 24 },
  roleCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: COLORS.darkSurface, borderRadius: 16, padding: 16,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.06)",
  },
  roleCardActive: { borderColor: COLORS.coral, backgroundColor: "rgba(16,185,129,0.06)" },
  roleIconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(16,185,129,0.1)", alignItems: "center", justifyContent: "center" },
  roleIconBoxActive: { backgroundColor: COLORS.coral },
  roleInfo: { flex: 1 },
  roleTitle: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  roleTitleActive: { color: COLORS.coral },
  roleDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Single select
  optionsList: { gap: 8, marginBottom: 24 },
  singleOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 16, borderWidth: 2, borderColor: "rgba(255,255,255,0.06)" },
  singleOptionSelected: { borderColor: COLORS.coral, backgroundColor: "rgba(16,185,129,0.06)" },
  singleOptionText: { fontSize: 15, fontWeight: "600", color: COLORS.white },
  singleOptionTextSelected: { color: COLORS.coral },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: COLORS.coral },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.coral },

  // Chip grid
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  chip: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: COLORS.darkSurface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 2, borderColor: "rgba(255,255,255,0.06)" },
  chipSelected: { borderColor: COLORS.coral, backgroundColor: "rgba(16,185,129,0.1)" },
  chipEmoji: { fontSize: 18 },
  chipText: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  chipTextSelected: { color: COLORS.coral },

  // Budget
  budgetGrid: { gap: 10, marginBottom: 24 },
  budgetCard: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 18, borderWidth: 2, borderColor: "rgba(255,255,255,0.06)" },
  budgetCardSelected: { borderColor: COLORS.coral, backgroundColor: "rgba(16,185,129,0.06)" },
  budgetIcon: { fontSize: 20, fontWeight: "800", color: COLORS.textSecondary, width: 50 },
  budgetIconSelected: { color: COLORS.coral },
  budgetLabel: { fontSize: 15, fontWeight: "600", color: COLORS.white, flex: 1 },
  budgetLabelSelected: { color: COLORS.coral },

  // Validation
  validationBadge: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  validationTitle: { fontSize: 28, fontWeight: "800", color: COLORS.white, marginBottom: 8 },
  validationSubtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: "center", lineHeight: 22, marginBottom: 24 },
  validationStat: { backgroundColor: COLORS.darkSurface, borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 32, width: "100%", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  validationStatNumber: { fontSize: 36, fontWeight: "800", color: COLORS.coral },
  validationStatLabel: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", marginTop: 4 },

  // Permissions
  permissionIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  skipLink: { marginTop: 16 },
  skipText: { fontSize: 14, color: COLORS.textSecondary },

  // Loading
  loadingDetail: { fontSize: 13, color: COLORS.textTertiary, textAlign: "center", marginTop: 16, lineHeight: 20 },

  // Continue button
  continueBtn: { flexDirection: "row", backgroundColor: COLORS.coral, height: 54, borderRadius: 14, width: "100%", alignItems: "center", justifyContent: "center", gap: 8 },
  continueBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
});
