import { Database } from "./database";

// Table row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type MenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type Creator = Database["public"]["Tables"]["creators"]["Row"];
export type Video = Database["public"]["Tables"]["videos"]["Row"];
export type Reservation = Database["public"]["Tables"]["reservations"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];

// Extended types with joins
export type VideoWithDetails = Video & {
  creator: Pick<Profile, "id" | "username" | "display_name" | "avatar_url"> & {
    is_verified: boolean;
  };
  restaurant: Pick<Restaurant, "id" | "name" | "slug" | "cuisine_type"> | null;
  is_liked: boolean;
  is_bookmarked: boolean;
};

export type RestaurantWithDistance = Restaurant & {
  distance_km?: number;
};

export type ReviewWithProfile = Review & {
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">;
};

export type CreatorWithProfile = Creator & {
  profile: Pick<Profile, "username" | "display_name" | "avatar_url">;
  is_following: boolean;
};

export type OrderWithItems = Order & {
  restaurant: Pick<Restaurant, "name" | "slug" | "cover_image_url">;
  items: (OrderItem & {
    menu_item: Pick<MenuItem, "name" | "image_url">;
  })[];
};

// Cart types
export type CartItem = {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: { name: string; option: string; priceDelta: number }[];
  specialInstructions: string;
  totalPrice: number;
};

export type Cart = {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  orderType: "delivery" | "pickup";
  deliveryAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    instructions?: string;
  };
  tip: number;
};

// Navigation params
export type ReservationStep = "date" | "party" | "time" | "confirm" | "success";
