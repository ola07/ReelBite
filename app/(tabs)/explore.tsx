import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Compass, Grid3X3 } from "lucide-react-native";
import { COLORS, VIBES, VIBE_ICONS, MOODS, MOOD_ICONS, CRAVINGS, CRAVING_ICONS, DIETARY, DIETARY_ICONS } from "@/lib/constants";
import { MOCK_RESTAURANTS, RESTAURANT_TAGS } from "@/lib/mock-data";
import { Restaurant } from "@/types";
import SearchBar from "@/components/explore/SearchBar";
import FilterChips from "@/components/explore/FilterChips";
import RestaurantCard from "@/components/explore/RestaurantCard";
import DiscoverySection from "@/components/explore/DiscoverySection";
import LocalHighlights from "@/components/shared/LocalHighlights";

const CUISINE_FILTERS = [
  "All", "Italian", "Japanese", "Mexican", "Thai",
  "American", "Indian", "Korean", "French", "Seafood", "Vegan",
];

type ExploreMode = "cuisine" | "discover";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<ExploreMode>("cuisine");

  const [filters, setFilters] = useState(
    CUISINE_FILTERS.map((label, i) => ({ label, active: i === 0 }))
  );

  // Discovery state
  const [activeVibes, setActiveVibes] = useState<string[]>([]);
  const [activeMoods, setActiveMoods] = useState<string[]>([]);
  const [activeCravings, setActiveCravings] = useState<string[]>([]);
  const [activeDietary, setActiveDietary] = useState<string[]>([]);

  const activeCuisine = useMemo(() => {
    const active = filters.find((f) => f.active && f.label !== "All");
    return active?.label ?? null;
  }, [filters]);

  const toggleArrayItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const vibeChips = useMemo(
    () => VIBES.map((v) => ({ label: v, icon: VIBE_ICONS[v] || "", active: activeVibes.includes(v) })),
    [activeVibes]
  );
  const moodChips = useMemo(
    () => MOODS.map((m) => ({ label: m, icon: MOOD_ICONS[m] || "", active: activeMoods.includes(m) })),
    [activeMoods]
  );
  const cravingChips = useMemo(
    () => CRAVINGS.map((c) => ({ label: c, icon: CRAVING_ICONS[c] || "", active: activeCravings.includes(c) })),
    [activeCravings]
  );
  const dietaryChips = useMemo(
    () => DIETARY.map((d) => ({ label: d, icon: DIETARY_ICONS[d] || "", active: activeDietary.includes(d) })),
    [activeDietary]
  );

  const filteredRestaurants = useMemo(() => {
    let results = MOCK_RESTAURANTS;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine_type.some((c) => c.toLowerCase().includes(query))
      );
    }

    if (mode === "cuisine" && activeCuisine) {
      results = results.filter((r) =>
        r.cuisine_type.some(
          (c) => c.toLowerCase() === activeCuisine.toLowerCase()
        )
      );
    }

    if (mode === "discover") {
      if (activeVibes.length > 0) {
        results = results.filter((r) => {
          const tags = RESTAURANT_TAGS[r.id];
          return tags && activeVibes.some((v) => tags.vibes.includes(v));
        });
      }
      if (activeMoods.length > 0) {
        results = results.filter((r) => {
          const tags = RESTAURANT_TAGS[r.id];
          return tags && activeMoods.some((m) => tags.moods.includes(m));
        });
      }
      if (activeCravings.length > 0) {
        results = results.filter((r) => {
          const tags = RESTAURANT_TAGS[r.id];
          return tags && activeCravings.some((c) => tags.cravings.includes(c));
        });
      }
      if (activeDietary.length > 0) {
        results = results.filter((r) => {
          const tags = RESTAURANT_TAGS[r.id];
          return tags && activeDietary.some((d) => tags.dietary.includes(d));
        });
      }
    }

    return results;
  }, [searchQuery, activeCuisine, mode, activeVibes, activeMoods, activeCravings, activeDietary]);

  const trendingRestaurants = useMemo(
    () =>
      [...MOCK_RESTAURANTS]
        .sort((a, b) => b.total_reviews - a.total_reviews)
        .slice(0, 5),
    []
  );

  const localHighlights = useMemo(
    () => [
      { type: "hot_right_now" as const, restaurant: MOCK_RESTAURANTS[2], reason: "512 reviews this month" },
      { type: "rising" as const, restaurant: MOCK_RESTAURANTS[4], reason: "Trending in your area" },
      { type: "most_reviewed" as const, restaurant: MOCK_RESTAURANTS[0], reason: "Top rated Italian" },
      { type: "new_arrival" as const, restaurant: MOCK_RESTAURANTS[5], reason: "Opened 2 weeks ago" },
    ],
    []
  );

  const handleToggleFilter = useCallback(
    (index: number) => {
      setFilters((prev) =>
        prev.map((f, i) => ({
          ...f,
          active: i === index ? !f.active : false,
        }))
      );
    },
    []
  );

  const handleRestaurantPress = useCallback(
    (restaurant: Restaurant) => {
      router.push(`/restaurant/${restaurant.slug}`);
    },
    [router]
  );

  const renderRestaurantItem = useCallback(
    ({ item }: { item: Restaurant }) => (
      <RestaurantCard
        restaurant={item}
        onPress={() => handleRestaurantPress(item)}
      />
    ),
    [handleRestaurantPress]
  );

  const keyExtractor = useCallback((item: Restaurant) => item.id, []);

  const hasDiscoveryFilters =
    activeVibes.length > 0 ||
    activeMoods.length > 0 ||
    activeCravings.length > 0 ||
    activeDietary.length > 0;

  const ListHeader = useMemo(
    () => (
      <View>
        {/* Local Highlights */}
        {mode === "cuisine" && !searchQuery.trim() && (
          <LocalHighlights
            highlights={localHighlights}
            onPress={handleRestaurantPress}
          />
        )}

        {/* Trending Near You */}
        {mode === "cuisine" && !searchQuery.trim() && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Trending Near You</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingScroll}
            >
              {trendingRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onPress={() => handleRestaurantPress(restaurant)}
                  compact
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Restaurants Header */}
        <View style={styles.allRestaurantsHeader}>
          <Text style={styles.sectionTitle}>
            {mode === "discover" && hasDiscoveryFilters
              ? "Matching Restaurants"
              : "All Restaurants"}
          </Text>
          <Text style={styles.resultCount}>
            {filteredRestaurants.length} found
          </Text>
        </View>
      </View>
    ),
    [
      trendingRestaurants,
      filteredRestaurants.length,
      handleRestaurantPress,
      mode,
      searchQuery,
      hasDiscoveryFilters,
      localHighlights,
    ]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with mode toggle */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => setMode("cuisine")}
            style={[styles.modeBtn, mode === "cuisine" && styles.modeBtnActive]}
          >
            <Grid3X3 size={16} color={mode === "cuisine" ? COLORS.coral : COLORS.textSecondary} />
            <Text style={[styles.modeBtnText, mode === "cuisine" && styles.modeBtnTextActive]}>
              Cuisine
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("discover")}
            style={[styles.modeBtn, mode === "discover" && styles.modeBtnActive]}
          >
            <Compass size={16} color={mode === "discover" ? COLORS.coral : COLORS.textSecondary} />
            <Text style={[styles.modeBtnText, mode === "discover" && styles.modeBtnTextActive]}>
              Discover
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Cuisine Filter Chips */}
      {mode === "cuisine" && (
        <FilterChips filters={filters} onToggle={handleToggleFilter} />
      )}

      {/* Discovery Sections */}
      {mode === "discover" && (
        <ScrollView
          style={styles.discoveryScroll}
          contentContainerStyle={styles.discoveryScrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <DiscoverySection
            title="Vibe"
            chips={vibeChips}
            onToggle={(label) => setActiveVibes((prev) => toggleArrayItem(prev, label))}
          />
          <DiscoverySection
            title="Mood"
            chips={moodChips}
            onToggle={(label) => setActiveMoods((prev) => toggleArrayItem(prev, label))}
          />
          <DiscoverySection
            title="Craving"
            chips={cravingChips}
            onToggle={(label) => setActiveCravings((prev) => toggleArrayItem(prev, label))}
          />
          <DiscoverySection
            title="Dietary"
            chips={dietaryChips}
            onToggle={(label) => setActiveDietary((prev) => toggleArrayItem(prev, label))}
          />
        </ScrollView>
      )}

      {/* Restaurant List */}
      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No restaurants found</Text>
            <Text style={styles.emptySubtitle}>
              {mode === "discover"
                ? "Try adjusting your discovery preferences"
                : "Try adjusting your search or filters"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.white,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 10,
    padding: 3,
  },
  modeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modeBtnActive: {
    backgroundColor: COLORS.darkElevated,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  modeBtnTextActive: {
    color: COLORS.coral,
  },
  discoveryScroll: {
    maxHeight: 220,
  },
  discoveryScrollContent: {
    paddingVertical: 4,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  trendingScroll: {
    paddingHorizontal: 16,
  },
  allRestaurantsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
