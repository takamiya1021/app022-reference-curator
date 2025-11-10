import type { ImageData } from "@/types";

const GEMINI_MODEL = "gemini-2.0-flash-exp";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const STORAGE_KEY = "gemini_api_key";

type GeminiAnalysis = {
  tags: string[];
  description: string;
};

type GeminiCandidate = {
  content?: {
    parts?: Array<{
      text?: string;
    }>;
  };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
};

let cachedApiKey: string | null = null;

const readStoredKey = (): string | null => {
  if (cachedApiKey) {
    return cachedApiKey;
  }

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      cachedApiKey = window.localStorage.getItem(STORAGE_KEY);
      return cachedApiKey;
    }

    if (typeof globalThis.localStorage !== "undefined") {
      cachedApiKey = globalThis.localStorage.getItem(STORAGE_KEY);
      return cachedApiKey;
    }
  } catch (error) {
    // ignore storage access errors
  }

  return null;
};

const ensureApiKey = (): string => {
  const key = readStoredKey();
  if (!key) {
    throw new Error("Gemini API key is not configured. Please set the key in settings.");
  }
  return key;
};

export const getGeminiApiKey = (): string | null => readStoredKey();

const writeApiKey = (key: string | null) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      if (key) {
        window.localStorage.setItem(STORAGE_KEY, key);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      return;
    }
    if (typeof globalThis.localStorage !== "undefined") {
      if (key) {
        globalThis.localStorage.setItem(STORAGE_KEY, key);
      } else {
        globalThis.localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch (error) {
    // ignore storage errors (e.g., in tests)
  }
};

export const setGeminiApiKey = (key: string): void => {
  const normalized = key.trim();
  cachedApiKey = normalized.length > 0 ? normalized : null;
  writeApiKey(cachedApiKey);
};

export const clearGeminiApiKey = (): void => {
  cachedApiKey = null;
  writeApiKey(null);
};

const extractText = (payload: GeminiResponse): string => {
  const candidate = payload?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text ?? "";
  return text.trim();
};

const parseInlineData = (dataUrl: string): { mimeType: string; data: string } => {
  const match = dataUrl.match(/^data:(?<mime>.+?);base64,(?<data>.+)$/);
  if (!match || !match.groups) {
    throw new Error("Invalid data URL provided for Gemini image analysis.");
  }
  return {
    mimeType: match.groups.mime,
    data: match.groups.data,
  };
};

const requestGemini = async <T>(body: Record<string, unknown>, apiKeyOverride?: string): Promise<T> => {
  const apiKey = apiKeyOverride ?? ensureApiKey();

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let details = "";
    try {
      const errorPayload = await response.json();
      details = errorPayload?.error?.message ? ` ${errorPayload.error.message}` : "";
    } catch (error) {
      // ignore json parse errors
    }
    throw new Error(`Gemini API request failed: ${response.status}${details}`);
  }

  return response.json();
};

export const createGeminiClient = () => {
  const analyzeImage = async (imageDataUrl: string): Promise<GeminiAnalysis> => {
    const { mimeType, data } = parseInlineData(imageDataUrl);

    const payload: Record<string, unknown> = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Analyze the image and respond with JSON containing keys `tags` (array of descriptive, lower-case tags) and `description` (concise sentence).",
            },
            {
              inlineData: {
                mimeType,
                data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
      },
    };

    const response = await requestGemini<GeminiResponse>(payload);
    const text = extractText(response);

    try {
      const parsed = JSON.parse(text) as GeminiAnalysis;
      return {
        tags: parsed.tags ?? [],
        description: parsed.description ?? "",
      };
    } catch (error) {
      return {
        tags: [],
        description: text,
      };
    }
  };

  const generateConcept = async (images: ImageData[]): Promise<string> => {
    const summary = images
      .map((image, index) => {
        const tagSummary = image.tags.length > 0 ? `tags: ${image.tags.join(", ")}` : "no tags";
        return `${index + 1}. ${image.fileName} (${tagSummary})`;
      })
      .join("\n");

    const payload: Record<string, unknown> = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Given the following images, craft a short creative concept (<=80 words) capturing the collective mood.\nImages:\n${summary}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        topP: 0.95,
      },
    };

    const response = await requestGemini<GeminiResponse>(payload);
    return extractText(response);
  };

  return {
    analyzeImage,
    generateConcept,
  };
};

export type GeminiClient = ReturnType<typeof createGeminiClient>;

export const verifyGeminiKey = async (key: string): Promise<void> => {
  if (!key) {
    throw new Error("Gemini API key is not configured. Please set the key in settings.");
  }

  await requestGemini<GeminiResponse>(
    {
      contents: [
        {
          role: "user",
          parts: [{ text: "Say OK" }],
        },
      ],
      generationConfig: { temperature: 0 },
    },
    key,
  );
};
