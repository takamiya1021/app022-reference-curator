# app022: リファレンス・キュレーター - 技術設計書

## 1. 技術スタック

### 1.1 フレームワーク・ライブラリ
- **Next.js**: 14.x (App Router)
- **React**: 18.x
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.x

### 1.2 選定理由
- **Next.js 14**: App Router採用でサーバーコンポーネント活用、SEO対応、静的エクスポート可能
- **React 18**: Concurrent Features、useTransition等の最新機能活用
- **TypeScript**: 型安全性、開発効率向上、エディタサポート充実
- **Tailwind CSS**: ユーティリティファースト、高速開発、一貫したデザイン

### 1.3 主要ライブラリ
- **状態管理**: Zustand（軽量、シンプル、TypeScript完全対応）
- **データ永続化**: IndexedDB（Dexie.js）
- **ドラッグ&ドロップ**: react-dropzone
- **画像処理**: browser-image-compression（サムネイル生成）
- **AI API**: @google/genai（Gemini API）
- **UI コンポーネント**: Radix UI（アクセシビリティ対応）
- **アイコン**: lucide-react

## 2. アーキテクチャ設計

### 2.1 全体アーキテクチャ
```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│  (Next.js App Router + React Components)│
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Application Layer              │
│    (State Management: Zustand)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Data Layer                    │
│  (IndexedDB + LocalStorage + Gemini API)│
└─────────────────────────────────────────┘
```

### 2.2 コンポーネント構成
```
app/
├── page.tsx                    # メインページ
├── layout.tsx                  # ルートレイアウト
└── components/
    ├── ImageUploader.tsx       # 画像アップロード
    ├── ImageGrid.tsx           # 画像グリッド表示
    ├── ImageCard.tsx           # 画像カード
    ├── TagManager.tsx          # タグ管理
    ├── TagFilter.tsx           # タグフィルター
    ├── Slideshow.tsx           # スライドショー
    ├── ImageDetailModal.tsx    # 画像詳細モーダル
    ├── AITagSuggestion.tsx     # AI タグ提案
    ├── ApiKeySettings.tsx      # APIキー設定
    └── Header.tsx              # ヘッダー
```

## 3. データモデル設計

### 3.1 ImageData（画像データ）
```typescript
interface ImageData {
  id: string;                    // UUID
  file: Blob;                    // 画像ファイル（IndexedDB）
  thumbnail: string;             // サムネイル（Base64）
  fileName: string;              // ファイル名
  mimeType: string;              // MIME タイプ
  tags: string[];                // タグ配列
  memo?: string;                 // メモ
  aiDescription?: string;        // AI生成説明文
  aiTags?: string[];             // AI提案タグ
  createdAt: Date;               // 作成日時
  updatedAt: Date;               // 更新日時
}
```

### 3.2 Tag（タグ）
```typescript
interface Tag {
  id: string;                    // UUID
  name: string;                  // タグ名
  color: string;                 // 色（Tailwind色クラス）
  count: number;                 // 使用回数
  createdAt: Date;               // 作成日時
}
```

### 3.3 AppSettings（アプリ設定）
```typescript
interface AppSettings {
  geminiApiKey?: string;         // Gemini APIキー
  slideshowInterval: number;     // スライドショー間隔（秒）
  thumbnailSize: number;         // サムネイルサイズ
  gridColumns: number;           // グリッド列数
}
```

## 4. ファイル構成

```
app022/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── components/
│       ├── ImageUploader.tsx
│       ├── ImageGrid.tsx
│       ├── ImageCard.tsx
│       ├── TagManager.tsx
│       ├── TagFilter.tsx
│       ├── Slideshow.tsx
│       ├── ImageDetailModal.tsx
│       ├── AITagSuggestion.tsx
│       ├── ApiKeySettings.tsx
│       └── Header.tsx
├── lib/
│   ├── db.ts                    # IndexedDB初期化（Dexie.js）
│   ├── imageUtils.ts            # 画像処理ユーティリティ
│   ├── geminiService.ts         # Gemini API呼び出し
│   └── storage.ts               # LocalStorage管理
├── store/
│   └── useImageStore.ts         # Zustand Store
├── types/
│   └── index.ts                 # 型定義
├── public/
│   └── placeholder.png          # プレースホルダー画像
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 5. API・インターフェース設計

### 5.1 IndexedDB スキーマ（Dexie.js）
```typescript
class ImageDatabase extends Dexie {
  images!: Table<ImageData>;
  tags!: Table<Tag>;

  constructor() {
    super('ReferenceLibrary');
    this.version(1).stores({
      images: 'id, *tags, createdAt, updatedAt',
      tags: 'id, name, count'
    });
  }
}
```

### 5.2 Zustand Store
```typescript
interface ImageStore {
  // State
  images: ImageData[];
  tags: Tag[];
  selectedTags: string[];
  searchQuery: string;

  // Actions
  addImage: (image: ImageData) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
  updateImage: (id: string, updates: Partial<ImageData>) => Promise<void>;
  addTag: (imageId: string, tag: string) => Promise<void>;
  removeTag: (imageId: string, tag: string) => Promise<void>;
  setSelectedTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;

  // Computed
  filteredImages: () => ImageData[];
}
```

### 5.3 Gemini API インターフェース
```typescript
interface GeminiService {
  // 画像分析・タグ生成
  analyzeImage(imageData: string): Promise<{
    tags: string[];
    description: string;
  }>;

  // コンセプト提案
  generateConcept(images: ImageData[]): Promise<string>;
}
```

## 6. 主要機能の実装方針

### 6.1 画像アップロード
1. react-dropzone でドラッグ&ドロップ受付
2. browser-image-compression でサムネイル生成（300x300px）
3. 元画像は Blob として IndexedDB に保存
4. サムネイルは Base64 として IndexedDB に保存
5. メタデータを Zustand Store に追加

### 6.2 タグ管理
1. タグ入力時にオートコンプリート（既存タグから候補表示）
2. タグ追加時に Tag テーブルの count を更新
3. タグ削除時に count をデクリメント、count=0 なら Tag削除
4. タグフィルターは AND条件（複数タグ全てを持つ画像のみ表示）

### 6.3 スライドショー
1. フルスクリーンモード（Fullscreen API）
2. 自動送り（setInterval）
3. 手動送り（矢印キー、クリック）
4. ESCキーで終了
5. 進行状況バー表示

### 6.4 AI機能（Gemini API）
1. APIキー設定画面（LocalStorage保存）
2. 画像分析：
   - 画像を Base64 エンコード
   - Gemini Vision API に送信
   - タグ・説明文を取得
   - ユーザーが承認・編集可能
3. エラーハンドリング：
   - APIキー未設定時は機能無効化
   - レート制限エラー時は適切なメッセージ表示
   - 無料枠超過時の警告表示

## 7. パフォーマンス最適化

### 7.1 画像読み込み
- Lazy Loading（react-lazyload）
- IntersectionObserver でビューポート内のみ読み込み
- サムネイル優先表示、クリック時に元画像読み込み

### 7.2 IndexedDB
- バッチ処理（複数画像の一括追加）
- インデックス最適化（tags配列にマルチエントリインデックス）
- 定期的な圧縮（古いデータのクリーンアップ）

### 7.3 React最適化
- React.memo でコンポーネント再レンダリング抑制
- useMemo/useCallback で不要な再計算防止
- Virtualization（react-window）で大量画像対応

## 8. セキュリティ対策

### 8.1 入力検証
- ファイルタイプ検証（MIME type チェック）
- ファイルサイズ制限（1ファイル 10MB以下）
- タグ入力のサニタイズ（XSS対策）

### 8.2 APIキー管理
- LocalStorage保存（平文、暗号化なし）
- APIキーは外部送信しない（Gemini API以外）
- 設定画面でマスク表示（****）

### 8.3 データ保護
- IndexedDB のデータはブラウザ内のみ
- エクスポート時はユーザーの明示的な操作のみ
- 外部URLへのデータ送信なし

## 9. エラーハンドリング

### 9.1 画像アップロード
- 対応形式外: 「対応していない画像形式です」
- サイズ超過: 「ファイルサイズが10MBを超えています」
- 容量不足: 「ストレージ容量が不足しています」

### 9.2 Gemini API
- APIキー未設定: 「APIキーを設定してください」
- レート制限: 「APIリクエスト制限に達しました。しばらくお待ちください」
- 無料枠超過: 「無料枠を超過しました。GCP Billingを確認してください」
- ネットワークエラー: 「ネットワークエラーが発生しました」

### 9.3 IndexedDB
- 容量不足: 「ストレージ容量が不足しています。不要な画像を削除してください」
- データ破損: 「データベースエラーが発生しました。再読み込みしてください」

## 10. テスト戦略

### 10.1 単体テスト（Jest + React Testing Library）
- ユーティリティ関数（imageUtils, storage）
- Zustand Store のアクション
- 各コンポーネントの表示・操作

### 10.2 統合テスト
- 画像アップロード → 保存 → 表示
- タグ追加 → フィルタリング → 検索
- スライドショー全体フロー

### 10.3 E2Eテスト（Playwright）
- ユーザーシナリオ全体
- ブラウザ間互換性確認
- パフォーマンス計測

## 11. デプロイ・運用

### 11.1 ビルド
- `next build` で静的エクスポート
- Vercel / Netlify / GitHub Pages 対応

### 11.2 ブラウザ対応
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

### 11.3 モニタリング
- エラー追跡（Sentry等、オプション）
- ユーザーフィードバック収集

## 12. 今後の拡張性

### 12.1 追加機能候補
- コレクション機能（複数プロジェクト管理）
- 画像編集（クロップ、フィルター）
- クラウド同期（Firebase等）
- チーム共有機能

### 12.2 技術的改善
- Service Worker（PWA化）
- WebAssembly（画像処理高速化）
- WebRTC（P2P共有）
