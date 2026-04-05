import { create } from "zustand";

export interface CampaignFormState {
  type: "deal" | "contest";
  title: string;
  description: string;
  budget: number;
  requirements: {
    min_duration_sec: number;
    max_duration_sec: number;
    hashtags: string[];
    must_include: string[];
    style_notes: string;
  };
  targetRegions: string[];
  maxSubmissions: number | null;
  deadline: string;
  prizeBreakdown: { rank: number; amount: number }[];

  // Actions
  setType: (type: "deal" | "contest") => void;
  setField: (field: string, value: any) => void;
  setRequirement: (field: string, value: any) => void;
  addPrize: (rank: number, amount: number) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  type: "deal" as const,
  title: "",
  description: "",
  budget: 0,
  requirements: {
    min_duration_sec: 15,
    max_duration_sec: 60,
    hashtags: [],
    must_include: [],
    style_notes: "",
  },
  targetRegions: [],
  maxSubmissions: null,
  deadline: "",
  prizeBreakdown: [],
};

export const useCampaignStore = create<CampaignFormState>((set) => ({
  ...INITIAL_STATE,

  setType: (type) => set({ type }),

  setField: (field, value) => set({ [field]: value } as any),

  setRequirement: (field, value) =>
    set((state) => ({
      requirements: { ...state.requirements, [field]: value },
    })),

  addPrize: (rank, amount) =>
    set((state) => ({
      prizeBreakdown: [
        ...state.prizeBreakdown.filter((p) => p.rank !== rank),
        { rank, amount },
      ].sort((a, b) => a.rank - b.rank),
    })),

  reset: () => set(INITIAL_STATE),
}));
