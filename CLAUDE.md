# ReelBite - Claude Code Guidelines

## Project Overview
ReelBite is a TikTok-style food discovery and restaurant ordering app built with React Native (Expo). Users discover restaurants through short-form video reviews, explore by vibes/moods/cravings, order food, and make reservations.

## Tech Stack
- **Framework:** React Native 0.83 + Expo 55 (SDK 55)
- **Language:** TypeScript 5.9 (strict mode)
- **Routing:** Expo Router 55 (file-based, typed routes)
- **Styling:** NativeWind 4.2 (Tailwind CSS for RN) + StyleSheet
- **State:** Zustand 5 (client) + React Query 5 (server)
- **Backend:** Supabase (auth, database, storage)
- **Icons:** Lucide React Native
- **Animations:** React Native Reanimated 4

## Commands
```bash
npm start          # Start Expo dev server
npm run web        # Start web preview
npm run ios        # Start iOS simulator
npm run android    # Start Android emulator
npx tsc --noEmit   # Type-check without emitting
```

## Project Structure
```
ReelBite/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab navigation (feed, explore, orders, profile)
│   ├── auth/               # Auth stack (welcome, login, signup)
│   ├── restaurant/[slug]/  # Restaurant detail, order, reserve
│   └── creator/            # Creator profile, analytics, earnings, collabs
├── components/             # Reusable components
│   ├── feed/               # Video feed (VideoCard, VideoOverlay, ReviewCard)
│   ├── explore/            # Discovery (SearchBar, FilterChips, RestaurantCard)
│   ├── restaurant/         # Restaurant details (VideoMenuItem)
│   ├── creator/            # Creator (CriticBadge)
│   ├── shared/             # Shared (Avatar, GlassCard, RatingStars, etc)
│   └── ui/                 # Base UI (ActionButton, Badge)
├── stores/                 # Zustand stores (auth, cart, feed)
├── types/                  # TypeScript types (database.ts, index.ts)
├── lib/                    # Utils, constants, supabase client, mock data
├── hooks/                  # Custom React hooks
└── assets/                 # Images, fonts, icons
```

## Key Conventions

### Styling
- Use `StyleSheet.create()` for all component styles (performance-critical)
- NativeWind/Tailwind only for simple utility classes
- Color tokens from `COLORS` in `lib/constants.ts` (emerald green theme, NOT coral red)
- `COLORS.coral` = `#10B981` (emerald green - the primary brand color)
- Dark theme by default (`COLORS.dark` = `#060E0B`)

### Components
- Functional components with TypeScript props interfaces
- Co-locate styles at bottom of file in `StyleSheet.create()`
- Use `lucide-react-native` for all icons (never import from other icon libraries)
- Use `expo-linear-gradient` for gradient backgrounds
- Use `expo-blur` for glassmorphism effects

### State Management
- `auth-store.ts` - Session, user, profile (Zustand)
- `cart-store.ts` - Cart items, order type, pricing (Zustand with computed values)
- `feed-store.ts` - Current video index, mute state (Zustand)
- Server data should use React Query (not yet fully implemented)

### Navigation
- File-based routing via Expo Router
- Dynamic routes: `[slug]` for restaurants, `[username]` for creators
- Tab bar: custom blur tab bar in `app/(tabs)/_layout.tsx`
- Use `router.push()` for navigation, `router.back()` for back

### Types
- All database types derived from Supabase schema in `types/database.ts`
- Extended join types in `types/index.ts` (VideoWithDetails, OrderWithItems, etc)
- Always type component props with explicit interfaces

### Data
- Currently using mock data from `lib/mock-data.ts` for development
- Production will use Supabase queries
- Mock data includes: videos, creators, restaurants, menu items, reviews, tags, badges, tiers

### Formatting Utilities (lib/utils.ts)
- `formatCount()` - 1.2K, 5.4M format
- `formatCurrency()` - $12.50 format
- `formatRelativeTime()` - "2h ago" format
- `formatPriceLevel()` - $ to $$$$ display

## Important Notes
- Portrait orientation only
- Dark mode is the only theme
- iOS bundle ID: `com.reelbite.app`
- Android package: `com.reelbite.app`
- The app name visible to users is "ReelBite" (capital R and B)
- Video feed uses FlatList with `pagingEnabled` for snap scrolling
- Double-tap to like on video cards uses Reanimated gesture detection
