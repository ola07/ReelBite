export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          phone: string | null;
          location_lat: number | null;
          location_lng: number | null;
          is_creator: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          is_creator?: boolean;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          is_creator?: boolean;
        };
        Relationships: never[];
      };
      restaurants: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          cuisine_type: string[];
          price_level: number;
          phone: string | null;
          email: string | null;
          website: string | null;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string | null;
          zip_code: string | null;
          country: string;
          latitude: number;
          longitude: number;
          operating_hours: Json;
          cover_image_url: string | null;
          cover_video_url: string | null;
          gallery_urls: string[];
          average_rating: number;
          total_reviews: number;
          total_videos: number;
          accepts_reservations: boolean;
          accepts_online_orders: boolean;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          owner_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          cuisine_type: string[];
          price_level: number;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state?: string | null;
          zip_code?: string | null;
          country: string;
          latitude: number;
          longitude: number;
          operating_hours: Json;
          cover_image_url?: string | null;
          cover_video_url?: string | null;
          gallery_urls?: string[];
          accepts_reservations?: boolean;
          accepts_online_orders?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Insert"]>;
        Relationships: never[];
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          restaurant_id: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["menu_categories"]["Insert"]>;
        Relationships: never[];
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          tags: string[];
          calories: number | null;
          customizations: Json;
          is_popular: boolean;
          is_available: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          restaurant_id: string;
          category_id: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          tags?: string[];
          calories?: number | null;
          customizations?: Json;
          is_popular?: boolean;
          is_available?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["menu_items"]["Insert"]>;
        Relationships: never[];
      };
      creators: {
        Row: {
          id: string;
          bio: string | null;
          total_followers: number;
          total_likes: number;
          total_videos: number;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: { id: string; bio?: string | null; is_verified?: boolean };
        Update: { bio?: string | null; is_verified?: boolean };
        Relationships: never[];
      };
      videos: {
        Row: {
          id: string;
          creator_id: string;
          restaurant_id: string | null;
          title: string | null;
          description: string | null;
          video_url: string;
          thumbnail_url: string | null;
          duration_seconds: number | null;
          aspect_ratio: string;
          tags: string[];
          dish_name: string | null;
          view_count: number;
          like_count: number;
          comment_count: number;
          share_count: number;
          bookmark_count: number;
          engagement_score: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          creator_id: string;
          restaurant_id?: string | null;
          title?: string | null;
          description?: string | null;
          video_url: string;
          thumbnail_url?: string | null;
          duration_seconds?: number | null;
          aspect_ratio?: string;
          tags?: string[];
          dish_name?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["videos"]["Insert"]>;
        Relationships: never[];
      };
      reservations: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          reservation_date: string;
          reservation_time: string;
          party_size: number;
          status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
          special_requests: string | null;
          confirmation_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          restaurant_id: string;
          reservation_date: string;
          reservation_time: string;
          party_size: number;
          status?: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
          special_requests?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reservations"]["Insert"]>;
        Relationships: never[];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          order_type: "delivery" | "pickup";
          status: "cart" | "placed" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "picked_up" | "cancelled";
          delivery_address: Json | null;
          subtotal: number;
          tax: number;
          delivery_fee: number;
          tip: number;
          total: number;
          estimated_ready_at: string | null;
          special_instructions: string | null;
          order_number: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          restaurant_id: string;
          order_type: "delivery" | "pickup";
          status?: "cart" | "placed" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "picked_up" | "cancelled";
          delivery_address?: Json | null;
          subtotal: number;
          tax: number;
          delivery_fee: number;
          tip: number;
          total: number;
          estimated_ready_at?: string | null;
          special_instructions?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: never[];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          customizations: Json;
          special_instructions: string | null;
          created_at: string;
        };
        Insert: {
          order_id: string;
          menu_item_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          customizations?: Json;
          special_instructions?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: never[];
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          order_id: string | null;
          rating: number;
          title: string | null;
          body: string | null;
          image_urls: string[];
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          restaurant_id: string;
          order_id?: string | null;
          rating: number;
          title?: string | null;
          body?: string | null;
          image_urls?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: never[];
      };
      likes: {
        Row: { user_id: string; video_id: string; created_at: string };
        Insert: { user_id: string; video_id: string };
        Update: Record<string, never>;
        Relationships: never[];
      };
      bookmarks: {
        Row: { user_id: string; video_id: string; created_at: string };
        Insert: { user_id: string; video_id: string };
        Update: Record<string, never>;
        Relationships: never[];
      };
      follows: {
        Row: { follower_id: string; following_id: string; created_at: string };
        Insert: { follower_id: string; following_id: string };
        Update: Record<string, never>;
        Relationships: never[];
      };
      comments: {
        Row: {
          id: string;
          video_id: string;
          user_id: string;
          parent_id: string | null;
          body: string;
          like_count: number;
          created_at: string;
        };
        Insert: {
          video_id: string;
          user_id: string;
          parent_id?: string | null;
          body: string;
        };
        Update: { body?: string };
        Relationships: never[];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
