import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated as RNAnimated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Sparkles,
  Send,
  MapPin,
  Star,
  DollarSign,
  Clock,
  ChevronRight,
  Utensils,
  Zap,
  Heart,
  Coffee,
  Wine,
  Flame,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { MOCK_RESTAURANTS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────

type MessageRole = "user" | "ai";

type RestaurantSuggestion = {
  id: string;
  name: string;
  slug: string;
  cuisine: string[];
  rating: number;
  priceLevel: number;
  reason: string;
  matchScore: number;
};

type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  suggestions?: RestaurantSuggestion[];
  timestamp: Date;
};

// ─── AI Logic (Mock — simulates intelligent matching) ────────────────────

const KEYWORD_MAP: Record<string, string[]> = {
  spicy: ["r3", "r5", "r6"],
  italian: ["r1"],
  pizza: ["r1"],
  japanese: ["r2"],
  sushi: ["r2"],
  mexican: ["r3"],
  tacos: ["r3"],
  steak: ["r4"],
  thai: ["r5"],
  indian: ["r6"],
  curry: ["r6"],
  "date night": ["r1", "r2", "r4"],
  romantic: ["r1", "r2", "r4"],
  casual: ["r3", "r5"],
  family: ["r1", "r3", "r6"],
  cheap: ["r3", "r5"],
  fancy: ["r2", "r4"],
  healthy: ["r5"],
  vegan: ["r5", "r6"],
  vegetarian: ["r1", "r6"],
  groups: ["r1", "r3", "r6"],
  late: ["r3"],
  brunch: ["r1"],
  cozy: ["r1", "r6"],
  trendy: ["r2", "r4"],
  outdoor: ["r5"],
  comfort: ["r3", "r6"],
  adventurous: ["r2", "r5"],
  celebration: ["r2", "r4"],
  quick: ["r3", "r5"],
};

const AI_RESPONSES: Record<string, string> = {
  spicy: "I found some places that'll bring the heat! Here are my top picks for spicy food:",
  italian: "Nothing beats a great Italian meal. Here are the best Italian spots I'd recommend:",
  japanese: "For an authentic Japanese experience, you'll love these:",
  mexican: "Craving Mexican? I've got the perfect spots with incredible flavors:",
  steak: "Ready for a premium steak experience? These places won't disappoint:",
  thai: "Thai food is all about that perfect balance of flavors. Check these out:",
  indian: "For rich, aromatic Indian cuisine, these restaurants are incredible:",
  "date night": "Planning a special evening? These restaurants set the perfect mood:",
  romantic: "Here are the most romantic spots in the city — perfect for a memorable night:",
  casual: "Looking for something laid-back? These places have amazing food without the fuss:",
  fancy: "For an upscale dining experience, these are the cream of the crop:",
  healthy: "Want something nutritious and delicious? These spots have you covered:",
  vegan: "Great vegan options here! These restaurants take plant-based food seriously:",
  groups: "Perfect for gathering with friends! These places handle groups beautifully:",
  comfort: "Sometimes you just need comfort food. These spots will warm your soul:",
  celebration: "Time to celebrate! These restaurants make every occasion feel special:",
  default: "Based on what you're looking for, I think you'll love these restaurants:",
};

function getAIResponse(query: string): { text: string; suggestions: RestaurantSuggestion[] } {
  const lower = query.toLowerCase();
  const matchedIds = new Set<string>();
  let bestResponseKey = "default";

  // Match keywords
  for (const [keyword, ids] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      ids.forEach((id) => matchedIds.add(id));
      if (bestResponseKey === "default") bestResponseKey = keyword;
    }
  }

  // If no matches, return top-rated restaurants
  if (matchedIds.size === 0) {
    MOCK_RESTAURANTS.sort((a, b) => b.average_rating - a.average_rating)
      .slice(0, 3)
      .forEach((r) => matchedIds.add(r.id));
  }

  const suggestions: RestaurantSuggestion[] = Array.from(matchedIds)
    .slice(0, 4)
    .map((id) => {
      const restaurant = MOCK_RESTAURANTS.find((r) => r.id === id);
      if (!restaurant) return null;

      const reasons: Record<string, string> = {
        r1: "Beloved for authentic Neapolitan pizza with a cozy, family-friendly atmosphere",
        r2: "Premium omakase experience with the freshest fish flown in daily",
        r3: "Legendary birria tacos and bold Mexican flavors that keep locals coming back",
        r4: "Dry-aged steaks in a sophisticated, modern setting perfect for special occasions",
        r5: "Vibrant Thai street food with incredible spice levels and fresh ingredients",
        r6: "Rich, aromatic Indian curries with generous portions and warm hospitality",
      };

      return {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        cuisine: restaurant.cuisine_type,
        rating: restaurant.average_rating,
        priceLevel: restaurant.price_level,
        reason: reasons[id] || "Highly rated by our community",
        matchScore: Math.round(75 + Math.random() * 23),
      };
    })
    .filter(Boolean) as RestaurantSuggestion[];

  // Sort by match score
  suggestions.sort((a, b) => b.matchScore - a.matchScore);

  const responseText = AI_RESPONSES[bestResponseKey] || AI_RESPONSES.default;
  return { text: responseText, suggestions };
}

// ─── Quick Suggestion Chips ─────────────────────────────────────────────

const QUICK_SUGGESTIONS = [
  { label: "Date night spots", icon: Heart, query: "date night romantic restaurant" },
  { label: "Spicy food", icon: Flame, query: "spicy food near me" },
  { label: "Quick lunch", icon: Coffee, query: "quick casual lunch" },
  { label: "Fancy dinner", icon: Wine, query: "fancy upscale dinner celebration" },
];

// ─── Components ─────────────────────────────────────────────────────────

function TypingIndicator() {
  const dots = [useRef(new RNAnimated.Value(0)).current, useRef(new RNAnimated.Value(0)).current, useRef(new RNAnimated.Value(0)).current];

  React.useEffect(() => {
    dots.forEach((dot, i) => {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.delay(i * 200),
          RNAnimated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          RNAnimated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.typingRow}>
      <View style={styles.aiBubbleIcon}>
        <Sparkles size={14} color={COLORS.coral} />
      </View>
      <View style={styles.typingBubble}>
        {dots.map((dot, i) => (
          <RNAnimated.View
            key={i}
            style={[styles.typingDot, { opacity: dot, transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }]}
          />
        ))}
      </View>
    </View>
  );
}

function RestaurantCard({ suggestion, onPress }: { suggestion: RestaurantSuggestion; onPress: () => void }) {
  return (
    <Pressable style={styles.suggestionCard} onPress={onPress}>
      <View style={styles.suggestionHeader}>
        <View style={styles.matchBadge}>
          <Zap size={10} color={COLORS.coral} />
          <Text style={styles.matchText}>{suggestion.matchScore}% Match</Text>
        </View>
      </View>
      <Text style={styles.suggestionName}>{suggestion.name}</Text>
      <View style={styles.suggestionMeta}>
        <View style={styles.suggestionMetaItem}>
          <Star size={12} color={COLORS.amber} fill={COLORS.amber} />
          <Text style={styles.suggestionMetaText}>{suggestion.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.suggestionMetaItem}>
          <DollarSign size={12} color={COLORS.textTertiary} />
          <Text style={styles.suggestionMetaText}>{"$".repeat(suggestion.priceLevel)}</Text>
        </View>
        <View style={styles.suggestionMetaItem}>
          <Utensils size={12} color={COLORS.textTertiary} />
          <Text style={styles.suggestionMetaText}>{suggestion.cuisine.join(", ")}</Text>
        </View>
      </View>
      <Text style={styles.suggestionReason} numberOfLines={2}>{suggestion.reason}</Text>
      <View style={styles.suggestionAction}>
        <Text style={styles.suggestionActionText}>View Restaurant</Text>
        <ChevronRight size={14} color={COLORS.coral} />
      </View>
    </Pressable>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────

export default function AIConciergeScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const { text: aiText, suggestions } = getAIResponse(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: aiText,
        suggestions,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200 + Math.random() * 800);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleSuggestionPress = (slug: string) => {
    router.push(`/restaurant/${slug}`);
  };

  const isEmpty = messages.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Sparkles size={20} color={COLORS.coral} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Food Concierge</Text>
            <Text style={styles.headerSubtitle}>Tell me what you're craving</Text>
          </View>
        </View>

        {/* Chat Area */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isEmpty && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Sparkles size={40} color={COLORS.coral} />
              </View>
              <Text style={styles.emptyTitle}>What are you in the mood for?</Text>
              <Text style={styles.emptySubtitle}>
                Describe a vibe, craving, or occasion and I'll find the perfect restaurant for you.
              </Text>

              {/* Quick Suggestions */}
              <View style={styles.quickSuggestions}>
                {QUICK_SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Pressable
                      key={s.label}
                      style={styles.quickChip}
                      onPress={() => sendMessage(s.query)}
                    >
                      <Icon size={14} color={COLORS.coral} />
                      <Text style={styles.quickChipText}>{s.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Example Prompts */}
              <View style={styles.examplesSection}>
                <Text style={styles.examplesTitle}>Try asking...</Text>
                <Pressable style={styles.exampleCard} onPress={() => sendMessage("I want something spicy but not Thai, good for a group dinner under $30")}>
                  <Text style={styles.exampleText}>"Something spicy, good for groups, under $30"</Text>
                </Pressable>
                <Pressable style={styles.exampleCard} onPress={() => sendMessage("romantic date night restaurant with amazing ambiance")}>
                  <Text style={styles.exampleText}>"Romantic date night with amazing ambiance"</Text>
                </Pressable>
                <Pressable style={styles.exampleCard} onPress={() => sendMessage("best sushi for a celebration dinner")}>
                  <Text style={styles.exampleText}>"Best sushi for a celebration dinner"</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <View key={msg.id}>
              {msg.role === "user" ? (
                <View style={styles.userBubbleRow}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userBubbleText}>{msg.text}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.aiBubbleRow}>
                  <View style={styles.aiBubbleIcon}>
                    <Sparkles size={14} color={COLORS.coral} />
                  </View>
                  <View style={styles.aiContent}>
                    <View style={styles.aiBubble}>
                      <Text style={styles.aiBubbleText}>{msg.text}</Text>
                    </View>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <View style={styles.suggestionsContainer}>
                        {msg.suggestions.map((s) => (
                          <RestaurantCard
                            key={s.id}
                            suggestion={s}
                            onPress={() => handleSuggestionPress(s.slug)}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))}

          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Describe what you're craving..."
            placeholderTextColor={COLORS.textTertiary}
            multiline
            maxLength={300}
            onSubmitEditing={() => sendMessage(input)}
            blurOnSubmit
          />
          <Pressable
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
          >
            <Send size={18} color={input.trim() ? COLORS.white : COLORS.textTertiary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  keyboardView: { flex: 1 },

  // Header
  header: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)",
  },
  headerIcon: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.white },
  headerSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },

  // Chat
  chatArea: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 20 },

  // Empty state
  emptyState: { alignItems: "center", paddingTop: 40 },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 22, fontWeight: "700", color: COLORS.white, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center", lineHeight: 20, paddingHorizontal: 20 },

  // Quick suggestions
  quickSuggestions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 24, justifyContent: "center" },
  quickChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: COLORS.darkSurface, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1, borderColor: "rgba(16,185,129,0.15)",
  },
  quickChipText: { fontSize: 13, fontWeight: "600", color: COLORS.white },

  // Examples
  examplesSection: { width: "100%", marginTop: 32 },
  examplesTitle: { fontSize: 13, fontWeight: "700", color: COLORS.textTertiary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  exampleCard: {
    backgroundColor: COLORS.darkSurface, borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.04)",
  },
  exampleText: { fontSize: 14, color: COLORS.textSecondary, fontStyle: "italic" },

  // User bubble
  userBubbleRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 16 },
  userBubble: {
    backgroundColor: COLORS.coral, borderRadius: 18,
    borderBottomRightRadius: 4, paddingHorizontal: 16, paddingVertical: 10, maxWidth: "80%",
  },
  userBubbleText: { fontSize: 14, color: COLORS.white, lineHeight: 20 },

  // AI bubble
  aiBubbleRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 16 },
  aiBubbleIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center",
    marginTop: 2,
  },
  aiContent: { flex: 1 },
  aiBubble: {
    backgroundColor: COLORS.darkSurface, borderRadius: 18,
    borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 10, maxWidth: "95%",
  },
  aiBubbleText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },

  // Typing indicator
  typingRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 16 },
  typingBubble: {
    flexDirection: "row", gap: 5,
    backgroundColor: COLORS.darkSurface, borderRadius: 18,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.coral },

  // Suggestions
  suggestionsContainer: { marginTop: 8, gap: 8 },
  suggestionCard: {
    backgroundColor: COLORS.darkSurface, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "rgba(16,185,129,0.1)",
  },
  suggestionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  matchBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(16,185,129,0.12)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  matchText: { fontSize: 11, fontWeight: "700", color: COLORS.coral },
  suggestionName: { fontSize: 16, fontWeight: "700", color: COLORS.white, marginBottom: 6 },
  suggestionMeta: { flexDirection: "row", gap: 12, marginBottom: 6 },
  suggestionMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  suggestionMetaText: { fontSize: 12, color: COLORS.textSecondary },
  suggestionReason: { fontSize: 12, color: COLORS.textTertiary, lineHeight: 17, marginBottom: 8 },
  suggestionAction: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(255,255,255,0.06)",
    paddingTop: 10,
  },
  suggestionActionText: { fontSize: 13, fontWeight: "600", color: COLORS.coral },

  // Input
  inputBar: {
    flexDirection: "row", alignItems: "flex-end", gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)",
    backgroundColor: COLORS.dark, paddingBottom: Platform.OS === "ios" ? 10 : 10,
  },
  textInput: {
    flex: 1, backgroundColor: COLORS.darkSurface, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: COLORS.white, maxHeight: 100,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.coral, alignItems: "center", justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: COLORS.darkElevated },
});
