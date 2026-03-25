import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_VIBES = [
  "Romantic", "Casual", "Trendy", "Cozy", "Healthy", "Indulgent",
  "Late Night", "Brunch", "Date Night", "Family", "Solo", "Work Lunch",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { description } = await req.json();

    if (!description || typeof description !== "string") {
      return Response.json({ error: "description is required" }, { status: 400, headers: CORS });
    }

    const prompt = `Given this restaurant/food description: "${description.slice(0, 500)}"
Return a JSON array of 3-5 vibe tags from this list:
${JSON.stringify(ALLOWED_VIBES)}
Respond ONLY with the JSON array.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 100,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) throw new Error(`Anthropic error: ${response.status}`);
    const data = await response.json();
    const raw = data.content?.[0]?.text ?? "[]";

    let vibes: string[];
    try {
      const parsed = JSON.parse(raw);
      vibes = Array.isArray(parsed)
        ? parsed.filter((v): v is string => ALLOWED_VIBES.includes(v))
        : [];
    } catch {
      vibes = [];
    }

    return Response.json({ vibes }, { headers: CORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500, headers: CORS });
  }
});
