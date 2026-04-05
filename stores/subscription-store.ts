import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "reelbite_subscription";
const TRIAL_DAYS = 7;

export type PlanType = "free" | "trial" | "monthly" | "yearly";

interface SubscriptionState {
  plan: PlanType;
  trialStartDate: string | null;
  isProUser: boolean;
  trialDaysLeft: number;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  startTrial: () => Promise<void>;
  subscribe: (plan: "monthly" | "yearly") => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

function getTrialDaysLeft(trialStartDate: string | null): number {
  if (!trialStartDate) return 0;
  const start = new Date(trialStartDate).getTime();
  const now = Date.now();
  const elapsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - elapsed);
}

function getIsProUser(plan: PlanType, trialStartDate: string | null): boolean {
  if (plan === "monthly" || plan === "yearly") return true;
  if (plan === "trial") return getTrialDaysLeft(trialStartDate) > 0;
  return false;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plan: "free",
  trialStartDate: null,
  isProUser: false,
  trialDaysLeft: 0,
  isLoading: true,

  initialize: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { plan, trialStartDate } = JSON.parse(stored);
        const daysLeft = getTrialDaysLeft(trialStartDate);
        // If trial expired, revert to free
        const activePlan = plan === "trial" && daysLeft <= 0 ? "free" : plan;
        set({
          plan: activePlan,
          trialStartDate,
          trialDaysLeft: daysLeft,
          isProUser: getIsProUser(activePlan, trialStartDate),
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  startTrial: async () => {
    const trialStartDate = new Date().toISOString();
    const state = {
      plan: "trial" as PlanType,
      trialStartDate,
      trialDaysLeft: TRIAL_DAYS,
      isProUser: true,
    };
    set(state);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ plan: "trial", trialStartDate })
    );
  },

  subscribe: async (plan: "monthly" | "yearly") => {
    // In production, this would go through App Store / Play Store IAP
    // For now, simulate the subscription
    const state = {
      plan,
      isProUser: true,
      trialDaysLeft: 0,
    };
    set(state);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ plan, trialStartDate: get().trialStartDate })
    );
  },

  cancelSubscription: async () => {
    set({
      plan: "free",
      isProUser: false,
      trialDaysLeft: 0,
    });
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ plan: "free", trialStartDate: get().trialStartDate })
    );
  },
}));
