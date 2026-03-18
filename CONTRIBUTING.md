# Contributing to ReelBite

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Expo CLI (`npx expo`)
- iOS Simulator (Mac) or Android Emulator
- Supabase account (for backend)

### Setup

1. **Clone and install:**
   ```bash
   cd ReelBite
   npm install
   ```

2. **Environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase project URL and anon key.

3. **Start development:**
   ```bash
   npm start        # Expo dev server
   npm run web      # Web preview
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   ```

4. **Type-check:**
   ```bash
   npx tsc --noEmit
   ```

## Project Structure

```
app/          → Screens (Expo Router file-based routing)
components/   → Reusable UI components
stores/       → Zustand state stores
types/        → TypeScript type definitions
lib/          → Utilities, constants, Supabase client, mock data
hooks/        → Custom React hooks
assets/       → Static assets (images, fonts, icons)
```

## Development Guidelines

### Code Style

- **TypeScript strict mode** - All code must pass `tsc --noEmit`
- **Functional components** with explicit TypeScript prop interfaces
- **Named exports** for components, **default exports** for screens
- **Co-located styles** using `StyleSheet.create()` at bottom of file

### Component Conventions

```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/lib/constants";

type MyComponentProps = {
  title: string;
  isActive?: boolean;
};

export default function MyComponent({ title, isActive = false }: MyComponentProps) {
  return (
    <View style={[styles.container, isActive && styles.active]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 14,
    padding: 16,
  },
  active: {
    borderWidth: 1,
    borderColor: COLORS.coral,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
});
```

### Styling Rules

1. Use `StyleSheet.create()` for all styles (NOT inline objects)
2. Import colors from `COLORS` constant - never use raw hex values
3. Follow the existing dark theme - `COLORS.dark` background, `COLORS.darkSurface` for cards
4. Use `COLORS.coral` (#10B981 emerald green) as primary accent
5. Border radius scale: 8 (sm), 12 (md), 14-16 (lg), 20 (pill)

### Adding a New Screen

1. Create file in `app/` following Expo Router conventions
2. Use `SafeAreaView` as root wrapper
3. Add back button with `ArrowLeft` icon from lucide
4. Follow existing header pattern (back button, title, spacer)

### Adding a New Component

1. Place in appropriate `components/` subdirectory
2. Define TypeScript props type
3. Export as default
4. Add styles with `StyleSheet.create()`
5. Use existing shared components where possible

### State Management

- **Client state:** Zustand stores in `stores/`
- **Server state:** React Query hooks (planned)
- **Form state:** React Hook Form + Zod validation
- Keep stores minimal - only shared state, not component-local state

### Icons

Always use `lucide-react-native`:
```tsx
import { Heart, Star, MapPin } from "lucide-react-native";
<Heart size={20} color={COLORS.coral} />
```

### Navigation

```tsx
import { useRouter } from "expo-router";

const router = useRouter();
router.push("/restaurant/bella-napoli");
router.push("/creator/foodie_sarah");
router.back();
```

## Mock Data

During development, all data comes from `lib/mock-data.ts`. When adding new features:

1. Add mock data to `lib/mock-data.ts`
2. Add corresponding types to `types/database.ts` and `types/index.ts`
3. Use mock data directly in components
4. Later, swap mock data for Supabase queries

## Testing

Currently manual testing via Expo dev server. When adding tests:
- Unit tests for utilities in `lib/`
- Component tests with React Native Testing Library
- E2E tests with Detox (planned)

## Commit Messages

Follow conventional commits:
```
feat: add analytics dashboard for creators
fix: correct video snap scrolling on Android
style: update restaurant card border radius
refactor: extract shared GlassCard component
docs: add architecture documentation
```

## Questions?

Open an issue or reach out to the team.
