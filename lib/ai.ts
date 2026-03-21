import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;

// ── Clients ───────────────────────────────────────────────────────────────────

const openai = new OpenAI({ apiKey: extra?.openaiApiKey ?? '' });
const gemini = new GoogleGenerativeAI(extra?.geminiApiKey ?? '');

// ── Food recommendation AI ────────────────────────────────────────────────────

export async function getRestaurantRecommendations(
  mood: string,
  cuisine?: string,
  budget?: string,
): Promise<string> {
  const prompt = `You are a food discovery assistant for ReelBite, a TikTok-style food app.
Suggest 3 restaurant types that match:
- Mood: ${mood}
${cuisine ? `- Cuisine preference: ${cuisine}` : ''}
${budget ? `- Budget: ${budget}` : ''}

Reply with a short, engaging description of each suggestion. Keep it conversational and fun.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
  });

  return response.choices[0].message.content ?? '';
}

// ── Dish description generator ────────────────────────────────────────────────

export async function generateDishDescription(
  dishName: string,
  ingredients: string[],
): Promise<string> {
  const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Write a mouth-watering, 2-sentence description for a dish called "${dishName}"
with these ingredients: ${ingredients.join(', ')}.
Make it sound irresistible for a food discovery app. No emojis.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ── Review sentiment analysis ─────────────────────────────────────────────────

export async function analyzeReviewSentiment(
  reviewText: string,
): Promise<{ sentiment: 'positive' | 'neutral' | 'negative'; score: number }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Analyze the sentiment of food reviews. Respond only with JSON: {"sentiment": "positive"|"neutral"|"negative", "score": 0.0-1.0}',
      },
      { role: 'user', content: reviewText },
    ],
    max_tokens: 50,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0].message.content ?? '{}';
  return JSON.parse(raw) as { sentiment: 'positive' | 'neutral' | 'negative'; score: number };
}

// ── Food vibe matcher (Gemini) ─────────────────────────────────────────────────

export async function matchFoodVibes(description: string): Promise<string[]> {
  const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Given this restaurant/food description: "${description}"
Return a JSON array of 3-5 vibe tags from this list:
["Romantic", "Casual", "Trendy", "Cozy", "Healthy", "Indulgent", "Late Night", "Brunch", "Date Night", "Family", "Solo", "Work Lunch"]
Respond ONLY with the JSON array.`;

  const result = await model.generateContent(prompt);
  try {
    return JSON.parse(result.response.text()) as string[];
  } catch {
    return [];
  }
}
