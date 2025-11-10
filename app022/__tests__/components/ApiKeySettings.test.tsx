import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import ApiKeySettings from "../../app/components/ApiKeySettings";
import { setGeminiApiKey, verifyGeminiKey } from "../../lib/geminiService";

jest.mock("@/lib/geminiService", () => {
  const actual = jest.requireActual("@/lib/geminiService");
  return {
    ...actual,
    verifyGeminiKey: jest.fn().mockResolvedValue(undefined),
  };
});

describe("ApiKeySettings", () => {
  beforeEach(() => {
    setGeminiApiKey("");
  });

  it("shows masked key when value exists", () => {
    setGeminiApiKey("sk-demo-key");
    render(<ApiKeySettings />);
    expect(screen.getByDisplayValue(/\*{4}/)).toBeInTheDocument();
  });

  it("validates empty submission", async () => {
    const user = userEvent.setup();
    render(<ApiKeySettings />);
    await user.click(screen.getByRole("button", { name: /保存/i }));
    expect(await screen.findByText(/キーを入力してください/i)).toBeInTheDocument();
  });

  it("saves new key and shows confirmation", async () => {
    const user = userEvent.setup();
    render(<ApiKeySettings />);
    await user.type(screen.getByLabelText(/gemini api key/i), "sk-12345");
    await user.click(screen.getByRole("button", { name: /保存/i }));

    await waitFor(() => {
      expect(screen.getByText(/保存しました/i)).toBeInTheDocument();
    });
  });

  it("clears stored key", async () => {
    setGeminiApiKey("sk-demo");
    const user = userEvent.setup();
    render(<ApiKeySettings />);

    await user.click(screen.getByRole("button", { name: /削除/i }));
    await waitFor(() => {
      expect(screen.getByText(/削除しました/i)).toBeInTheDocument();
    });
  });

  it("shows connection error when Gemini verification fails", async () => {
    (verifyGeminiKey as jest.Mock).mockRejectedValueOnce(new Error("Mock Gemini error"));
    const user = userEvent.setup();
    render(<ApiKeySettings />);
    await user.type(screen.getByLabelText(/gemini api key/i), "sk-error");
    await user.click(screen.getByRole("button", { name: /保存/i }));

    await expect(screen.findByText(/Mock Gemini error/i)).resolves.toBeVisible();
  });
});
