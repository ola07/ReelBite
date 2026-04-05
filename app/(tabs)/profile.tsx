import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Heart,
  Calendar,
  ShoppingBag,
  Settings,
  ChevronRight,
  LogOut,
  BookmarkCheck,
  MapPin,
  Star,
  Sparkles,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuLink({
  icon: Icon,
  label,
  subtitle,
  onPress,
}: {
  icon: any;
  label: string;
  subtitle?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuLink, pressed && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <View style={styles.menuIconBox}>
        <Icon size={20} color={COLORS.coral} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuLabel}>{label}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={18} color={COLORS.textSecondary} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { profile, user, signOut } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ["profile-stats", user?.id],
    queryFn: async () => {
      if (!user) return { favorites: 0, reservations: 0, orders: 0, reviews: 0 };
      const [likes, reservations, orders, reviews] = await Promise.all([
        supabase.from("likes").select("video_id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reservations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      return {
        favorites: likes.count ?? 0,
        reservations: reservations.count ?? 0,
        orders: orders.count ?? 0,
        reviews: reviews.count ?? 0,
      };
    },
    enabled: !!user,
  });

  const displayName = profile?.display_name || profile?.username || user?.email?.split("@")[0] || "User";
  const username = profile?.username || user?.email?.split("@")[0] || "user";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth/welcome");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>Profile</Text>

        {/* Avatar & Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.memberSince}>
            <MapPin size={12} color={COLORS.textSecondary} /> Member since {memberSince}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatItem value={stats?.favorites ?? 0} label="Favorites" />
          <View style={styles.statDivider} />
          <StatItem value={stats?.reservations ?? 0} label="Reservations" />
          <View style={styles.statDivider} />
          <StatItem value={stats?.orders ?? 0} label="Orders" />
          <View style={styles.statDivider} />
          <StatItem value={stats?.reviews ?? 0} label="Reviews" />
        </View>

        {/* Taste Profile */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Personalization</Text>
          <MenuLink
            icon={Sparkles}
            label="Your Taste Profile"
            subtitle="Food preferences & taste DNA"
            onPress={() => router.push("/taste-profile" as any)}
          />
        </View>

        {/* Menu Links */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <MenuLink
            icon={Heart}
            label="Favorites"
            subtitle="Restaurants you love"
          />
          <MenuLink
            icon={BookmarkCheck}
            label="Saved Videos"
            subtitle="Videos you bookmarked"
          />
          <MenuLink
            icon={Calendar}
            label="Reservations"
            subtitle="Upcoming and past bookings"
          />
          <MenuLink
            icon={ShoppingBag}
            label="Order History"
            subtitle="Previous orders"
            onPress={() => router.push("/(tabs)/orders")}
          />
          <MenuLink
            icon={Star}
            label="My Reviews"
            subtitle="Reviews you've written"
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <MenuLink
            icon={Settings}
            label="Account Settings"
            subtitle="Manage your account"
          />
          <MenuLink
            icon={LogOut}
            label="Sign Out"
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.coral,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.white,
  },
  displayName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.white,
  },
  username: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  memberSince: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.darkSurface,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.darkSurface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(16,185,129,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.white,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
