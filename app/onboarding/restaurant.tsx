import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Store,
  MapPin,
  Phone,
  Globe,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Users,
  BarChart3,
  Star,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase";

const CUISINE_OPTIONS = [
  "Italian", "Japanese", "Mexican", "Thai", "American",
  "Indian", "Chinese", "Korean", "French", "Mediterranean",
  "Seafood", "BBQ", "Vegan", "Bakery", "Other",
];

const PERKS = [
  { icon: TrendingUp, text: "Get discovered by food lovers" },
  { icon: Users, text: "Creator reviews drive customers" },
  { icon: BarChart3, text: "Track referrals & analytics" },
  { icon: Star, text: "Build your reputation" },
];

export default function RestaurantOnboarding() {
  const { user, fetchProfile } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const toggleCuisine = (c: string) => {
    setCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleComplete = async () => {
    if (!user) return;
    if (!name.trim() || !address.trim() || !city.trim()) {
      Alert.alert("Missing Info", "Please fill in restaurant name, address, and city.");
      return;
    }

    setLoading(true);
    try {
      const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const { error } = await supabase
        .from("restaurants")
        .insert({
          owner_id: user.id,
          name: name.trim(),
          slug,
          description: description.trim() || null,
          cuisine_type: cuisines.length > 0 ? cuisines : ["Other"],
          address_line1: address.trim(),
          city: city.trim(),
          state: state.trim() || null,
          zip_code: zip.trim() || null,
          country: "US",
          latitude: 40.7484,
          longitude: -73.9967,
          phone: phone.trim() || null,
          website: website.trim() || null,
          price_level: 2,
          accepts_reservations: true,
          accepts_online_orders: true,
          is_active: true,
        } as any);

      if (error) throw error;

      await fetchProfile();
      Alert.alert(
        "Restaurant Created!",
        `${name.trim()} is now on ReelBite. Food creators can discover and review your restaurant.`,
        [{ text: "Let's Go", onPress: () => router.replace("/(tabs)/feed") }]
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create restaurant");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Welcome + basics
  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <LinearGradient
              colors={[COLORS.coral, "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconBadge}
            >
              <Store size={32} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.title}>List Your Restaurant</Text>
            <Text style={styles.subtitle}>
              Get discovered by thousands of food lovers
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.perksContainer}>
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <View key={perk.text} style={styles.perkRow}>
                  <View style={styles.perkIcon}>
                    <Icon size={18} color={COLORS.coral} />
                  </View>
                  <Text style={styles.perkText}>{perk.text}</Text>
                </View>
              );
            })}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.form}>
            <Text style={styles.label}>Restaurant Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bella Napoli"
              placeholderTextColor={COLORS.textTertiary}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell customers what makes your restaurant special..."
              placeholderTextColor={COLORS.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={300}
            />

            <Text style={styles.label}>Cuisine Type</Text>
            <View style={styles.cuisineGrid}>
              {CUISINE_OPTIONS.map((c) => (
                <Pressable
                  key={c}
                  style={[styles.cuisineChip, cuisines.includes(c) && styles.cuisineChipActive]}
                  onPress={() => toggleCuisine(c)}
                >
                  <Text
                    style={[styles.cuisineChipText, cuisines.includes(c) && styles.cuisineChipTextActive]}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          <Pressable
            style={styles.nextBtn}
            onPress={() => {
              if (!name.trim()) {
                Alert.alert("Required", "Please enter your restaurant name.");
                return;
              }
              setStep(2);
            }}
          >
            <Text style={styles.nextBtnText}>Next</Text>
            <ChevronRight size={20} color={COLORS.white} />
          </Pressable>

          <Pressable style={styles.skipBtn} onPress={() => router.replace("/(tabs)/feed")}>
            <Text style={styles.skipText}>Set up later</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 2: Location & Contact
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Pressable style={styles.backBtn} onPress={() => setStep(1)}>
          <ChevronLeft size={24} color={COLORS.white} />
        </Pressable>

        <Animated.View entering={FadeInDown.delay(100)} style={styles.stepHeader}>
          <Text style={styles.stepTitle}>Location & Contact</Text>
          <Text style={styles.stepSubtitle}>Help customers find you</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
          <Text style={styles.label}>Street Address</Text>
          <View style={styles.inputWithIcon}>
            <MapPin size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.inputInner}
              placeholder="123 Main Street"
              placeholderTextColor={COLORS.textTertiary}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 2 }}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="New York"
                placeholderTextColor={COLORS.textTertiary}
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="NY"
                placeholderTextColor={COLORS.textTertiary}
                value={state}
                onChangeText={setState}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>ZIP</Text>
              <TextInput
                style={styles.input}
                placeholder="10001"
                placeholderTextColor={COLORS.textTertiary}
                value={zip}
                onChangeText={setZip}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWithIcon}>
            <Phone size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.inputInner}
              placeholder="(555) 123-4567"
              placeholderTextColor={COLORS.textTertiary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.label}>Website (optional)</Text>
          <View style={styles.inputWithIcon}>
            <Globe size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.inputInner}
              placeholder="https://yourrestaurant.com"
              placeholderTextColor={COLORS.textTertiary}
              value={website}
              onChangeText={setWebsite}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </Animated.View>

        <Pressable
          style={[styles.completeBtn, loading && { opacity: 0.7 }]}
          onPress={handleComplete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.completeBtnText}>Create Restaurant</Text>
              <ChevronRight size={20} color={COLORS.white} />
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  header: { alignItems: "center", marginBottom: 24 },
  iconBadge: {
    width: 72, height: 72, borderRadius: 24,
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.white },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 8, textAlign: "center" },
  stepHeader: { marginBottom: 24 },
  stepTitle: { fontSize: 24, fontWeight: "800", color: COLORS.white },
  stepSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  perksContainer: {
    backgroundColor: COLORS.darkSurface, borderRadius: 16, padding: 16,
    gap: 12, marginBottom: 24,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  perkIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(16,185,129,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  perkText: { fontSize: 14, fontWeight: "600", color: COLORS.white },
  form: { gap: 8, marginBottom: 8 },
  label: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary, marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: COLORS.darkSurface, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    color: COLORS.white, fontSize: 15,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  inputWithIcon: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: COLORS.darkSurface, borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  inputInner: { flex: 1, color: COLORS.white, fontSize: 15, paddingVertical: 14 },
  row: { flexDirection: "row", gap: 10 },
  cuisineGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  cuisineChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.darkSurface,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  cuisineChipActive: {
    backgroundColor: "rgba(16,185,129,0.15)", borderColor: COLORS.coral,
  },
  cuisineChipText: { fontSize: 13, fontWeight: "600", color: COLORS.textSecondary },
  cuisineChipTextActive: { color: COLORS.coral },
  nextBtn: {
    flexDirection: "row", backgroundColor: COLORS.coral,
    height: 54, borderRadius: 14,
    alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: 20,
  },
  nextBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  completeBtn: {
    flexDirection: "row", backgroundColor: COLORS.coral,
    height: 54, borderRadius: 14,
    alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: 24,
  },
  completeBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  skipBtn: { alignItems: "center", paddingTop: 16 },
  skipText: { fontSize: 14, color: COLORS.textSecondary },
});
