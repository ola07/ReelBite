import { create } from "zustand";

export type TasteCategory =
  | "spicy" | "sweet" | "savory" | "fresh" | "fried" | "grilled" | "smoky" | "raw"
  | "italian" | "japanese" | "mexican" | "thai" | "indian" | "american" | "korean" | "french"
  | "date_night" | "casual" | "family" | "late_night" | "brunch" | "trendy"
  | "comfort" | "adventurous" | "healthy" | "indulgent" | "celebration" | "quick_bite";

export type TasteProfile = {
  preferences: Record<TasteCategory, number>; // 0-100 affinity score
  favoriteRestaurants: string[];
  likedVideos: string[];
  orderedDishes: string[];
  viewedCategories: string[];
  profileStrength: number; // 0-100
  topCravings: TasteCategory[];
  topVibes: TasteCategory[];
  lastUpdated: string;
};

type TasteStore = {
  profile: TasteProfile;
  isOnboarded: boolean;

  // Actions
  recordLike: (videoId: string, tags: TasteCategory[]) => void;
  recordView: (videoId: string, tags: TasteCategory[], watchPct: number) => void;
  recordOrder: (dishId: string, tags: TasteCategory[]) => void;
  recordBookmark: (restaurantId: string, tags: TasteCategory[]) => void;
  completeOnboarding: (selectedTastes: TasteCategory[]) => void;
  getTopPreferences: (n?: number) => { category: TasteCategory; score: number }[];
  getProfileInsights: () => {
    topCuisines: string[];
    topVibes: string[];
    topCravings: string[];
    adventureScore: number;
    spiceLevel: number;
  };
};

const DEFAULT_PREFERENCES: Record<TasteCategory, number> = {
  spicy: 0, sweet: 0, savory: 0, fresh: 0, fried: 0, grilled: 0, smoky: 0, raw: 0,
  italian: 0, japanese: 0, mexican: 0, thai: 0, indian: 0, american: 0, korean: 0, french: 0,
  date_night: 0, casual: 0, family: 0, late_night: 0, brunch: 0, trendy: 0,
  comfort: 0, adventurous: 0, healthy: 0, indulgent: 0, celebration: 0, quick_bite: 0,
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function computeStrength(prefs: Record<TasteCategory, number>): number {
  const nonZero = Object.values(prefs).filter((v) => v > 0).length;
  return clamp(Math.round((nonZero / Object.keys(prefs).length) * 100), 0, 100);
}

function getTopN(prefs: Record<TasteCategory, number>, n: number) {
  return Object.entries(prefs)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([cat, score]) => ({ category: cat as TasteCategory, score }));
}

export const useTasteStore = create<TasteStore>((set, get) => ({
  profile: {
    preferences: { ...DEFAULT_PREFERENCES },
    favoriteRestaurants: [],
    likedVideos: [],
    orderedDishes: [],
    viewedCategories: [],
    profileStrength: 0,
    topCravings: [],
    topVibes: [],
    lastUpdated: new Date().toISOString(),
  },
  isOnboarded: false,

  recordLike: (videoId, tags) => {
    set((state) => {
      const prefs = { ...state.profile.preferences };
      tags.forEach((t) => { prefs[t] = clamp(prefs[t] + 8, 0, 100); });
      const likedVideos = [...new Set([...state.profile.likedVideos, videoId])];
      return {
        profile: {
          ...state.profile,
          preferences: prefs,
          likedVideos,
          profileStrength: computeStrength(prefs),
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  },

  recordView: (videoId, tags, watchPct) => {
    set((state) => {
      const prefs = { ...state.profile.preferences };
      const boost = Math.round(watchPct * 5); // 0-5 points based on how much they watched
      tags.forEach((t) => { prefs[t] = clamp(prefs[t] + boost, 0, 100); });
      return {
        profile: {
          ...state.profile,
          preferences: prefs,
          profileStrength: computeStrength(prefs),
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  },

  recordOrder: (dishId, tags) => {
    set((state) => {
      const prefs = { ...state.profile.preferences };
      tags.forEach((t) => { prefs[t] = clamp(prefs[t] + 15, 0, 100); }); // Orders = strongest signal
      const orderedDishes = [...new Set([...state.profile.orderedDishes, dishId])];
      return {
        profile: {
          ...state.profile,
          preferences: prefs,
          orderedDishes,
          profileStrength: computeStrength(prefs),
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  },

  recordBookmark: (restaurantId, tags) => {
    set((state) => {
      const prefs = { ...state.profile.preferences };
      tags.forEach((t) => { prefs[t] = clamp(prefs[t] + 10, 0, 100); });
      const favoriteRestaurants = [...new Set([...state.profile.favoriteRestaurants, restaurantId])];
      return {
        profile: {
          ...state.profile,
          preferences: prefs,
          favoriteRestaurants,
          profileStrength: computeStrength(prefs),
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  },

  completeOnboarding: (selectedTastes) => {
    set((state) => {
      const prefs = { ...state.profile.preferences };
      selectedTastes.forEach((t) => { prefs[t] = 50; }); // Start at 50 for selected tastes
      return {
        isOnboarded: true,
        profile: {
          ...state.profile,
          preferences: prefs,
          profileStrength: computeStrength(prefs),
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  },

  getTopPreferences: (n = 5) => {
    return getTopN(get().profile.preferences, n);
  },

  getProfileInsights: () => {
    const prefs = get().profile.preferences;
    const cuisines: TasteCategory[] = ["italian", "japanese", "mexican", "thai", "indian", "american", "korean", "french"];
    const vibes: TasteCategory[] = ["date_night", "casual", "family", "late_night", "brunch", "trendy"];
    const cravings: TasteCategory[] = ["spicy", "sweet", "savory", "fresh", "fried", "grilled", "smoky", "raw"];

    const topCuisines = cuisines.sort((a, b) => prefs[b] - prefs[a]).slice(0, 3).map(String);
    const topVibes = vibes.sort((a, b) => prefs[b] - prefs[a]).slice(0, 3).map(String);
    const topCravings = cravings.sort((a, b) => prefs[b] - prefs[a]).slice(0, 3).map(String);

    return {
      topCuisines,
      topVibes,
      topCravings,
      adventureScore: prefs.adventurous,
      spiceLevel: prefs.spicy,
    };
  },
}));
