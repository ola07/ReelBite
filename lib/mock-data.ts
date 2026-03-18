import { VideoWithDetails, Restaurant, MenuCategory, MenuItem, ReviewWithProfile, CreatorWithProfile } from "@/types";

// ─── Restaurant Discovery Tags ─────────────────────────────────────────────
export const RESTAURANT_TAGS: Record<string, {
  vibes: string[];
  moods: string[];
  cravings: string[];
  dietary: string[];
}> = {
  r1: { vibes: ["Date Night", "Cozy", "Family"], moods: ["Comfort Food", "Celebration"], cravings: ["Savory", "Fresh"], dietary: ["Vegetarian"] },
  r2: { vibes: ["Date Night", "Trendy"], moods: ["Adventurous", "Celebration"], cravings: ["Raw", "Fresh"], dietary: ["Gluten-Free"] },
  r3: { vibes: ["Casual", "Family", "Late Night"], moods: ["Comfort Food", "Quick Bite"], cravings: ["Spicy", "Savory", "Fried"], dietary: [] },
  r4: { vibes: ["Date Night", "Trendy"], moods: ["Indulgent", "Celebration"], cravings: ["Grilled", "Smoky", "Savory"], dietary: ["Gluten-Free", "Keto"] },
  r5: { vibes: ["Casual", "Outdoor"], moods: ["Adventurous", "Quick Bite"], cravings: ["Spicy", "Sweet", "Fresh"], dietary: ["Vegan", "Gluten-Free"] },
  r6: { vibes: ["Cozy", "Family"], moods: ["Comfort Food", "Indulgent"], cravings: ["Spicy", "Savory"], dietary: ["Vegetarian", "Vegan", "Halal"] },
};

// ─── Menu Item Videos ───────────────────────────────────────────────────────
export const MENU_ITEM_VIDEOS: Record<string, string> = {
  mi1: "https://assets.mixkit.co/videos/44001/44001-720.mp4",
  mi3: "https://assets.mixkit.co/videos/32518/32518-720.mp4",
  mi4: "https://assets.mixkit.co/videos/42474/42474-720.mp4",
  mi5: "https://assets.mixkit.co/videos/45729/45729-720.mp4",
  mi7: "https://assets.mixkit.co/videos/46010/46010-720.mp4",
  mi9: "https://assets.mixkit.co/videos/46673/46673-720.mp4",
};

// ─── Community Badges for Videos ────────────────────────────────────────────
export const VIDEO_COMMUNITY_BADGES: Record<string, "trending" | "local_favorite" | "community_pick"> = {
  v1: "community_pick",
  v3: "trending",
  v4: "local_favorite",
  v6: "community_pick",
};

// ─── Creator Tiers ──────────────────────────────────────────────────────────
export const CREATOR_TIERS: Record<string, "rising" | "established" | "elite" | "critic"> = {
  c1: "elite",
  c2: "established",
  c3: "rising",
  c4: "rising",
};

// ─── Video Review Cards (mini-blog attached to videos) ──────────────────────
export const VIDEO_REVIEWS: Record<string, {
  rating: number;
  title: string;
  body: string;
  authorName: string;
  date: string;
}> = {
  v1: {
    rating: 5,
    title: "Best Margherita in NYC!",
    body: "The crust is perfectly charred with those gorgeous leopard spots. San Marzano tomatoes give it that authentic Neapolitan sweetness. Fresh mozzarella melts like a dream. This is the gold standard for pizza in this city.",
    authorName: "Sarah Chen",
    date: "Mar 10, 2026",
  },
  v2: {
    rating: 5,
    title: "12-Course Omakase Masterpiece",
    body: "Every single piece tells a story. The otoro melted on my tongue. Chef Tanaka's knife work is art. Worth every penny of the $180 price tag. Book weeks in advance.",
    authorName: "Mike Johnson",
    date: "Mar 9, 2026",
  },
  v3: {
    rating: 4,
    title: "Birria Tacos: Crispy, Cheesy, Dripping",
    body: "The consomme dip makes these tacos next level. Perfectly crispy tortilla, generous cheese pull, and the birria itself is fall-apart tender. Only dock a star because the wait was 45 mins.",
    authorName: "Ana Rodriguez",
    date: "Mar 8, 2026",
  },
  v6: {
    rating: 5,
    title: "Hidden Gem: Best Butter Chicken",
    body: "Creamy, perfectly spiced, not too heavy. The naan is pillowy soft and made fresh. This place flies under the radar but locals know. The spice level is customizable which is a huge plus.",
    authorName: "Mike Johnson",
    date: "Mar 5, 2026",
  },
};

// ─── Affiliate Commission Rates ─────────────────────────────────────────────
export const AFFILIATE_RATES: Record<string, {
  restaurantName: string;
  rate: number;
  type: "reservation" | "order";
  totalEarned: number;
  totalReferrals: number;
}> = {
  r1: { restaurantName: "Bella Napoli", rate: 8, type: "order", totalEarned: 285.40, totalReferrals: 112 },
  r2: { restaurantName: "Sakura Sushi", rate: 5, type: "reservation", totalEarned: 890.00, totalReferrals: 45 },
  r3: { restaurantName: "La Cocina de Abuela", rate: 10, type: "order", totalEarned: 195.20, totalReferrals: 234 },
  r4: { restaurantName: "The Ember Room", rate: 6, type: "reservation", totalEarned: 1240.00, totalReferrals: 38 },
  r5: { restaurantName: "Bangkok Garden", rate: 8, type: "order", totalEarned: 320.50, totalReferrals: 167 },
  r6: { restaurantName: "Spice Route", rate: 7, type: "order", totalEarned: 178.90, totalReferrals: 89 },
};

export const MOCK_VIDEOS: VideoWithDetails[] = [
  {
    id: "v1",
    creator_id: "c1",
    restaurant_id: "r1",
    title: "Best Margherita in Town",
    description: "This pizza is absolutely incredible. Fresh mozzarella, San Marzano tomatoes, and the crispiest crust you've ever seen!",
    video_url: "https://assets.mixkit.co/videos/44001/44001-720.mp4",
    thumbnail_url: null,
    duration_seconds: 15,
    aspect_ratio: "9:16",
    tags: ["pizza", "italian", "margherita"],
    dish_name: "Margherita Pizza",
    view_count: 125400,
    like_count: 8920,
    comment_count: 342,
    share_count: 567,
    bookmark_count: 1205,
    engagement_score: 95.5,
    is_active: true,
    created_at: "2026-03-10T12:00:00Z",
    updated_at: "2026-03-10T12:00:00Z",
    creator: { id: "c1", username: "foodie_sarah", display_name: "Sarah Chen", avatar_url: null, is_verified: true },
    restaurant: { id: "r1", name: "Bella Napoli", slug: "bella-napoli", cuisine_type: ["Italian", "Pizza"] },
    is_liked: false,
    is_bookmarked: false,
  },
  {
    id: "v2",
    creator_id: "c2",
    restaurant_id: "r2",
    title: "Omakase Experience",
    description: "12-course omakase that blew my mind. Each piece of sushi was a work of art.",
    video_url: "https://assets.mixkit.co/videos/32518/32518-720.mp4",
    thumbnail_url: null,
    duration_seconds: 22,
    aspect_ratio: "9:16",
    tags: ["sushi", "japanese", "omakase"],
    dish_name: "Chef's Omakase",
    view_count: 89300,
    like_count: 6540,
    comment_count: 218,
    share_count: 890,
    bookmark_count: 2340,
    engagement_score: 88.2,
    is_active: true,
    created_at: "2026-03-09T18:00:00Z",
    updated_at: "2026-03-09T18:00:00Z",
    creator: { id: "c2", username: "tasty_mike", display_name: "Mike Johnson", avatar_url: null, is_verified: true },
    restaurant: { id: "r2", name: "Sakura Sushi", slug: "sakura-sushi", cuisine_type: ["Japanese", "Sushi"] },
    is_liked: true,
    is_bookmarked: false,
  },
  {
    id: "v3",
    creator_id: "c3",
    restaurant_id: "r3",
    title: "Spicy Birria Tacos",
    description: "These birria tacos are dripping with consomme and cheese. The crunch is unreal!",
    video_url: "https://assets.mixkit.co/videos/42474/42474-720.mp4",
    thumbnail_url: null,
    duration_seconds: 18,
    aspect_ratio: "9:16",
    tags: ["tacos", "mexican", "birria", "spicy"],
    dish_name: "Birria Tacos",
    view_count: 203000,
    like_count: 15200,
    comment_count: 892,
    share_count: 2100,
    bookmark_count: 4500,
    engagement_score: 97.1,
    is_active: true,
    created_at: "2026-03-08T20:00:00Z",
    updated_at: "2026-03-08T20:00:00Z",
    creator: { id: "c3", username: "eat_with_ana", display_name: "Ana Rodriguez", avatar_url: null, is_verified: false },
    restaurant: { id: "r3", name: "La Cocina de Abuela", slug: "la-cocina-de-abuela", cuisine_type: ["Mexican"] },
    is_liked: false,
    is_bookmarked: true,
  },
  {
    id: "v4",
    creator_id: "c1",
    restaurant_id: "r4",
    title: "Truffle Butter Steak",
    description: "Dry-aged ribeye with truffle butter. This steakhouse does NOT miss.",
    video_url: "https://assets.mixkit.co/videos/45729/45729-720.mp4",
    thumbnail_url: null,
    duration_seconds: 20,
    aspect_ratio: "9:16",
    tags: ["steak", "american", "truffle"],
    dish_name: "Dry-Aged Ribeye",
    view_count: 156000,
    like_count: 11200,
    comment_count: 567,
    share_count: 1340,
    bookmark_count: 3200,
    engagement_score: 92.4,
    is_active: true,
    created_at: "2026-03-07T15:00:00Z",
    updated_at: "2026-03-07T15:00:00Z",
    creator: { id: "c1", username: "foodie_sarah", display_name: "Sarah Chen", avatar_url: null, is_verified: true },
    restaurant: { id: "r4", name: "The Ember Room", slug: "the-ember-room", cuisine_type: ["American", "Steakhouse"] },
    is_liked: false,
    is_bookmarked: false,
  },
  {
    id: "v5",
    creator_id: "c4",
    restaurant_id: "r5",
    title: "Pad Thai Street Style",
    description: "Authentic pad thai cooked in a wok right in front of you. The flavors are perfectly balanced.",
    video_url: "https://assets.mixkit.co/videos/46010/46010-720.mp4",
    thumbnail_url: null,
    duration_seconds: 16,
    aspect_ratio: "9:16",
    tags: ["thai", "padthai", "streetfood"],
    dish_name: "Pad Thai",
    view_count: 67800,
    like_count: 4320,
    comment_count: 156,
    share_count: 345,
    bookmark_count: 890,
    engagement_score: 78.9,
    is_active: true,
    created_at: "2026-03-06T11:00:00Z",
    updated_at: "2026-03-06T11:00:00Z",
    creator: { id: "c4", username: "bites_by_jay", display_name: "Jay Patel", avatar_url: null, is_verified: false },
    restaurant: { id: "r5", name: "Bangkok Garden", slug: "bangkok-garden", cuisine_type: ["Thai"] },
    is_liked: false,
    is_bookmarked: false,
  },
  {
    id: "v6",
    creator_id: "c2",
    restaurant_id: "r6",
    title: "Butter Chicken Heaven",
    description: "Creamy, rich butter chicken with the fluffiest naan bread. This place is a hidden gem!",
    video_url: "https://assets.mixkit.co/videos/46673/46673-720.mp4",
    thumbnail_url: null,
    duration_seconds: 19,
    aspect_ratio: "9:16",
    tags: ["indian", "butterchicken", "curry"],
    dish_name: "Butter Chicken",
    view_count: 98500,
    like_count: 7100,
    comment_count: 289,
    share_count: 678,
    bookmark_count: 1560,
    engagement_score: 85.3,
    is_active: true,
    created_at: "2026-03-05T14:00:00Z",
    updated_at: "2026-03-05T14:00:00Z",
    creator: { id: "c2", username: "tasty_mike", display_name: "Mike Johnson", avatar_url: null, is_verified: true },
    restaurant: { id: "r6", name: "Spice Route", slug: "spice-route", cuisine_type: ["Indian"] },
    is_liked: false,
    is_bookmarked: false,
  },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "r1", owner_id: null, name: "Bella Napoli", slug: "bella-napoli",
    description: "Authentic Neapolitan pizza and pasta in a cozy, rustic setting. Wood-fired oven imported directly from Naples.",
    cuisine_type: ["Italian", "Pizza"], price_level: 2, phone: "(555) 123-4567",
    email: "info@bellanapoli.com", website: "https://bellanapoli.com",
    address_line1: "123 Main Street", address_line2: null, city: "New York",
    state: "NY", zip_code: "10001", country: "US",
    latitude: 40.7484, longitude: -73.9967,
    operating_hours: { mon: { open: "11:00", close: "22:00" }, tue: { open: "11:00", close: "22:00" }, wed: { open: "11:00", close: "22:00" }, thu: { open: "11:00", close: "23:00" }, fri: { open: "11:00", close: "23:00" }, sat: { open: "10:00", close: "23:00" }, sun: { open: "10:00", close: "21:00" } },
    cover_image_url: null, cover_video_url: null, gallery_urls: [],
    average_rating: 4.7, total_reviews: 328, total_videos: 12,
    accepts_reservations: true, accepts_online_orders: true, is_featured: true, is_active: true,
    created_at: "2025-01-15T00:00:00Z", updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "r2", owner_id: null, name: "Sakura Sushi", slug: "sakura-sushi",
    description: "Premium omakase experience with fish flown in daily from Tokyo's Tsukiji market.",
    cuisine_type: ["Japanese", "Sushi"], price_level: 4, phone: "(555) 234-5678",
    email: null, website: null,
    address_line1: "456 Oak Avenue", address_line2: "Suite 200", city: "New York",
    state: "NY", zip_code: "10002", country: "US",
    latitude: 40.7527, longitude: -73.9772,
    operating_hours: { tue: { open: "17:00", close: "22:00" }, wed: { open: "17:00", close: "22:00" }, thu: { open: "17:00", close: "22:00" }, fri: { open: "17:00", close: "23:00" }, sat: { open: "17:00", close: "23:00" }, sun: { open: "17:00", close: "21:00" } },
    cover_image_url: null, cover_video_url: null, gallery_urls: [],
    average_rating: 4.9, total_reviews: 156, total_videos: 8,
    accepts_reservations: true, accepts_online_orders: false, is_featured: true, is_active: true,
    created_at: "2025-02-01T00:00:00Z", updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "r3", owner_id: null, name: "La Cocina de Abuela", slug: "la-cocina-de-abuela",
    description: "Traditional Mexican home cooking just like grandma used to make. Famous for our birria tacos.",
    cuisine_type: ["Mexican"], price_level: 1, phone: "(555) 345-6789",
    email: null, website: null,
    address_line1: "789 Elm Street", address_line2: null, city: "New York",
    state: "NY", zip_code: "10003", country: "US",
    latitude: 40.7316, longitude: -73.9897,
    operating_hours: { mon: { open: "09:00", close: "21:00" }, tue: { open: "09:00", close: "21:00" }, wed: { open: "09:00", close: "21:00" }, thu: { open: "09:00", close: "21:00" }, fri: { open: "09:00", close: "22:00" }, sat: { open: "08:00", close: "22:00" }, sun: { open: "08:00", close: "20:00" } },
    cover_image_url: null, cover_video_url: null, gallery_urls: [],
    average_rating: 4.5, total_reviews: 512, total_videos: 18,
    accepts_reservations: false, accepts_online_orders: true, is_featured: false, is_active: true,
    created_at: "2025-03-01T00:00:00Z", updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "r4", owner_id: null, name: "The Ember Room", slug: "the-ember-room",
    description: "Premium steakhouse featuring dry-aged cuts and an extensive wine list in an upscale atmosphere.",
    cuisine_type: ["American", "Steakhouse"], price_level: 4, phone: "(555) 456-7890",
    email: "reserve@theemberroom.com", website: null,
    address_line1: "321 Park Avenue", address_line2: null, city: "New York",
    state: "NY", zip_code: "10004", country: "US",
    latitude: 40.7580, longitude: -73.9712,
    operating_hours: { mon: { open: "17:00", close: "23:00" }, tue: { open: "17:00", close: "23:00" }, wed: { open: "17:00", close: "23:00" }, thu: { open: "17:00", close: "23:00" }, fri: { open: "17:00", close: "00:00" }, sat: { open: "16:00", close: "00:00" }, sun: { open: "16:00", close: "22:00" } },
    cover_image_url: null, cover_video_url: null, gallery_urls: [],
    average_rating: 4.8, total_reviews: 234, total_videos: 9,
    accepts_reservations: true, accepts_online_orders: false, is_featured: true, is_active: true,
    created_at: "2025-01-20T00:00:00Z", updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "r5", owner_id: null, name: "Bangkok Garden", slug: "bangkok-garden",
    description: "Authentic Thai street food experience with dishes cooked in traditional woks over high heat.",
    cuisine_type: ["Thai"], price_level: 2, phone: "(555) 567-8901",
    email: null, website: null,
    address_line1: "654 Broadway", address_line2: null, city: "New York",
    state: "NY", zip_code: "10005", country: "US",
    latitude: 40.7245, longitude: -73.9980,
    operating_hours: { mon: { open: "11:30", close: "22:00" }, tue: { open: "11:30", close: "22:00" }, wed: { open: "11:30", close: "22:00" }, thu: { open: "11:30", close: "22:00" }, fri: { open: "11:30", close: "23:00" }, sat: { open: "12:00", close: "23:00" }, sun: { open: "12:00", close: "21:00" } },
    cover_image_url: null, cover_video_url: null, gallery_urls: [],
    average_rating: 4.3, total_reviews: 445, total_videos: 14,
    accepts_reservations: true, accepts_online_orders: true, is_featured: false, is_active: true,
    created_at: "2025-04-01T00:00:00Z", updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "r6", owner_id: null, name: "Spice Route", slug: "spice-route",
    description: "Northern Indian cuisine with recipes passed down through five generations. Our butter chicken is legendary.",
    cuisine_type: ["Indian"], price_level: 2, phone: "(555) 678-9012",
    email: null, website: null,
    address_line1: "987 Lexington Ave", address_line2: null, city: "New York",
    state: "NY", zip_code: "10006", country: "US",
    latitude: 40.7690, longitude: -73.9625,
    operating_hours: { mon: { open: "11:00", close: "22:00" }, tue: { open: "11:00", close: "22:00" }, wed: { open: "11:00", close: "22:00" }, thu: { open: "11:00", close: "22:00" }, fri: { open: "11:00", close: "23:00" }, sat: { open: "11:00", close: "23:00" }, sun: { open: "12:00", close: "21:00" } },
    cover_image_url: null, cover_video_url: null, gallery_urls: [],
    average_rating: 4.6, total_reviews: 389, total_videos: 11,
    accepts_reservations: true, accepts_online_orders: true, is_featured: false, is_active: true,
    created_at: "2025-05-01T00:00:00Z", updated_at: "2026-03-15T00:00:00Z",
  },
];

export const MOCK_MENU_CATEGORIES: Record<string, MenuCategory[]> = {
  r1: [
    { id: "mc1", restaurant_id: "r1", name: "Appetizers", description: null, sort_order: 0, is_active: true, created_at: "" },
    { id: "mc2", restaurant_id: "r1", name: "Pizza", description: null, sort_order: 1, is_active: true, created_at: "" },
    { id: "mc3", restaurant_id: "r1", name: "Pasta", description: null, sort_order: 2, is_active: true, created_at: "" },
    { id: "mc4", restaurant_id: "r1", name: "Desserts", description: null, sort_order: 3, is_active: true, created_at: "" },
  ],
};

export const MOCK_MENU_ITEMS: Record<string, MenuItem[]> = {
  r1: [
    { id: "mi1", restaurant_id: "r1", category_id: "mc1", name: "Bruschetta", description: "Toasted bread with fresh tomatoes, garlic, and basil", price: 12.99, image_url: null, tags: ["vegetarian"], calories: 280, customizations: [], is_popular: true, is_available: true, sort_order: 0, created_at: "", updated_at: "" },
    { id: "mi2", restaurant_id: "r1", category_id: "mc1", name: "Arancini", description: "Crispy risotto balls stuffed with mozzarella", price: 14.99, image_url: null, tags: ["vegetarian"], calories: 420, customizations: [], is_popular: false, is_available: true, sort_order: 1, created_at: "", updated_at: "" },
    { id: "mi3", restaurant_id: "r1", category_id: "mc1", name: "Calamari Fritti", description: "Lightly fried calamari with marinara sauce", price: 15.99, image_url: null, tags: ["seafood"], calories: 380, customizations: [], is_popular: true, is_available: true, sort_order: 2, created_at: "", updated_at: "" },
    { id: "mi4", restaurant_id: "r1", category_id: "mc2", name: "Margherita Pizza", description: "San Marzano tomatoes, fresh mozzarella, basil", price: 18.99, image_url: null, tags: ["vegetarian", "signature"], calories: 820, customizations: [{ name: "Size", required: true, options: [{ label: "10 inch", price_delta: 0 }, { label: "14 inch", price_delta: 4 }, { label: "18 inch", price_delta: 8 }] }], is_popular: true, is_available: true, sort_order: 0, created_at: "", updated_at: "" },
    { id: "mi5", restaurant_id: "r1", category_id: "mc2", name: "Diavola Pizza", description: "Spicy salami, chili flakes, mozzarella", price: 21.99, image_url: null, tags: ["spicy"], calories: 920, customizations: [{ name: "Size", required: true, options: [{ label: "10 inch", price_delta: 0 }, { label: "14 inch", price_delta: 4 }, { label: "18 inch", price_delta: 8 }] }], is_popular: true, is_available: true, sort_order: 1, created_at: "", updated_at: "" },
    { id: "mi6", restaurant_id: "r1", category_id: "mc2", name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, fontina, parmesan", price: 22.99, image_url: null, tags: ["vegetarian"], calories: 950, customizations: [], is_popular: false, is_available: true, sort_order: 2, created_at: "", updated_at: "" },
    { id: "mi7", restaurant_id: "r1", category_id: "mc3", name: "Cacio e Pepe", description: "Classic Roman pasta with pecorino and black pepper", price: 19.99, image_url: null, tags: ["vegetarian", "signature"], calories: 680, customizations: [], is_popular: true, is_available: true, sort_order: 0, created_at: "", updated_at: "" },
    { id: "mi8", restaurant_id: "r1", category_id: "mc3", name: "Bolognese", description: "Slow-cooked meat ragu with pappardelle", price: 22.99, image_url: null, tags: [], calories: 780, customizations: [], is_popular: false, is_available: true, sort_order: 1, created_at: "", updated_at: "" },
    { id: "mi9", restaurant_id: "r1", category_id: "mc4", name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 11.99, image_url: null, tags: ["vegetarian"], calories: 450, customizations: [], is_popular: true, is_available: true, sort_order: 0, created_at: "", updated_at: "" },
    { id: "mi10", restaurant_id: "r1", category_id: "mc4", name: "Panna Cotta", description: "Vanilla bean cream with berry compote", price: 10.99, image_url: null, tags: ["vegetarian", "gluten-free"], calories: 320, customizations: [], is_popular: false, is_available: true, sort_order: 1, created_at: "", updated_at: "" },
  ],
};

export const MOCK_REVIEWS: Record<string, ReviewWithProfile[]> = {
  r1: [
    { id: "rev1", user_id: "u1", restaurant_id: "r1", order_id: null, rating: 5, title: "Best pizza in NYC!", body: "The Margherita pizza is perfection. Crispy crust, fresh ingredients, and the ambiance is wonderful. Will definitely come back!", image_urls: [], helpful_count: 24, created_at: "2026-03-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z", profile: { username: "pizza_lover", display_name: "Alex Kim", avatar_url: null } },
    { id: "rev2", user_id: "u2", restaurant_id: "r1", order_id: null, rating: 4, title: "Great food, a bit pricey", body: "Everything we ordered was delicious. The Cacio e Pepe was outstanding. Only knocking off a star because it's a bit expensive for the portion sizes.", image_urls: [], helpful_count: 12, created_at: "2026-02-20T00:00:00Z", updated_at: "2026-02-20T00:00:00Z", profile: { username: "foodie99", display_name: "Jordan Lee", avatar_url: null } },
    { id: "rev3", user_id: "u3", restaurant_id: "r1", order_id: null, rating: 5, title: "Perfect date night spot", body: "Romantic atmosphere, incredible food, and the staff was so attentive. The tiramisu is a must-try!", image_urls: [], helpful_count: 18, created_at: "2026-02-14T00:00:00Z", updated_at: "2026-02-14T00:00:00Z", profile: { username: "date_night_pro", display_name: "Riley Martinez", avatar_url: null } },
  ],
};

export const MOCK_CREATORS: CreatorWithProfile[] = [
  { id: "c1", bio: "NYC food explorer | 500+ restaurants reviewed | Helping you find the best bites in the city", total_followers: 125000, total_likes: 890000, total_videos: 245, is_verified: true, created_at: "", updated_at: "", profile: { username: "foodie_sarah", display_name: "Sarah Chen", avatar_url: null }, is_following: false },
  { id: "c2", bio: "Food photographer & video creator | Always hunting for the next great meal", total_followers: 89000, total_likes: 560000, total_videos: 178, is_verified: true, created_at: "", updated_at: "", profile: { username: "tasty_mike", display_name: "Mike Johnson", avatar_url: null }, is_following: true },
  { id: "c3", bio: "Mexican food enthusiast | Taco connoisseur | Supporting local restaurants", total_followers: 45000, total_likes: 320000, total_videos: 92, is_verified: false, created_at: "", updated_at: "", profile: { username: "eat_with_ana", display_name: "Ana Rodriguez", avatar_url: null }, is_following: false },
  { id: "c4", bio: "Street food lover | Asian cuisine specialist | Eat with me!", total_followers: 32000, total_likes: 210000, total_videos: 67, is_verified: false, created_at: "", updated_at: "", profile: { username: "bites_by_jay", display_name: "Jay Patel", avatar_url: null }, is_following: false },
];
