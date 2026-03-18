export const COLORS = {
  coral: "#10B981",
  coralLight: "#34D399",
  coralDark: "#059669",
  amber: "#F59E0B",
  dark: "#060E0B",
  darkSurface: "#0F1A15",
  darkElevated: "#172820",
  darkHover: "#1F3329",
  white: "#FFFFFF",
  textSecondary: "#94A3B3",
  textTertiary: "#5E7068",
  success: "#34D399",
  error: "#EF4444",
  warning: "#F59E0B",
} as const;

export const CUISINES = [
  "Italian",
  "Japanese",
  "Mexican",
  "Chinese",
  "Indian",
  "Thai",
  "American",
  "French",
  "Korean",
  "Mediterranean",
  "Vietnamese",
  "Ethiopian",
  "Caribbean",
  "BBQ",
  "Seafood",
  "Pizza",
  "Sushi",
  "Burgers",
  "Vegan",
  "Desserts",
] as const;

export const PRICE_LEVELS = ["$", "$$", "$$$", "$$$$"] as const;

export const ORDER_STATUSES = {
  placed: { label: "Order Placed", color: COLORS.amber },
  confirmed: { label: "Confirmed", color: COLORS.coral },
  preparing: { label: "Preparing", color: COLORS.coral },
  ready: { label: "Ready", color: COLORS.success },
  out_for_delivery: { label: "On the Way", color: COLORS.success },
  delivered: { label: "Delivered", color: COLORS.success },
  picked_up: { label: "Picked Up", color: COLORS.success },
  cancelled: { label: "Cancelled", color: COLORS.error },
} as const;

export const RESERVATION_STATUSES = {
  pending: { label: "Pending", color: COLORS.amber },
  confirmed: { label: "Confirmed", color: COLORS.success },
  cancelled: { label: "Cancelled", color: COLORS.error },
  completed: { label: "Completed", color: COLORS.textSecondary },
  no_show: { label: "No Show", color: COLORS.error },
} as const;

export const VIBES = [
  "Date Night", "Casual", "Family", "Late Night", "Brunch",
  "Happy Hour", "Cozy", "Trendy", "Outdoor", "Live Music",
] as const;

export const VIBE_ICONS: Record<string, string> = {
  "Date Night": "🌙", "Casual": "😎", "Family": "👨‍👩‍👧‍👦", "Late Night": "🌃",
  "Brunch": "🥂", "Happy Hour": "🍻", "Cozy": "🕯️", "Trendy": "✨",
  "Outdoor": "🌿", "Live Music": "🎵",
};

export const MOODS = [
  "Adventurous", "Comfort Food", "Healthy", "Indulgent", "Quick Bite", "Celebration",
] as const;

export const MOOD_ICONS: Record<string, string> = {
  "Adventurous": "🧭", "Comfort Food": "🫕", "Healthy": "🥗",
  "Indulgent": "🍫", "Quick Bite": "⚡", "Celebration": "🎉",
};

export const CRAVINGS = [
  "Spicy", "Sweet", "Savory", "Fresh", "Fried", "Grilled", "Raw", "Smoky",
] as const;

export const CRAVING_ICONS: Record<string, string> = {
  "Spicy": "🌶️", "Sweet": "🍰", "Savory": "🧈", "Fresh": "🥬",
  "Fried": "🍟", "Grilled": "🔥", "Raw": "🐟", "Smoky": "💨",
};

export const DIETARY = [
  "Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "Keto", "Dairy-Free", "Nut-Free",
] as const;

export const DIETARY_ICONS: Record<string, string> = {
  "Vegetarian": "🥦", "Vegan": "🌱", "Gluten-Free": "🌾", "Halal": "☪️",
  "Kosher": "✡️", "Keto": "🥑", "Dairy-Free": "🥛", "Nut-Free": "🥜",
};
