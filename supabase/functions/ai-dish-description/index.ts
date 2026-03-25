import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { dishName, ingredients } = await req.json();

    if (!dishName || typeof dishName !== "string") {
      return Response.json({ error: "dishName is required" }, { status: 400, headers: CORS });
    }

    const safeName = dishName.slice(0, 100);
    const safeIngredients = Array.isArray(ingredients)
      ? ingredients.map((i: unknown) => String(i).slice(0, 50)).slice(0, 20)
      : [];

    const prompt = `Write a mouth-watering, 2-sentence description for a dish called "${safeName}"
with these ingredients: ${safeIngredients.join(", ")}.
Make it sound irresistible for a food discovery app. No emojis.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
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
