import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Flame,
  Utensils,
  Video,
  Store,
  ChevronRight,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuthStore } from "@/stores/auth-store";
import { signInWithGoogle, signInWithApple } from "@/lib/social-auth";
import { GoogleIcon, AppleIcon } from "@/components/shared/SocialIcons";

type UserRole = "foodie" | "creator" | "restaurant";

const ROLES: { key: UserRole; icon: any; title: string; desc: string }[] = [
  { key: "foodie", icon: Utensils, title: "Food Lover", desc: "Discover & order from amazing restaurants" },
  { key: "creator", icon: Video, title: "Food Creator", desc: "Post reviews & earn from your audience" },
  { key: "restaurant", icon: Store, title: "Restaurant Owner", desc: "Get discovered & grow your business" },
];

export default function SignupScreen() {
  const [step, setStep] = useState<"role" | "form">("role");
  const [role, setRole] = useState<UserRole>("foodie");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const signUp = useAuthStore((s) => s.signUp);

  const getRedirectPath = () => {
    switch (role) {
      case "creator":
        return "/onboarding/creator" as any;
      case "restaurant":
        return "/onboarding/restaurant" as any;
      default:
        return "/(tabs)/feed";
    }
  };

  const handleSignup = async () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,32}$/.test(trimmedUsername)) {
      Alert.alert("Invalid Username", "Username must be 3-32 characters: letters, numbers, underscores.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      Alert.alert("Weak Password", "Must be 8+ characters with at least one number.");
      return;
    }

    setLoading(true);
    const { error } = await signUp(trimmedEmail, password, trimmedUsername);
    setLoading(false);

    if (error) {
      Alert.alert("Sign Up Failed", error);
      return;
    }

    router.replace(getRedirectPath());
  };

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    setLoading(true);
    const fn = provider === "google" ? signInWithGoogle : signInWithApple;
    const { error } = await fn();
    setLoading(false);
    if (error) {
      if (!error.includes("cancelled")) Alert.alert("Sign In Failed", error);
    } else {
      router.replace(getRedirectPath());
    }
  };

  // Step 1: Role Selection
  if (step === "role") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color={COLORS.white} />
          </Pressable>

          <Animated.View entering={FadeInDown.delay(100)} style={styles.logoSection}>
            <Flame size={36} color={COLORS.coral} fill={COLORS.coral} />
            <Text style={styles.title}>Join ReelBite</Text>
            <Text style={styles.subtitle}>How will you use ReelBite?</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.rolesContainer}>
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.key;
              return (
                <Pressable
                  key={r.key}
                  style={[styles.roleCard, isSelected && styles.roleCardActive]}
                  onPress={() => setRole(r.key)}
                >
                  <View style={[styles.roleIconBox, isSelected && styles.roleIconBoxActive]}>
                    <Icon size={24} color={isSelected ? COLORS.white : COLORS.coral} />
                  </View>
                  <View style={styles.roleInfo}>
                    <Text style={[styles.roleTitle, isSelected && styles.roleTitleActive]}>
                      {r.title}
                    </Text>
                    <Text style={styles.roleDesc}>{r.desc}</Text>
                  </View>
                  <View style={[styles.roleRadio, isSelected && styles.roleRadioActive]}>
                    {isSelected && <View style={styles.roleRadioDot} />}
                  </View>
                </Pressable>
              );
            })}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            <Pressable
              style={styles.continueBtn}
              onPress={() => setStep("form")}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
              <ChevronRight size={20} color={COLORS.white} />
            </Pressable>
          </Animated.View>

          <Pressable
            style={styles.loginLink}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={{ color: COLORS.coral, fontWeight: "600" }}>Sign In</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Step 2: Account Form
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.backBtn} onPress={() => setStep("role")}>
            <ArrowLeft size={24} color={COLORS.white} />
          </Pressable>

          <Animated.View entering={FadeInDown.delay(100)} style={styles.logoSection}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {role === "creator" ? "Creator" : role === "restaurant" ? "Restaurant" : "Food Lover"}
              </Text>
            </View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              {role === "creator"
                ? "Start sharing food reviews & earning"
                : role === "restaurant"
                ? "Get your restaurant discovered"
                : "Join the food discovery revolution"}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder={role === "restaurant" ? "Your name" : "Username"}
                placeholderTextColor={COLORS.textTertiary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={COLORS.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={COLORS.textSecondary} />
                ) : (
                  <Eye size={20} color={COLORS.textSecondary} />
                )}
              </Pressable>
            </View>

            <Pressable
              style={[styles.signupBtn, loading && { opacity: 0.7 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.signupBtnText}>Create Account</Text>
              )}
            </Pressable>
          </Animated.View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.socialBtns}>
            <Pressable
              style={[styles.googleBtn, loading && { opacity: 0.7 }]}
              onPress={() => handleSocialSignIn("google")}
              disabled={loading}
            >
              <View style={styles.socialIconCircle}>
                <GoogleIcon size={18} />
              </View>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </Pressable>

            <Pressable
              style={[styles.appleBtn, loading && { opacity: 0.7 }]}
              onPress={() => handleSocialSignIn("apple")}
              disabled={loading}
            >
              <AppleIcon size={22} color="#000000" />
              <Text style={styles.appleBtnText}>Continue with Apple</Text>
            </Pressable>
          </Animated.View>

          <Text style={styles.terms}>
            By signing up, you agree to our{" "}
            <Text style={{ color: COLORS.coral }}>Terms of Service</Text> and{" "}
            <Text style={{ color: COLORS.coral }}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center", justifyContent: "center", marginTop: 8,
  },
  logoSection: { alignItems: "center", paddingVertical: 28 },
  title: { fontSize: 28, fontWeight: "700", color: COLORS.white, marginTop: 12 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 8, textAlign: "center" },
  roleBadge: {
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeText: { fontSize: 13, fontWeight: "700", color: COLORS.coral },

  // Role Selection
  rolesContainer: { gap: 12, marginBottom: 24 },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.06)",
  },
  roleCardActive: {
    borderColor: COLORS.coral,
    backgroundColor: "rgba(16,185,129,0.06)",
  },
  roleIconBox: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: "rgba(16,185,129,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  roleIconBoxActive: {
    backgroundColor: COLORS.coral,
  },
  roleInfo: { flex: 1 },
  roleTitle: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  roleTitleActive: { color: COLORS.coral },
  roleDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  roleRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  roleRadioActive: { borderColor: COLORS.coral },
  roleRadioDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: COLORS.coral,
  },
  continueBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.coral,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },

  // Form
  form: { gap: 14 },
  inputContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.darkSurface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 4, gap: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  input: { flex: 1, color: COLORS.white, fontSize: 15, paddingVertical: 14 },
  signupBtn: {
    backgroundColor: COLORS.coral, height: 54,
    borderRadius: 14, alignItems: "center", justifyContent: "center",
    marginTop: 8,
  },
  signupBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  divider: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: 13, color: COLORS.textTertiary },

  // Social
  socialBtns: { gap: 12 },
  googleBtn: {
    flexDirection: "row", height: 54,
    backgroundColor: COLORS.darkSurface, borderRadius: 14,
    alignItems: "center", justifyContent: "center", gap: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },
  socialIconCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
  },
  googleBtnText: { fontSize: 15, fontWeight: "600", color: COLORS.white },
  appleBtn: {
    flexDirection: "row", height: 54,
    backgroundColor: "#FFFFFF", borderRadius: 14,
    alignItems: "center", justifyContent: "center", gap: 10,
  },
  appleBtnText: { fontSize: 15, fontWeight: "600", color: "#000000" },

  terms: {
    fontSize: 12, color: COLORS.textTertiary,
    textAlign: "center", marginTop: 20, lineHeight: 18,
  },
  loginLink: { alignItems: "center", paddingTop: 20 },
  loginText: { fontSize: 14, color: COLORS.textSecondary },
});
