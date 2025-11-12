"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  clearGeminiApiKey,
  getGeminiApiKey,
  setGeminiApiKey,
  verifyGeminiKey,
} from "@/lib/geminiService";

const maskKey = (key: string): string => {
  if (key.length <= 4) {
    return key.replace(/./g, "*");
  }
  return key.replace(/.(?=.{4})/g, "*");
};

export default function ApiKeySettings() {
  const [currentKey, setCurrentKey] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = getGeminiApiKey();
    if (stored) {
      setCurrentKey(stored);
      setInputValue(stored);
    } else {
      setCurrentKey("");
      setInputValue("");
    }
  }, []);

  const displayValue = useMemo(() => {
    if (isDirty) {
      return inputValue;
    }
    if (currentKey) {
      return maskKey(currentKey);
    }
    return "";
  }, [isDirty, inputValue, currentKey]);

  const resetMessages = () => {
    setError("");
    setMessage("");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    resetMessages();
    setIsDirty(true);
    setInputValue(event.target.value);
  };

  const handleSave = async () => {
    resetMessages();
    const valueToSave = (isDirty ? inputValue : currentKey).trim();
    if (!valueToSave) {
      setError("キーを入力してください");
      return;
    }

    try {
      setIsSaving(true);
      await verifyGeminiKey(valueToSave);
      setGeminiApiKey(valueToSave);
      setCurrentKey(valueToSave);
      setInputValue(valueToSave);
      setIsDirty(false);
      setMessage("保存しました");
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Gemini API 検証に失敗しました";
      setError(reason);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    resetMessages();
    clearGeminiApiKey();
    setCurrentKey("");
    setInputValue("");
    setIsDirty(false);
    setMessage("削除しました");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Gemini API 設定</h2>
        <p className="text-sm text-zinc-500">
          Google Gemini API キーを保存すると、画像の自動タグ生成やコンセプト提案が利用できます。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="gemini-api-key" className="text-sm font-medium text-zinc-700">
            Gemini API Key
          </label>
          <input
            id="gemini-api-key"
            type="password"
            value={displayValue}
            onChange={handleChange}
            placeholder="sk-..."
            autoComplete="off"
            className="w-full rounded-xl border border-zinc-300 px-4 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-95 active:bg-zinc-950 disabled:opacity-50"
          >
            {isSaving ? "検証中..." : "保存"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900"
          >
            削除
          </button>
        </div>
      </form>
    </section>
  );
}
