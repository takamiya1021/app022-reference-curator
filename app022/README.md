# 📁 リファレンスキュレーター / Reference Curator

> ビジュアルリファレンスを収集・整理・プレゼンするPWAアプリ
> A PWA for collecting, organizing, and presenting visual references

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-success)](https://web.dev/progressive-web-apps/)

## 🎯 概要 / Overview

デザイナー・クリエイター向けのビジュアルリファレンス管理アプリです。画像を収集し、AIで自動タグ付けし、スライドショーでプレゼンできます。完全にブラウザ内で動作し、プライバシーを重視した設計です。

A visual reference management app for designers and creators. Collect images, auto-tag them with AI, and present them in slideshows. Works entirely in the browser with privacy-first design.

## ✨ 主な機能 / Key Features

### 📥 画像管理
- **簡単アップロード**: JPG/PNG/GIF/WebP対応（各10MBまで）
- **完全ローカル保存**: IndexedDB使用、サーバー送信なし
- **サムネイル自動生成**: 高速表示のため圧縮処理

### 🏷️ タグ管理
- **AIタグ自動生成**: Gemini APIで画像内容を分析し、タグを提案
- **手動タグ付け**: 自由にタグを追加・削除
- **タグフィルタリング**: 複数タグで絞り込み表示
- **「untagged」自動削除**: AIタグ追加時に未分類タグを自動削除

### 🎬 スライドショー
- **フルスクリーン表示**: クライアント提案に最適
- **自動再生 & 手動操作**: 矢印キーで画像切り替え
- **プログレスバー**: 進行状況を可視化

### 📝 メモ機能
- 各画像にテキストメモを追加
- 参考ポイントやアイデアを記録

### 📱 PWA対応
- **ホーム画面に追加**: アプリのように使える
- **オフライン動作**: Service Workerでキャッシュ
- **高速起動**: インストール不要

## 🛠️ 技術スタック / Tech Stack

### フロントエンド
- **Next.js 16** (App Router, Static Export)
- **React 19** (Client Components)
- **TypeScript 5**
- **Tailwind CSS 4**

### 状態管理・データ
- **Zustand** - グローバル状態管理
- **Dexie** - IndexedDB wrapper
- **browser-image-compression** - 画像圧縮

### AI機能
- **Google Gemini API** - 画像分析・タグ生成

### テスト
- **Jest** - 単体テスト
- **Testing Library** - コンポーネントテスト
- **Playwright** - E2Eテスト
- **tsd** - 型テスト

## 🚀 セットアップ / Setup

### 必要要件
- Node.js 20.x 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/reference-curator.git
cd reference-curator/app022

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開く

### Gemini API設定（オプション）

AIタグ自動生成を使用する場合：

1. [Google AI Studio](https://aistudio.google.com/app/apikey) でAPIキーを取得
2. アプリの「設定」セクションでAPIキーを保存
3. 画像詳細モーダルで「AIタグを取得」ボタンが使えるように

## 📖 使い方 / Usage

### 1. 画像を追加
- 左サイドバーの「📁 画像を選択」ボタンをクリック
- JPG/PNG/GIF/WebP形式の画像を選択（複数可）

### 2. タグ付け
**手動タグ付け**:
- 画像カードをクリックして詳細モーダルを開く
- 下部の「タグを追加」入力欄でタグを追加

**AIタグ自動生成**:
- 画像詳細モーダルで「AIタグを取得」ボタンをクリック
- 数秒でAIが画像を分析してタグ候補を表示
- 気に入ったタグの「追加」ボタンをクリック

### 3. フィルタリング
- 左サイドバーの「タグでフィルタ」でタグを選択
- 選択したタグの画像だけを表示

### 4. スライドショー
- ヘッダーの「🎬 スライドショー開始」をクリック
- フルスクリーン表示で自動再生
- 矢印キー（←/→）で手動切り替え
- Escキーで終了

### 5. メモ追加
- 画像詳細モーダルの「メモ」欄にテキストを入力
- 「保存」ボタンをクリック

## 🔧 開発 / Development

### スクリプト

```bash
# 開発サーバー
npm run dev

# 本番ビルド
npm run build

# 静的ファイル出力（PWA対応）
npm run build && open out/index.html

# テスト実行
npm test                # 単体テスト
npm run test:watch      # 単体テスト（watch mode）
npm run test:e2e        # E2Eテスト
npm run test:types      # 型検証

# Lint
npm run lint
```

### ディレクトリ構造

```
app022/
├── app/                    # Next.js App Router
│   ├── components/         # Reactコンポーネント
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # トップページ
├── lib/                    # ユーティリティ・ロジック
│   ├── db.ts               # Dexie設定
│   ├── geminiService.ts    # Gemini API
│   ├── imageFactory.ts     # 画像オブジェクト生成
│   └── imageUtils.ts       # 画像処理
├── store/                  # Zustand状態管理
│   └── useImageStore.ts    # メインストア
├── types/                  # 型定義
├── __tests__/              # テスト
├── e2e/                    # E2Eテスト
├── public/                 # 静的ファイル
│   ├── manifest.json       # PWA Manifest
│   ├── sw.js               # Service Worker
│   └── icon-*.png          # PWAアイコン
└── doc/                    # ドキュメント
```

## 🔐 プライバシー / Privacy

- **完全ローカル動作**: 画像データはブラウザ内（IndexedDB）のみに保存
- **サーバー送信なし**: 画像ファイルは外部送信されません
- **APIキー管理**: Gemini APIキーはlocalStorageに保存（任意）
- **オフライン対応**: ネットワークなしでも閲覧・編集可能

## 📄 ライセンス / License

MIT License

## 🤝 コントリビューション / Contributing

Pull Requestを歓迎します！

1. このリポジトリをフォーク
2. featureブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## 📮 お問い合わせ / Contact

プロジェクトに関する質問や提案は、Issueを作成してください。

---

Made with ❤️ for designers and creators
