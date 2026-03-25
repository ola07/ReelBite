import { supabase } from './supabase';

const AI_TIMEOUT_MS = 30_000;

// ── Helpers ────────────────────────────────────────────────────────────────────

function sanitize(input: string, maxLength = 500): string {
  return input.replace(/[<>"'`\\]/g, '').slice(0, maxLength).trim();
}

async function callEdgeFunction<T>(
  name: string,
  body: Record<string, unknown>,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const { data, error } = await supabase.functions.invoke<T>(name, { body });
    if (error) throw new Error(error.message);
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Food recommendation AI ─────────────────────────────────────────────────────

export async function getRestaurantRecommendations(
  mood: string,
  cuisine?: string,
  budget?: string,
): Promise<string> {
  const result = await callEdgeFunction<{ text: string }>('ai-recommend', {
    mood: sanitize(mood, 100),
    cuisine: cuisine ? sanitize(cuisine, 50) : undefined,
    budget: budget ? sanitize(budget, 20) : undefined,
  });
  return result.text ?? '';
}

// ── Dish description generator ─────────────────────────────────────────────────

export async function generateDishDescription(
  dishName: string,
  ingredients: string[],
): Promise<string> {
  const result = await callEdgeFunction<{ text: string }>('ai-dish-description', {
    dishName: sanitize(dishName, 100),
    ingredients: ingredients.map((i) => sanitize(i, 50)).slice(0, 20),
  });
  return result.text ?? '';
}

// ── Review sentiment analysis ──────────────────────────────────────────────────

export async function analyzeReviewSentiment(
  reviewText: string,
): Promise<{ sentiment: 'positive' | 'neutral' | 'negative'; score: number }> {
  const result = await callEdgeFunction<{
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  }>('ai-sentiment', {
    text: sanitize(reviewText, 2000),
  });
  return {
    sentiment: result.sentiment ?? 'neutral',
    score: typeof result.score === 'number' ? Math.min(1, Math.max(0, result.score)) : 0.5,
  };
}

// ── Food vibe matcher ──────────────────────────────────────────────────────────

export async function matchFoodVibes(description: string): Promise<string[]> {
  const result = await callEdgeFunction<{ vibes: string[] }>('ai-vibes', {
    description: sanitize(description, 500),
  });
  return Array.isArray(result.vibes) ? result.vibes : [];
}
