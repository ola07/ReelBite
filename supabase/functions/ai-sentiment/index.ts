import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "text is required" }, { status: 400, headers: CORS });
    }

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
        system: 'Analyze the sentiment of food reviews. Respond only with JSON: {"sentiment": "positive"|"neutral"|"negative", "score": 0.0-1.0}',
        messages: [{ role: "user", content: text.slice(0, 2000) }],
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) throw new Error(`Anthropic error: ${response.status}`);
    const data = await response.json();
    const raw = data.content?.[0]?.text ?? "{}";

    let parsed: { sentiment?: string; score?: number };
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    const validSentiments = ["positive", "neutral", "negative"];
    const sentiment = validSentiments.includes(parsed.sentiment ?? "")
      ? (parsed.sentiment as "positive" | "neutral" | "negative")
      : "neutral";
    const score =
      typeof parsed.score === "number" ? Math.min(1, Math.max(0, parsed.score)) : 0.5;

    return Response.json({ sentiment, score }, { headers: CORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500, headers: CORS });
  }
});
