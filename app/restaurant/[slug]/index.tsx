import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Globe,
  ChevronRight,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import {
  MOCK_RESTAURANTS,
  MOCK_MENU_CATEGORIES,
  MOCK_MENU_ITEMS,
  MOCK_REVIEWS,
  MENU_ITEM_VIDEOS,
} from "@/lib/mock-data";
import { MenuItem, ReviewWithProfile, MenuCategory } from "@/types";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import RatingStars from "@/components/shared/RatingStars";
import PriceLevel from "@/components/shared/PriceLevel";
import VideoMenuItem from "@/components/restaurant/VideoMenuItem";
import AIMenuRecommendations from "@/components/restaurant/AIMenuRecommendations";

type TabKey = "menu" | "reviews" | "about";

const TAB_OPTIONS: { key: TabKey; label: string }[] = [
  { key: "menu", label: "Menu" },
  { key: "reviews", label: "Reviews" },
  { key: "about", label: "About" },
];

function isOpenNow(operatingHours: any): boolean {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const now = new Date();
  const dayKey = days[now.getDay()];
  const hours = operatingHours?.[dayKey];
  if (!hours) return false;

  const currentTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");
  return currentTime >= hours.open && currentTime <= hours.close;
}

function getFormattedHours(operatingHours: any): { day: string; hours: string }[] {
  const dayLabels: Record<string, string> = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };
  const dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  return dayOrder.map((key) => {
    const h = operatingHours?.[key];
    return {
      day: dayLabels[key],
      hours: h ? `${formatTimeDisplay(h.open)} - ${formatTimeDisplay(h.close)}` : "Closed",
    };
  });
}

function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

// ─── Menu Tab ──────────────────────────────────────────────────────────────

function MenuTab({
  categories,
  items,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
}) {
  return (
    <View style={styles.tabContent}>
      {categories.map((category) => {
        const categoryItems = items.filter(
          (item) => item.category_id === category.id && item.is_available
        );
        if (categoryItems.length === 0) return null;
        return (
          <View key={category.id} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{category.name}</Text>
            {categoryItems.map((item) => {
              const videoUrl = MENU_ITEM_VIDEOS[item.id];
              // Use immersive VideoMenuItem for items with videos
              if (videoUrl) {
                return (
                  <VideoMenuItem
                    key={item.id}
                    item={item}
                    videoUrl={videoUrl}
                  />
                );
              }
              // Standard text-based item for items without videos
              return (
                <View key={item.id} style={styles.menuItemCard}>
                  <View style={styles.menuItemInfo}>
                    <View style={styles.menuItemHeader}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                      {item.is_popular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>Popular</Text>
                        </View>
                      )}
                    </View>
                    {item.description && (
                      <Text
                        style={styles.menuItemDescription}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                    )}
                    <View style={styles.menuItemFooter}>
                      <Text style={styles.menuItemPrice}>
                        {formatCurrency(item.price)}
                      </Text>
                      {item.tags.length > 0 && (
                        <View style={styles.menuItemTags}>
                          {item.tags.map((tag) => (
                            <View key={tag} style={styles.menuItemTag}>
                              <Text style={styles.menuItemTagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

// ─── Reviews Tab ───────────────────────────────────────────────────────────

function ReviewsTab({ reviews }: { reviews: ReviewWithProfile[] }) {
  if (reviews.length === 0) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.emptyTabText}>No reviews yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      {reviews.map((review) => {
        const initials =
          review.profile.display_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() ?? "?";

        return (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>{initials}</Text>
              </View>
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewAuthor}>
                  {review.profile.display_name ?? review.profile.username}
                </Text>
                <Text style={styles.reviewDate}>
                  {formatRelativeTime(review.created_at)}
                </Text>
              </View>
              <RatingStars rating={review.rating} size={14} />
            </View>
            {review.title && (
              <Text style={styles.reviewTitle}>{review.title}</Text>
            )}
            {review.body && (
              <Text style={styles.reviewBody}>{review.body}</Text>
            )}
            {review.helpful_count > 0 && (
              <Text style={styles.reviewHelpful}>
                {review.helpful_count} people found this helpful
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─── About Tab ─────────────────────────────────────────────────────────────

function AboutTab({
  restaurant,
}: {
  restaurant: (typeof MOCK_RESTAURANTS)[0];
}) {
  const hours = getFormattedHours(restaurant.operating_hours);

  return (
    <View style={styles.tabContent}>
      {/* Description */}
      {restaurant.description && (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutSectionTitle}>About</Text>
          <Text style={styles.aboutText}>{restaurant.description}</Text>
        </View>
      )}

      {/* Operating Hours */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutSectionTitle}>Hours</Text>
        {hours.map((h) => (
          <View key={h.day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{h.day}</Text>
            <Text
              style={[
                styles.hoursTime,
                h.hours === "Closed" && styles.hoursTimeClosed,
              ]}
            >
              {h.hours}
            </Text>
          </View>
        ))}
      </View>

      {/* Address */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutSectionTitle}>Location</Text>
        <View style={styles.aboutInfoRow}>
          <MapPin size={18} color={COLORS.textSecondary} />
          <Text style={styles.aboutInfoText}>
            {restaurant.address_line1}
            {restaurant.address_line2
              ? `, ${restaurant.address_line2}`
              : ""}
            {"\n"}
            {restaurant.city}, {restaurant.state} {restaurant.zip_code}
          </Text>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutSectionTitle}>Contact</Text>
        {restaurant.phone && (
          <View style={styles.aboutInfoRow}>
            <Phone size={18} color={COLORS.textSecondary} />
            <Text style={styles.aboutInfoText}>{restaurant.phone}</Text>
          </View>
        )}
        {restaurant.website && (
          <View style={styles.aboutInfoRow}>
            <Globe size={18} color={COLORS.textSecondary} />
            <Text style={styles.aboutInfoText}>{restaurant.website}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────

export default function RestaurantProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("menu");

  const restaurant = useMemo(
    () => MOCK_RESTAURANTS.find((r) => r.slug === slug),
    [slug]
  );

  if (!restaurant) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <Pressable onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isOpen = isOpenNow(restaurant.operating_hours);
  const categories = MOCK_MENU_CATEGORIES[restaurant.id] ?? [];
  const menuItems = MOCK_MENU_ITEMS[restaurant.id] ?? [];
  const reviews = MOCK_REVIEWS[restaurant.id] ?? [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[COLORS.coralDark, COLORS.coral, COLORS.amber]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Overlay gradient for text readability */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.heroOverlay}
            >
              <Text style={styles.heroName}>{restaurant.name}</Text>
            </LinearGradient>
          </LinearGradient>

          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={[styles.backButton, { top: insets.top + 8 }]}
            hitSlop={12}
          >
            <ArrowLeft size={24} color={COLORS.white} />
          </Pressable>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>

          <View style={styles.ratingRow}>
            <RatingStars
              rating={restaurant.average_rating}
              size={18}
              showCount
              count={restaurant.total_reviews}
            />
          </View>

          <View style={styles.metaRow}>
            <View style={styles.cuisineBadges}>
              {restaurant.cuisine_type.map((cuisine) => (
                <View key={cuisine} style={styles.cuisineBadge}>
                  <Text style={styles.cuisineBadgeText}>{cuisine}</Text>
                </View>
              ))}
            </View>
            <PriceLevel
              level={restaurant.price_level as 1 | 2 | 3 | 4}
              size={14}
            />
            <View
              style={[
                styles.openBadge,
                isOpen ? styles.openBadgeOpen : styles.openBadgeClosed,
              ]}
            >
              <Text
                style={[
                  styles.openBadgeText,
                  isOpen
                    ? styles.openBadgeTextOpen
                    : styles.openBadgeTextClosed,
                ]}
              >
                {isOpen ? "Open" : "Closed"}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {restaurant.accepts_reservations && (
            <Pressable
              onPress={() =>
                router.push(`/restaurant/${restaurant.slug}/reserve`)
              }
              style={styles.outlineButton}
            >
              <Text style={styles.outlineButtonText}>Book a Table</Text>
            </Pressable>
          )}
          {restaurant.accepts_online_orders && (
            <Pressable
              onPress={() =>
                router.push(`/restaurant/${restaurant.slug}/order`)
              }
              style={styles.filledButton}
            >
              <Text style={styles.filledButtonText}>Order Online</Text>
            </Pressable>
          )}
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          {TAB_OPTIONS.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.segmentTab,
                activeTab === tab.key && styles.segmentTabActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentTabText,
                  activeTab === tab.key && styles.segmentTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* AI Menu Recommendations */}
        {activeTab === "menu" && (
          <AIMenuRecommendations items={menuItems} />
        )}

        {/* Tab Content */}
        {activeTab === "menu" && (
          <MenuTab categories={categories} items={menuItems} />
        )}
        {activeTab === "reviews" && <ReviewsTab reviews={reviews} />}
        {activeTab === "about" && <AboutTab restaurant={restaurant} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  centeredContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero
  hero: {
    position: "relative",
    height: 260,
  },
  heroGradient: {
    flex: 1,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  heroName: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.white,
  },
  backButton: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Info Section
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 10,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.white,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  cuisineBadges: {
    flexDirection: "row",
    gap: 6,
  },
  cuisineBadge: {
    backgroundColor: COLORS.darkElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cuisineBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  openBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  openBadgeOpen: {
    backgroundColor: "rgba(34,197,94,0.15)",
  },
  openBadgeClosed: {
    backgroundColor: "rgba(239,68,68,0.15)",
  },
  openBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  openBadgeTextOpen: {
    color: COLORS.success,
  },
  openBadgeTextClosed: {
    color: COLORS.error,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.coral,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  outlineButtonText: {
    color: COLORS.coral,
    fontWeight: "700",
    fontSize: 15,
  },
  filledButton: {
    flex: 1,
    backgroundColor: COLORS.coral,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  filledButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },

  // Segmented Control
  segmentedControl: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentTabActive: {
    backgroundColor: COLORS.darkElevated,
  },
  segmentTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  segmentTabTextActive: {
    color: COLORS.white,
  },

  // Tab Content
  tabContent: {
    paddingHorizontal: 16,
  },
  emptyTabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: 32,
  },

  // Menu Tab
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 12,
  },
  menuItemCard: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  menuItemInfo: {
    gap: 6,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.coral,
  },
  menuItemDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  menuItemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.coral,
  },
  menuItemTags: {
    flexDirection: "row",
    gap: 6,
  },
  menuItemTag: {
    backgroundColor: COLORS.darkElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  menuItemTagText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.textTertiary,
    textTransform: "capitalize",
  },

  // Reviews Tab
  reviewCard: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.coral,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  reviewTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  reviewBody: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  reviewHelpful: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 8,
  },

  // About Tab
  aboutSection: {
    marginBottom: 24,
  },
  aboutSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.darkElevated,
  },
  hoursDay: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  hoursTime: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "600",
  },
  hoursTimeClosed: {
    color: COLORS.error,
  },
  aboutInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  aboutInfoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    flex: 1,
  },

  // Error
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: COLORS.coral,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
});
