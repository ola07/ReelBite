import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Camera, User, AtSign, FileText } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase";

export default function EditProfileScreen() {
  const { profile, user, fetchProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !/^[a-zA-Z0-9_]{3,32}$/.test(trimmedUsername)) {
      Alert.alert("Invalid Username", "3-32 characters, letters, numbers, underscores only.");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        username: trimmedUsername,
        bio: bio.trim() || null,
      } as any)
      .eq("id", user.id);

    if (error) {
      setLoading(false);
      if (error.message.includes("unique")) {
        Alert.alert("Username Taken", "That username is already in use.");
      } else {
        Alert.alert("Error", error.message);
      }
      return;
    }

    await fetchProfile();
    setLoading(false);
    router.back();
  };

  const initial = (displayName || username || "U")[0].toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          style={[styles.saveBtn, loading && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={[COLORS.coral, "#059669"]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </LinearGradient>
          <Pressable style={styles.changePhotoBtn}>
            <Camera size={16} color={COLORS.coral} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </Pressable>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Display Name</Text>
            <View style={styles.inputRow}>
              <User size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your display name"
                placeholderTextColor={COLORS.textTertiary}
                maxLength={50}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Username</Text>
            <View style={styles.inputRow}>
              <AtSign size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="username"
                placeholderTextColor={COLORS.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={32}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <View style={[styles.inputRow, { alignItems: "flex-start" }]}>
              <FileText size={18} color={COLORS.textSecondary} style={{ marginTop: 14 }} />
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell people about yourself..."
                placeholderTextColor={COLORS.textTertiary}
                multiline
                numberOfLines={4}
                maxLength={200}
              />
            </View>
            <Text style={styles.charCount}>{bio.length}/200</Text>
          </View>
        </View>
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
    backgroundColor: COLORS.darkElevated,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  saveBtn: {
    backgroundColor: COLORS.coral,
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10,
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: COLORS.white },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  avatarSection: { alignItems: "center", paddingVertical: 24 },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: "700", color: COLORS.white },
  changePhotoBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
  },
  changePhotoText: { fontSize: 14, fontWeight: "600", color: COLORS.coral },
  form: { gap: 20 },
  field: {},
  fieldLabel: {
    fontSize: 13, fontWeight: "600", color: COLORS.textSecondary,
    marginBottom: 8, marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: COLORS.darkSurface, borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  input: {
    flex: 1, color: COLORS.white, fontSize: 15, paddingVertical: 14,
  },
  bioInput: {
    minHeight: 80, textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12, color: COLORS.textTertiary, textAlign: "right", marginTop: 6,
  },
});
