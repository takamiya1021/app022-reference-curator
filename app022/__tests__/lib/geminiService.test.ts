import { createGeminiClient, setGeminiApiKey } from "../../lib/geminiService";
import type { ImageData } from "../../types";

const mockImage = (overrides: Partial<ImageData> = {}): ImageData => ({
  id: "img-1",
  file: new Blob(),
  thumbnail: "data:image/png;base64,AAA",
  fileName: "sample.png",
  mimeType: "image/png",
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("GeminiService", () => {
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    global.fetch = fetchMock;
    fetchMock.mockReset();
    setGeminiApiKey("test-key");
    global.localStorage = {
      getItem: jest.fn(() => "test-key"),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 1,
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.localStorage = originalLocalStorage;
  });

  it("sends image analysis request and parses AI response", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    tags: ["art deco", "sunset"],
                    description: "Warm sunset over geometric skyline.",
                  }),
                },
              ],
            },
          },
        ],
      }),
    });

    const client = createGeminiClient();
    const result = await client.analyzeImage(mockImage().thumbnail);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("generateContent"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer test-key",
        }),
      }),
    );
    expect(result).toEqual({
      tags: ["art deco", "sunset"],
      description: "Warm sunset over geometric skyline.",
    });
  });

  it("throws descriptive error when API responds with failure", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: { message: "Invalid key" } }),
    });

    const client = createGeminiClient();
    await expect(client.analyzeImage(mockImage().thumbnail)).rejects.toThrow(
      /Gemini API request failed: 403/i,
    );
  });

  it("posts summarized concept request and returns generated idea", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: "Futuristic coastal skyline with neon reflections." }],
            },
          },
        ],
      }),
    });

    const client = createGeminiClient();
    const concept = await client.generateConcept([mockImage({ id: "img-2" })]);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("generateContent"),
      expect.objectContaining({
        body: expect.stringContaining("sample.png"),
      }),
    );
    expect(concept).toEqual("Futuristic coastal skyline with neon reflections.");
  });

  it("fails fast when API key is missing", async () => {
    global.localStorage.getItem = jest.fn(() => null);
    setGeminiApiKey("");
    const client = createGeminiClient();
    await expect(client.generateConcept([mockImage()])).rejects.toThrow(/API key/i);
  });
});
