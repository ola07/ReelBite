# ReelBite - Product Requirements Document

## Product Vision

ReelBite is a video-first food discovery platform that transforms how people find and order from restaurants. By combining TikTok-style short-form video reviews with restaurant ordering and reservations, ReelBite creates an engaging, visual-first experience that connects food lovers, content creators, and restaurants.

**Tagline:** Discover food through video. Order in seconds.

## Target Users

### Primary Users
1. **Foodies (18-35)** - Want to discover new restaurants through authentic, engaging video content rather than static photos and text reviews
2. **Food Critics & Bloggers** - Need a platform to build their brand, monetize their content, and partner with restaurants
3. **Casual Diners** - Want quick, visual recommendations filtered by their current mood, vibe, or craving

### Secondary Users
4. **Restaurant Owners** - Want to attract customers through video content and creator partnerships
5. **Local Explorers** - Looking for hidden gems and trending spots in their area

## Core Features

### 1. Video Feed (Home Tab)

**Purpose:** Primary discovery mechanism through full-screen, vertically-scrolling video reviews.

**Requirements:**
- Full-screen vertical video feed with snap scrolling (TikTok-style UX)
- Category filters: For You (algorithmic), Trending, Near Me, Following
- Each video shows: creator info, restaurant name, dish name, description
- Interaction buttons: Like (double-tap or button), Comment, Bookmark, Share
- Mute/unmute toggle for audio
- Community badges overlay: Trending, Local Favorite, Community Pick
- Creator tier badges: Rising Creator, Established, Elite Creator, Verified Critic
- Mini-blog review cards: Expandable written review attached to videos with star rating, title, body, author, date

**Engagement Metrics:**
- View count, like count, comment count, share count, bookmark count
- Engagement score (algorithmic ranking signal)

### 2. Explore (Discovery Tab)

**Purpose:** Discover restaurants through multiple filtering dimensions beyond traditional cuisine search.

**Requirements:**

#### Cuisine Mode
- Filter by 20 cuisine types (Italian, Japanese, Mexican, Chinese, Indian, Thai, American, French, Korean, Mediterranean, Vietnamese, Ethiopian, Caribbean, BBQ, Seafood, Pizza, Sushi, Burgers, Vegan, Desserts)
- Grid of restaurant cards with rating, cuisine, price level

#### Discover Mode
- **Vibes** (10): Date Night, Casual, Family, Late Night, Brunch, Happy Hour, Cozy, Trendy, Outdoor, Live Music
- **Moods** (6): Adventurous, Comfort Food, Healthy, Indulgent, Quick Bite, Celebration
- **Cravings** (8): Spicy, Sweet, Savory, Fresh, Fried, Grilled, Raw, Smoky
- **Dietary** (8): Vegetarian, Vegan, Gluten-Free, Halal, Kosher, Keto, Dairy-Free, Nut-Free

#### Local Highlights
- Curated sections: Hot Right Now, Rising Stars, Most Reviewed, New Arrivals
- Each section shows top 5 restaurants with ranking

#### Search
- Text search for restaurants, cuisines, and dishes

### 3. Restaurant Detail

**Purpose:** Full restaurant profile with menu, reviews, and ordering capabilities.

**Requirements:**
- Three-tab layout: Menu, Reviews, About
- **Menu Tab:** Categorized menu items with prices, descriptions, tags, calorie info, and video previews
- **Reviews Tab:** Star ratings, written reviews with user profiles, helpful count
- **About Tab:** Description, location, hours, contact info, map
- Restaurant metadata: cuisine type, price level ($-$$$$), average rating, total reviews
- Support for both online ordering and reservations

### 4. Ordering System

**Purpose:** Seamless food ordering from video discovery to checkout.

**Requirements:**
- Cart management: Add items, remove items, adjust quantities
- Customizations: Per-item options with price deltas
- Special instructions per item
- Order type: Delivery or Pickup
- Pricing breakdown: Subtotal, tax (8.875%), delivery fee ($3.99), tip
- Order status tracking: Placed → Confirmed → Preparing → Ready → Out for Delivery → Delivered
- Order history with active/past tabs

### 5. Reservation System

**Purpose:** Table booking flow integrated with restaurant discovery.

**Requirements:**
- Multi-step flow: Date → Party Size → Time Slot → Confirmation → Success
- Party sizes: 1-12 guests
- Available time slots based on restaurant hours
- Special requests field
- Confirmation code generation
- Status tracking: Pending → Confirmed → Completed / Cancelled / No Show

### 6. Creator Tools

**Purpose:** Empower food critics and bloggers to build their brand and earn revenue.

#### 6a. Creator Profile
- Public profile with avatar, display name, username, bio
- Verified badge for authenticated creators
- **Tiered creator levels:**
  - Rising Creator (purple) - New creators building an audience
  - Established (emerald) - Consistent content with growing following
  - Elite Creator (gold) - Top-performing creators with large audience
  - Verified Critic (blue) - Professional food critics
- Stats: Followers, Total Likes, Total Videos
- Video grid gallery
- Follow/Unfollow functionality

#### 6b. Analytics Dashboard
- Period selector: 7 Days, 30 Days, 90 Days
- **Overview stats:** Total views, likes, new followers, avg watch time
- **Peak engagement times:** Hourly bar chart with posting recommendation
- **Engagement by day:** Daily bar chart showing best days to post
- **Audience demographics:**
  - Age distribution (18-24, 25-34, 35-44, 45-54, 55+)
  - Gender split
  - Top 5 cities
- **Content performance:** Ranked list of top videos by views, likes, saves, engagement rate

#### 6c. Earnings Dashboard
- Total earnings with period comparison (+/- % from previous period)
- Period selector: 7 Days, 30 Days, 90 Days, All Time
- Overview stats: Orders driven, video views, conversion rate
- **Top performing videos:** Ranked by earnings with view count and conversion rate
- **Recent sales:** Transaction feed with restaurant, dish, amount, and timestamp
- **Affiliate commissions:** Per-restaurant commission tracking
  - Restaurant name, commission type (Order/Reservation), rate (5-10%), total earned, referral count
- **Payout system:** Scheduled payouts, minimum threshold ($25), bank/PayPal

#### 6d. Collaborations Dashboard
- Summary cards: Total earned, active collaborations, pending offers
- Filter tabs: All, Active, Pending, Completed
- **Collaboration types:** Sponsored Review, Featured Video, Menu Launch, Event Coverage
- **Collaboration details:** Restaurant name/cuisine, budget, deliverables, deadline, notes
- **Actions:** Accept/Decline for pending, Message for active
- Status tracking: Pending → In Progress → Completed / Declined

### 7. User Profile

**Purpose:** Account management and personal content access.

**Requirements:**
- Profile header with avatar, name, and stats
- Quick stats: Favorites, Reservations, Orders, Reviews
- Menu links: Favorites, Saved Videos, Reservations, Orders, Reviews
- Settings: Account Settings, Sign Out
- Creator mode toggle (is_creator flag)

### 8. Authentication

**Purpose:** Secure user registration and login.

**Requirements:**
- Welcome/onboarding screen with feature highlights
- Email/password authentication via Supabase Auth
- Session persistence with AsyncStorage
- Auto token refresh
- Profile creation on signup

## Non-Functional Requirements

### Performance
- Video feed: 60fps scrolling with snap behavior
- App launch: Under 3 seconds to first content
- Image/video loading: Progressive loading with placeholders
- List rendering: Optimized with FlashList for long lists

### Platform Support
- iOS (iPhone and iPad)
- Android
- Web (via Expo web bundler)
- Portrait orientation only

### Accessibility
- Minimum touch target: 44x44 points
- Color contrast: WCAG AA compliant text on dark backgrounds
- Screen reader support via React Native accessibility props

### Security
- JWT-based authentication via Supabase
- Row Level Security on all database tables
- Environment variables for API keys (not committed to git)
- Encrypted local storage via MMKV

## Future Roadmap

### Phase 2 - Social Features
- [ ] Video comments with threading
- [ ] Direct messaging between users
- [ ] User-generated restaurant lists/collections
- [ ] Share to Instagram/TikTok stories

### Phase 3 - Enhanced Discovery
- [ ] AI-powered personalized recommendations
- [ ] Map-based restaurant discovery
- [ ] AR menu preview
- [ ] Group ordering

### Phase 4 - Restaurant Dashboard
- [ ] Restaurant owner portal
- [ ] Menu management
- [ ] Order management
- [ ] Analytics and insights
- [ ] Promotion tools

### Phase 5 - Monetization
- [ ] Premium creator subscriptions
- [ ] Featured restaurant placements
- [ ] In-app advertising
- [ ] Loyalty/rewards program

## Success Metrics

| Metric | Target |
|--------|--------|
| Daily Active Users | 10K+ in first 6 months |
| Avg. session duration | 8+ minutes |
| Video completion rate | 65%+ |
| Order conversion rate | 3-5% from video views |
| Creator retention (30d) | 40%+ |
| App Store rating | 4.5+ stars |
| Restaurant partner sign-ups | 500+ in first year |
