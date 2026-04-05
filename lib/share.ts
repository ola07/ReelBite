import { Share, Platform } from "react-native";
import { trackReferral } from "./referral";

/** Share a restaurant link */
export async function shareRestaurant(params: {
  name: string;
  slug: string;
  restaurantId: string;
  userId?: string | null;
  creatorId?: string | null;
}) {
  const url = `https://reelbite.app/restaurant/${params.slug}`;

  await trackReferral({
    restaurantId: params.restaurantId,
    action: "website",
    userId: params.userId,
    creatorId: params.creatorId,
    metadata: { shared: true },
  });

  await Share.share({
    message: Platform.OS === "ios"
      ? `Check out ${params.name} on ReelBite!`
      : `Check out ${params.name} on ReelBite! ${url}`,
    url: Platform.OS === "ios" ? url : undefined,
    title: `${params.name} on ReelBite`,
  });
}

/** Share a video */
export async function shareVideo(params: {
  title: string;
  creatorUsername: string;
  restaurantName: string;
  videoId: string;
}) {
  const url = `https://reelbite.app/video/${params.videoId}`;

  await Share.share({
    message: Platform.OS === "ios"
      ? `${params.title} by @${params.creatorUsername} at ${params.restaurantName}`
      : `${params.title} by @${params.creatorUsername} at ${params.restaurantName} ${url}`,
    url: Platform.OS === "ios" ? url : undefined,
    title: params.title,
  });
}

/** Share a campaign */
export async function shareCampaign(params: {
  title: string;
  restaurantName: string;
  type: "deal" | "contest";
  campaignId: string;
}) {
  const url = `https://reelbite.app/campaigns/${params.campaignId}`;
  const typeLabel = params.type === "deal" ? "brand deal" : "contest";

  await Share.share({
    message: Platform.OS === "ios"
      ? `${params.restaurantName} has a ${typeLabel}: ${params.title}. Join on ReelBite!`
      : `${params.restaurantName} has a ${typeLabel}: ${params.title}. Join on ReelBite! ${url}`,
    url: Platform.OS === "ios" ? url : undefined,
    title: params.title,
  });
}
