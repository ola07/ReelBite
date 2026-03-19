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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Flame } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert("Sign In Failed", error);
      return;
    }

    router.replace("/(tabs)/feed");
  };

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
          {/* Back Button */}
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={COLORS.white} />
          </Pressable>

          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.logoSection}>
            <Flame size={36} color={COLORS.coral} fill={COLORS.coral} />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue discovering</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
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

            <Pressable style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.loginBtn,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                loading && { opacity: 0.7 },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginBtnText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Auth */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.socialBtns}>
            <Pressable style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.8 }]}>
              <Text style={styles.socialBtnText}>Continue with Google</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.8 }]}>
              <Text style={styles.socialBtnText}>Continue with Apple</Text>
            </Pressable>
          </Animated.View>

          {/* Sign Up Link */}
          <Pressable
            style={styles.signupLink}
            onPress={() => router.push("/auth/signup")}
          >
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text style={{ color: COLORS.coral, fontWeight: "600" }}>Sign Up</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logoSection: { alignItems: "center", paddingVertical: 40 },
  title: { fontSize: 28, fontWeight: "700", color: COLORS.white, marginTop: 16 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 8 },
  form: { gap: 14 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    paddingVertical: 14,
  },
  forgotBtn: { alignSelf: "flex-end" },
  forgotText: { fontSize: 13, color: COLORS.coral, fontWeight: "500" },
  loginBtn: {
    backgroundColor: COLORS.coral,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  loginBtnText: { fontSize: 16, fontWeight: "700", color: COLORS.white },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: 13, color: COLORS.textTertiary },
  socialBtns: { gap: 12 },
  socialBtn: {
    backgroundColor: COLORS.darkSurface,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  socialBtnText: { fontSize: 15, fontWeight: "600", color: COLORS.white },
  signupLink: { alignItems: "center", paddingTop: 24 },
  signupText: { fontSize: 14, color: COLORS.textSecondary },
});
