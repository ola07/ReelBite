import { create } from "zustand";

interface FeedState {
  currentIndex: number;
  isMuted: boolean;
  setCurrentIndex: (index: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  currentIndex: 0,
  isMuted: true,
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setMuted: (isMuted) => set({ isMuted }),
}));
