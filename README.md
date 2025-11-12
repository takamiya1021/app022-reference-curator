# リファレンスキュレーター / Reference Curator

> A Progressive Web App for collecting, organizing, and presenting visual references

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-success)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 概要 / Overview

デザイナー・クリエイター向けのビジュアルリファレンス管理PWAアプリです。画像を収集し、AIで自動タグ付けし、スライドショーでプレゼンできます。完全にブラウザ内で動作し、プライバシーを重視した設計です。

A visual reference management PWA for designers and creators. Collect images, auto-tag them with AI, and present them in slideshows. Works entirely in the browser with privacy-first design.

## ✨ 主な機能 / Key Features

- 📥 **画像管理**: JPG/PNG/GIF/WebP対応、完全ローカル保存（IndexedDB）
- 🏷️ **AIタグ自動生成**: Gemini APIで画像内容を分析してタグを提案
- 🎬 **スライドショー**: フルスクリーン表示、自動再生・手動操作対応
- 📝 **メモ機能**: 各画像に参考ポイント・アイデアを記録
- 📱 **PWA対応**: ホーム画面追加、オフライン動作、高速起動
- 🔐 **プライバシー重視**: 画像ファイルは外部送信なし、完全ブラウザ内動作

## 🚀 クイックスタート / Quick Start

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/app022-reference-curator.git
cd app022-reference-curator/app022

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

詳細なドキュメントは [app022/README.md](./app022/README.md) をご覧ください。

## 🛠️ 技術スタック / Tech Stack

- **Next.js 16** (App Router, Static Export)
- **React 19** (Client Components)
- **TypeScript 5**
- **Tailwind CSS 4**
- **Zustand** - グローバル状態管理
- **Dexie** - IndexedDB wrapper
- **Google Gemini API** - 画像分析・タグ生成

## 📂 プロジェクト構造 / Project Structure

```
app022-reference-curator/
├── app022/              # メインアプリケーション
│   ├── app/            # Next.js App Router
│   ├── lib/            # ユーティリティ・ロジック
│   ├── store/          # Zustand状態管理
│   ├── types/          # 型定義
│   ├── public/         # 静的ファイル・PWAマニフェスト
│   └── README.md       # 詳細ドキュメント
└── README.md           # このファイル
```

## 📖 ドキュメント / Documentation

詳細な使い方、開発手順、API設定などは以下をご覧ください：

- **[詳細README](./app022/README.md)** - フル機能説明、セットアップ、使い方
- **[開発ガイド](./app022/README.md#-開発--development)** - テスト、ビルド、デプロイ

## 🔐 プライバシー / Privacy

- 画像データはブラウザ内（IndexedDB）のみに保存
- 画像ファイルは外部サーバーに送信されません
- Gemini APIキーはlocalStorageに保存（任意機能）
- オフラインでも閲覧・編集可能

## 📄 ライセンス / License

MIT License

## 🤝 コントリビューション / Contributing

Pull Requestを歓迎します！詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

---

Made with ❤️ for designers and creators
