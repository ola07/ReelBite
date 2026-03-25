import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { mood, cuisine, budget } = await req.json();

    if (!mood || typeof mood !== "string") {
      return Response.json({ error: "mood is required" }, { status: 400, headers: CORS });
    }

    const safeMood = mood.slice(0, 100);
    const safeCuisine = cuisine ? String(cuisine).slice(0, 50) : null;
    const safeBudget = budget ? String(budget).slice(0, 20) : null;

    const prompt = `You are a food discovery assistant for ReelBite, a TikTok-style food app.
Suggest 3 restaurant types that match:
- Mood: ${safeMood}
${safeCuisine ? `- Cuisine preference: ${safeCuisine}` : ""}
${safeBudget ? `- Budget: ${safeBudget}` : ""}

Reply with a short, engaging description of each suggestion. Keep it conversational and fun.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) throw new Error(`Anthropic error: ${response.status}`);
    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";

    return Response.json({ text }, { headers: CORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500, headers: CORS });
  }
});
