import { Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "./supabase";

export type ReferralAction = "order" | "reservation" | "website" | "call" | "menu_view" | "direction";

interface ReferralParams {
  restaurantId: string;
  action: ReferralAction;
  userId?: string | null;
  creatorId?: string | null;
  videoId?: string | null;
  metadata?: Record<string, any>;
}

/** Generate a unique referral code for tracking */
function generateReferralCode(restaurantId: string, action: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `rb_${action}_${timestamp}_${random}`;
}

/** Build a tagged URL with ReelBite referral parameters */
export function buildTaggedUrl(baseUrl: string, params: {
  referralCode: string;
  action: ReferralAction;
  creatorId?: string | null;
  videoId?: string | null;
}): string {
  const url = new URL(baseUrl);
  url.searchParams.set("ref", "reelbite");
  url.searchParams.set("rb_code", params.referralCode);
  url.searchParams.set("rb_action", params.action);
  if (params.creatorId) url.searchParams.set("rb_creator", params.creatorId);
  if (params.videoId) url.searchParams.set("rb_video", params.videoId);
  return url.toString();
}

/** Track a referral action and optionally open the restaurant's URL */
export async function trackReferral(params: ReferralParams): Promise<string> {
  const referralCode = generateReferralCode(params.restaurantId, params.action);

  // Save to Supabase (fire and forget — don't block the user)
  // Cast to any since referrals table is new and not yet in generated types
  (supabase as any)
    .from("referrals")
    .insert({
      user_id: params.userId || null,
      restaurant_id: params.restaurantId,
      creator_id: params.creatorId || null,
      video_id: params.videoId || null,
      action: params.action,
      referral_code: referralCode,
      metadata: params.metadata || {},
    } as any)
    .then(({ error }: { error: any }) => {
      if (error) console.warn("Referral tracking failed:", error.message);
    });

  return referralCode;
}

/** Track and open restaurant website in in-app browser */
export async function openRestaurantLink(params: {
  url: string;
  restaurantId: string;
  action: ReferralAction;
  userId?: string | null;
  creatorId?: string | null;
  videoId?: string | null;
}): Promise<void> {
  const referralCode = await trackReferral({
    restaurantId: params.restaurantId,
    action: params.action,
    userId: params.userId,
    creatorId: params.creatorId,
    videoId: params.videoId,
  });

  const taggedUrl = buildTaggedUrl(params.url, {
    referralCode,
    action: params.action,
    creatorId: params.creatorId,
    videoId: params.videoId,
  });

  await WebBrowser.openBrowserAsync(taggedUrl, {
    toolbarColor: "#060E0B",
    controlsColor: "#10B981",
    dismissButtonStyle: "close",
  });
}

/** Track and open phone dialer */
export async function callRestaurant(params: {
  phone: string;
  restaurantId: string;
  userId?: string | null;
}): Promise<void> {
  await trackReferral({
    restaurantId: params.restaurantId,
    action: "call",
    userId: params.userId,
  });

  const phoneUrl = `tel:${params.phone.replace(/[^\d+]/g, "")}`;
  Linking.openURL(phoneUrl);
}

/** Track and open maps for directions */
export async function getDirections(params: {
  latitude: number;
  longitude: number;
  name: string;
  restaurantId: string;
  userId?: string | null;
}): Promise<void> {
  await trackReferral({
    restaurantId: params.restaurantId,
    action: "direction",
    userId: params.userId,
  });

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${params.latitude},${params.longitude}&destination_place_id=${encodeURIComponent(params.name)}`;
  Linking.openURL(mapsUrl);
}
