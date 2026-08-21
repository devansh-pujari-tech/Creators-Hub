const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const draftSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    content: { type: "STRING" },
    keywords: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["title", "content", "keywords"],
};

const generatePostDraft = async ({ topic, audience, tone }) => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.status = 503;
    throw error;
  }

  const prompt = [
    "Create a concise social media post draft.",
    `Topic: ${topic}`,
    `Audience: ${audience || "general creators"}`,
    `Tone: ${tone || "clear and practical"}`,
    "Return only valid JSON matching the requested schema.",
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: draftSchema,
          temperature: 0.7,
        },
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    const error = new Error(`Gemini request failed: ${details}`);
    error.status = response.status === 429 ? 429 : 502;
    throw error;
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const error = new Error("Gemini returned an empty response");
    error.status = 502;
    throw error;
  }

  const draft = JSON.parse(text);
  if (!draft.title || !draft.content || !Array.isArray(draft.keywords)) {
    const error = new Error("Gemini returned an invalid draft shape");
    error.status = 502;
    throw error;
  }

  return { ...draft, model: GEMINI_MODEL };
};

module.exports = { generatePostDraft };
