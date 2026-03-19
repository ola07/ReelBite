import { create } from "zustand";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "info",
  visible: false,
  showToast: (message, type = "info") =>
    set({ message, type, visible: true }),
  hideToast: () => set({ visible: false }),
}));
