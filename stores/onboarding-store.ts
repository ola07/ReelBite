import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "reelbite_onboarding";

export interface OnboardingState {
  completed: boolean;
  step: number;
  totalSteps: number;

  // Quiz answers
  discoveryMethod: string;
  cuisines: string[];
  vibes: string[];
  budget: number; // 1-4
  dietary: string[];
  cravings: string[];

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAnswer: (field: string, value: any) => void;
  toggleArrayItem: (field: string, item: string) => void;
  completeOnboarding: () => Promise<void>;
  checkCompleted: () => Promise<boolean>;
  reset: () => void;
}

const INITIAL = {
  completed: false,
  step: 0,
  totalSteps: 12,
  discoveryMethod: "",
  cuisines: [],
  vibes: [],
  budget: 2,
  dietary: [],
  cravings: [],
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...INITIAL,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, s.totalSteps - 1) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),

  setAnswer: (field, value) => set({ [field]: value } as any),

  toggleArrayItem: (field, item) =>
    set((s) => {
      const arr = (s as any)[field] as string[];
      return {
        [field]: arr.includes(item)
          ? arr.filter((i) => i !== item)
          : [...arr, item],
      } as any;
    }),

  completeOnboarding: async () => {
    set({ completed: true });
    await AsyncStorage.setItem(STORAGE_KEY, "true");
  },

  checkCompleted: async () => {
    const val = await AsyncStorage.getItem(STORAGE_KEY);
    const completed = val === "true";
    set({ completed });
    return completed;
  },

  reset: () => set(INITIAL),
}));
