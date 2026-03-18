# ReelBite Architecture

## System Overview

ReelBite is a video-first food discovery platform. Users scroll through short-form restaurant/dish review videos (TikTok-style), discover restaurants by mood/vibe/craving, place food orders, and make reservations. Creators earn commissions when their videos drive orders.

```
┌─────────────────────────────────────────────────────┐
│                    ReelBite App                      │
│              React Native + Expo 55                  │
├────────────┬────────────┬───────────┬───────────────┤
│   Feed     │  Explore   │  Orders   │   Profile     │
│  (Videos)  │ (Discovery)│ (History) │  (Settings)   │
├────────────┴────────────┴───────────┴───────────────┤
│              Expo Router (File-based)                │
├─────────────────────────────────────────────────────┤
│  Zustand (Client State)  │  React Query (Server)    │
├─────────────────────────────────────────────────────┤
│              Supabase (Backend)                      │
│   Auth │ PostgreSQL │ Storage │ Realtime │ Edge Fns  │
└─────────────────────────────────────────────────────┘
```

## Navigation Architecture

```
Root Layout (_layout.tsx)
├── (tabs)/ ─── Custom Blur Tab Bar
│   ├── feed.tsx          → Home video feed
│   ├── explore.tsx       → Restaurant discovery
│   ├── orders.tsx        → Order history
│   └── profile.tsx       → User profile
│
├── auth/
│   ├── welcome.tsx       → Onboarding
│   ├── login.tsx         → Sign in
│   └── signup.tsx        → Registration
│
├── restaurant/[slug]/
│   ├── index.tsx         → Restaurant detail (menu, reviews, about)
│   ├── order.tsx         → Checkout flow
│   └── reserve.tsx       → Reservation booking
│
└── creator/
    ├── [username].tsx    → Creator profile + video grid
    ├── analytics.tsx     → Audience & performance analytics
    ├── earnings.tsx      → Pay-per-sale + affiliate commissions
    └── collaborations.tsx→ Restaurant partnerships
```

## Data Architecture

### Database Schema (Supabase PostgreSQL)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   profiles   │────<│   creators   │────<│   videos    │
│              │     │              │     │             │
│ id (PK/FK)  │     │ id (PK/FK)  │     │ creator_id  │
│ username     │     │ bio          │     │ restaurant_id│
│ display_name │     │ followers    │     │ video_url   │
│ avatar_url   │     │ likes        │     │ dish_name   │
│ is_creator   │     │ is_verified  │     │ view_count  │
│ location     │     │              │     │ like_count  │
└──────┬───────┘     └──────────────┘     └──────┬──────┘
       │                                         │
       │  ┌──────────────┐                       │
       ├─<│   reviews    │     ┌─────────────────┤
       │  │ rating       │     │    ┌────────────┤
       │  │ title, body  │     │    │   ┌────────┤
       │  └──────────────┘     │    │   │        │
       │                 ┌─────┴┐ ┌─┴──┐│ ┌──────┴──┐
       │                 │likes ││book-││ │comments  │
       │                 │      ││marks││ │          │
       │                 └──────┘└─────┘│ └──────────┘
       │                                │
       │  ┌──────────────┐     ┌────────┴────┐
       ├─<│ reservations │     │ restaurants  │
       │  │ date, time   │     │ name, slug   │
       │  │ party_size   │     │ cuisine_type │
       │  │ status       │     │ price_level  │
       │  └──────────────┘     │ rating       │
       │                       │ location     │
       │  ┌──────────────┐     └──────┬───────┘
       └─<│   orders     │            │
          │ order_type   │────────────┘
          │ status       │
          │ total        │──<┌──────────────┐
          └──────────────┘   │ order_items  │
                             │ menu_item_id │──>┌────────────┐
                             │ quantity     │   │ menu_items  │
                             └──────────────┘   │ price       │
                                                │ category_id │──>┌────────────────┐
                                                └─────────────┘   │ menu_categories │
                                                                  └─────────────────┘
Junction Tables:
  - likes (user_id, video_id)
  - bookmarks (user_id, video_id)
  - follows (follower_id, following_id)
```

### State Management

```
┌──────────────────────────────────────────────────┐
│                   Client State                    │
│                   (Zustand)                       │
├──────────────┬──────────────┬────────────────────┤
│  auth-store  │  cart-store  │   feed-store       │
│              │              │                    │
│ session      │ items[]      │ currentIndex       │
│ user         │ restaurantId │ isMuted            │
│ profile      │ orderType    │                    │
│ isLoading    │ tip          │                    │
│              │ subtotal()   │                    │
│ signOut()    │ tax()        │ toggleMute()       │
│ setSession() │ total()      │ setCurrentIndex()  │
└──────────────┴──────────────┴────────────────────┘

┌──────────────────────────────────────────────────┐
│                  Server State                     │
│              (React Query - planned)              │
├──────────────────────────────────────────────────┤
│ useVideos()  useRestaurant()  useOrders()        │
│ useCreator() useReviews()     useReservations()  │
└──────────────────────────────────────────────────┘
```

## Component Architecture

### Component Hierarchy

```
App Root
└── Root Layout (SafeArea, StatusBar, Providers)
    ├── Tab Navigator (Custom Blur Tab Bar)
    │   ├── Feed Screen
    │   │   ├── FeedCategories (For You | Trending | Near Me | Following)
    │   │   └── FlatList (pagingEnabled, vertical snap)
    │   │       └── VideoCard (full-screen)
    │   │           ├── VideoPlayer (expo-av)
    │   │           ├── VideoOverlay (creator, restaurant, dish info)
    │   │           ├── VideoActions (like, comment, bookmark, share)
    │   │           ├── CommunityBadge (trending, local favorite, community pick)
    │   │           ├── CriticBadge (rising, established, elite, critic)
    │   │           └── ReviewCard (mini-blog: rating, title, body)
    │   │
    │   ├── Explore Screen
    │   │   ├── SearchBar
    │   │   ├── Mode Toggle (Cuisine | Discover)
    │   │   ├── FilterChips (cuisine types)
    │   │   ├── DiscoverySection (vibes, moods, cravings, dietary)
    │   │   ├── LocalHighlights (hot, rising, most reviewed, new)
    │   │   └── RestaurantCard (grid layout)
    │   │
    │   ├── Orders Screen
    │   │   ├── Tab Toggle (Active | Past)
    │   │   └── OrderCard (status, items, restaurant)
    │   │
    │   └── Profile Screen
    │       ├── ProfileHeader (avatar, name, stats)
    │       └── Menu Links (favorites, saved, reservations, orders, reviews)
    │
    ├── Restaurant Stack
    │   ├── RestaurantDetail (tabs: menu, reviews, about)
    │   │   └── VideoMenuItem (menu item with video preview)
    │   ├── OrderCheckout (cart summary, payment)
    │   └── ReservationFlow (date → party → time → confirm → success)
    │
    ├── Creator Stack
    │   ├── CreatorProfile (video grid, creator tools)
    │   │   └── CriticBadge (tier display)
    │   ├── Analytics (views, likes, demographics, peak times)
    │   ├── Earnings (pay-per-sale, affiliate commissions)
    │   └── Collaborations (sponsored content, partnerships)
    │
    └── Auth Stack
        ├── Welcome (feature highlights)
        ├── Login (email/password + social)
        └── Signup (registration form)
```

### Component Categories

| Category | Purpose | Examples |
|----------|---------|---------|
| `feed/` | Video feed rendering | VideoCard, VideoPlayer, VideoOverlay, ReviewCard |
| `explore/` | Restaurant discovery | SearchBar, FilterChips, DiscoverySection, RestaurantCard |
| `restaurant/` | Restaurant details | VideoMenuItem |
| `creator/` | Creator tools | CriticBadge |
| `shared/` | Reusable across features | Avatar, GlassCard, RatingStars, PriceLevel, EmptyState |
| `ui/` | Base primitives | ActionButton, Badge |

## Design System

### Color Palette (Emerald Green Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `coral` | `#10B981` | Primary brand color (emerald green) |
| `coralLight` | `#34D399` | Hover/active states |
| `coralDark` | `#059669` | Pressed states |
| `amber` | `#F59E0B` | Warnings, ratings, secondary accent |
| `dark` | `#060E0B` | Background |
| `darkSurface` | `#0F1A15` | Card backgrounds |
| `darkElevated` | `#172820` | Elevated surfaces |
| `darkHover` | `#1F3329` | Hover states |
| `white` | `#FFFFFF` | Primary text |
| `textSecondary` | `#94A3B3` | Secondary text |
| `textTertiary` | `#5E7068` | Tertiary text |
| `success` | `#34D399` | Success states |
| `error` | `#EF4444` | Error states |

### Typography
- System fonts (no custom font files loaded)
- Font weights: 600 (semibold), 700 (bold) for emphasis
- Font sizes follow a scale: 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28

### Spacing
- Base unit: 4px
- Common: 8, 10, 12, 14, 16, 20, 24, 32, 40
- Border radius: 8 (small), 10-12 (medium), 14-16 (large), 18-20 (pill)

## Key Technical Decisions

### Video Feed
- **FlatList with `pagingEnabled`** for full-screen snap scrolling (TikTok-style)
- **expo-av** for video playback with mute toggle
- **Double-tap to like** using Reanimated gesture handling
- Community badges and review cards overlay on top of video

### Discovery System
- Dual-mode explore: **Cuisine** (filter by food type) and **Discover** (filter by vibe/mood/craving/dietary)
- 10 vibes, 6 moods, 8 cravings, 8 dietary options
- Local highlights with 4 categories: Hot, Rising, Most Reviewed, New Arrival

### Creator Monetization
- **Tiered creator levels:** Rising, Established, Elite, Verified Critic
- **Pay-per-sale:** Creators earn commission when their video drives an order
- **Affiliate commissions:** Per-restaurant rates (5-10%) for orders and reservations
- **Collaborations dashboard:** Manage sponsored content deals with restaurants
- **Analytics:** Audience demographics, peak engagement times, content performance

### Restaurant Features
- **Video menu items:** Each menu item can have an attached video preview
- **Multi-tab detail page:** Menu, Reviews, About sections
- **Full ordering flow:** Cart → Checkout → Order tracking
- **Reservation system:** Date → Party size → Time → Confirmation

## Performance Considerations
- `@shopify/flash-list` available for optimized list rendering
- `react-native-mmkv` for fast encrypted local storage
- `expo-image` for optimized image loading
- Reanimated for 60fps animations on the UI thread
- Mock data for development (no network latency)

## Security
- Supabase handles auth with JWT tokens
- AsyncStorage for session persistence
- Row Level Security (RLS) policies on all Supabase tables
- Environment variables via `.env.local` (not committed)
