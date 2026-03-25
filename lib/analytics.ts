import { Mixpanel } from 'mixpanel-react-native';

const TOKEN = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN ?? '';

const mixpanel = new Mixpanel(TOKEN, true);
mixpanel.init();

// ── Identity ──────────────────────────────────────────────────────────────────

export function identifyUser(userId: string, props?: Record<string, unknown>) {
  mixpanel.identify(userId);
  if (props) mixpanel.getPeople().set(props);
}

export function resetUser() {
  mixpanel.reset();
}

// ── Screen tracking ───────────────────────────────────────────────────────────

export function trackScreen(name: string, props?: Record<string, unknown>) {
  mixpanel.track('Screen View', { screen: name, ...props });
}

// ── Events ────────────────────────────────────────────────────────────────────

export const Analytics = {
  // Feed
  videoViewed: (videoId: string, restaurantId: string) =>
    mixpanel.track('Video Viewed', { videoId, restaurantId }),
  videoLiked: (videoId: string) =>
    mixpanel.track('Video Liked', { videoId }),
  videoShared: (videoId: string) =>
    mixpanel.track('Video Shared', { videoId }),
  videoCommented: (videoId: string) =>
    mixpanel.track('Video Commented', { videoId }),

  // Explore
  searchPerformed: (query: string) =>
    mixpanel.track('Search Performed', { query }),
  filterApplied: (filter: string) =>
    mixpanel.track('Filter Applied', { filter }),

  // Restaurant
  restaurantViewed: (restaurantId: string, name: string) =>
    mixpanel.track('Restaurant Viewed', { restaurantId, name }),
  menuItemViewed: (itemId: string, name: string) =>
    mixpanel.track('Menu Item Viewed', { itemId, name }),

  // Cart & Orders
  itemAddedToCart: (itemId: string, name: string, price: number) =>
    mixpanel.track('Item Added to Cart', { itemId, name, price }),
  itemRemovedFromCart: (itemId: string) =>
    mixpanel.track('Item Removed from Cart', { itemId }),
  orderPlaced: (orderId: string, total: number, itemCount: number) =>
    mixpanel.track('Order Placed', { orderId, total, itemCount }),
  reservationMade: (restaurantId: string, partySize: number) =>
    mixpanel.track('Reservation Made', { restaurantId, partySize }),

  // Auth
  signUp: (method: 'email' | 'google' | 'apple') =>
    mixpanel.track('Sign Up', { method }),
  login: (method: 'email' | 'google' | 'apple') =>
    mixpanel.track('Login', { method }),
  logout: () =>
    mixpanel.track('Logout'),

  // Creator
  creatorProfileViewed: (creatorId: string) =>
    mixpanel.track('Creator Profile Viewed', { creatorId }),
  videoUploaded: (videoId: string) =>
    mixpanel.track('Video Uploaded', { videoId }),
};
