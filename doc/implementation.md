# app022: リファレンス・キュレーター - 実装計画書（TDD準拠版）

## 概要
本実装計画書は、TDD（Test-Driven Development）の原則に従い、全ての機能実装において**Red-Green-Refactor**サイクルを適用します。各Phaseでテストを先に書き、実装後にリファクタリングを行うことで、高品質なコードを実現します。

## 完了条件
- ✅ 全テストがパス（Jest + React Testing Library + Playwright）
- ✅ コードカバレッジ80%以上
- ✅ ESLintエラー・警告ゼロ
- ✅ 要件定義書の全機能が実装済み

## 工数見積もり合計
**約50時間**（TDD対応分を含む）

---

## Phase 0: テスト環境構築（予定工数: 3時間）

### 目的
全ての実装の前提となるテスト環境を整備し、TDDサイクルを回せる状態にする。

### タスク

#### 【x】0-1. Next.jsプロジェクト初期化（30分）
- `npx create-next-app@latest app022 --typescript --tailwind --app`
- 基本設定確認（tsconfig.json, next.config.js）
- **Red**: 動作確認テスト作成
- **Green**: プロジェクト起動確認
- **Refactor**: 不要ファイル削除

#### 【x】0-2. Jestセットアップ（1時間）
- **Red**: Jest設定ファイルのテスト作成
- **Green**: Jest, @testing-library/react, @testing-library/jest-dom インストール
  ```bash
  npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
  ```
- jest.config.js, jest.setup.js 作成
- **Refactor**: 設定最適化

#### 【x】0-3. Playwrightセットアップ（1時間）
- **Red**: E2Eテストスケルトン作成
- **Green**: Playwright インストール・設定
  ```bash
  npm install -D @playwright/test
  npx playwright install
  ```
- playwright.config.ts 作成
- **Refactor**: テスト構成整理

#### 【x】0-4. テスト実行確認（30分）
- **Red**: ダミーテスト作成（失敗するテスト）
- **Green**: テスト実行スクリプト設定（package.json）
- `npm test` で正常動作確認
- **Refactor**: テストコマンド整理

---

## Phase 1: データモデル・状態管理実装（予定工数: 6時間）

### 目的
IndexedDB、Zustand Storeなど、アプリの基盤となるデータ層を実装。

### タスク

#### 【 】1-1. IndexedDB（Dexie.js）セットアップ（2時間）
- **Red**: データベース初期化テスト作成
  ```typescript
  // __tests__/lib/db.test.ts
  test('should initialize database', async () => {
    const db = await initDB();
    expect(db.images).toBeDefined();
  });
  ```
- **Green**: Dexie.js インストール・実装
  - `lib/db.ts` 作成
  - ImageDatabase クラス実装
- **Refactor**: スキーマ定義最適化

#### 【 】1-2. 型定義作成（1時間）
- **Red**: 型定義のテスト作成（型チェック）
- **Green**: `types/index.ts` に ImageData, Tag, AppSettings 定義
- **Refactor**: 型の共通化・整理

#### 【 】1-3. Zustand Store実装（3時間）
- **Red**: Store各アクションのテスト作成
  ```typescript
  test('should add image', () => {
    const { addImage, images } = useImageStore.getState();
    addImage(mockImage);
    expect(images).toHaveLength(1);
  });
  ```
- **Green**: `store/useImageStore.ts` 実装
  - addImage, removeImage, updateImage
  - addTag, removeTag
  - フィルタリングロジック
- **Refactor**: 状態管理の最適化

---

## Phase 2: UIコンポーネント実装（予定工数: 12時間）

### 目的
ヘッダー、画像グリッド、画像カードなど基本UIを実装。

### タスク

#### 【 】2-1. Headerコンポーネント（1時間）
- **Red**: Header表示テスト
- **Green**: `app/components/Header.tsx` 実装
- **Refactor**: スタイル・レイアウト調整

#### 【 】2-2. ImageUploaderコンポーネント（3時間）
- **Red**: 画像アップロードテスト（モック）
- **Green**: react-dropzone 統合、サムネイル生成
- **Refactor**: エラーハンドリング改善

#### 【 】2-3. ImageCardコンポーネント（2時間）
- **Red**: カード表示・操作テスト
- **Green**: カードUI実装（サムネイル、タグ、削除ボタン）
- **Refactor**: React.memo適用

#### 【 】2-4. ImageGridコンポーネント（2時間）
- **Red**: グリッドレイアウトテスト
- **Green**: レスポンシブグリッド実装
- **Refactor**: パフォーマンス最適化

#### 【 】2-5. TagManagerコンポーネント（2時間）
- **Red**: タグ追加・削除テスト
- **Green**: タグ入力UI、オートコンプリート実装
- **Refactor**: UX改善

#### 【 】2-6. TagFilterコンポーネント（2時間）
- **Red**: フィルタリングテスト
- **Green**: タグフィルターUI実装
- **Refactor**: フィルター状態管理最適化

---

## Phase 3: 画像処理機能実装（予定工数: 5時間）

### 目的
画像アップロード、サムネイル生成、IndexedDB保存を実装。

### タスク

#### 【 】3-1. 画像圧縮・サムネイル生成（2時間）
- **Red**: 画像圧縮テスト
- **Green**: browser-image-compression 統合
  ```typescript
  // lib/imageUtils.ts
  async function generateThumbnail(file: File): Promise<string>
  ```
- **Refactor**: 圧縮品質調整

#### 【 】3-2. IndexedDB保存・読み込み（2時間）
- **Red**: 保存・読み込みテスト
- **Green**: Blob保存、Base64変換実装
- **Refactor**: エラーハンドリング

#### 【 】3-3. 画像削除機能（1時間）
- **Red**: 削除テスト（DB + UI）
- **Green**: 削除ロジック実装
- **Refactor**: 確認ダイアログ追加

---

## Phase 4: タグ管理・検索機能実装（予定工数: 6時間）

### 目的
タグ管理、検索、フィルタリング機能を実装。

### タスク

#### 【 】4-1. タグ追加・削除（2時間）
- **Red**: タグCRUDテスト
- **Green**: タグ追加・削除ロジック実装
- **Refactor**: Tag テーブル連携最適化

#### 【 】4-2. オートコンプリート（2時間）
- **Red**: オートコンプリート動作テスト
- **Green**: 既存タグからの候補表示実装
- **Refactor**: パフォーマンス改善

#### 【 】4-3. AND条件フィルタリング（2時間）
- **Red**: 複数タグフィルタテスト
- **Green**: AND条件フィルタリング実装
- **Refactor**: フィルターロジック最適化

---

## Phase 5: スライドショー機能実装（予定工数: 4時間）

### 目的
フルスクリーンスライドショーを実装。

### タスク

#### 【 】5-1. Slideshowコンポーネント（2時間）
- **Red**: スライドショー表示テスト
- **Green**: フルスクリーンモード、自動送り実装
- **Refactor**: UX改善（キーボード操作）

#### 【 】5-2. 進行状況バー（1時間）
- **Red**: 進行状況表示テスト
- **Green**: プログレスバー実装
- **Refactor**: アニメーション調整

#### 【 】5-3. 手動操作（1時間）
- **Red**: 矢印キー・クリック操作テスト
- **Green**: キーボード・マウス操作実装
- **Refactor**: 操作性改善

---

## Phase 6: AI機能実装（Gemini API）（予定工数: 8時間）

### 目的
画像分析、タグ生成、コンセプト提案などAI機能を実装。

### タスク

#### 【 】6-1. Gemini API統合（2時間）
- **Red**: API接続テスト（モック）
- **Green**: `lib/geminiService.ts` 実装、@google/genai インストール
- **Refactor**: エラーハンドリング強化

#### 【 】6-2. 画像分析・タグ生成（3時間）
- **Red**: 画像分析テスト（モック）
- **Green**: analyzeImage 実装
  - Base64エンコード
  - Gemini API送信
  - タグパース
- **Refactor**: レート制限対応

#### 【 】6-3. コンセプト提案（2時間）
- **Red**: コンセプト生成テスト
- **Green**: generateConcept 実装
- **Refactor**: プロンプト最適化

#### 【 】6-4. APIキー設定UI（1時間）
- **Red**: 設定画面テスト
- **Green**: ApiKeySettings コンポーネント実装
- **Refactor**: マスク表示、LocalStorage保存

---

## Phase 7: 詳細モーダル・UI改善（予定工数: 4時間）

### 目的
画像詳細モーダル、メモ編集などUXを向上。

### タスク

#### 【 】7-1. ImageDetailModalコンポーネント（2時間）
- **Red**: モーダル表示テスト
- **Green**: 詳細表示、メモ編集UI実装
- **Refactor**: アクセシビリティ対応

#### 【 】7-2. メモ編集機能（1時間）
- **Red**: メモ保存テスト
- **Green**: メモ編集・保存実装
- **Refactor**: デバウンス処理

#### 【 】7-3. AIタグ提案UI（1時間）
- **Red**: AI提案表示テスト
- **Green**: AITagSuggestion コンポーネント実装
- **Refactor**: 承認・編集フロー改善

---

## Phase 8: パフォーマンス最適化（予定工数: 3時間）

### 目的
Lazy Loading、Virtualization、React最適化を実装。

### タスク

#### 【 】8-1. Lazy Loading実装（1時間）
- **Red**: Lazy Loading動作テスト
- **Green**: IntersectionObserver実装
- **Refactor**: ビューポート判定最適化

#### 【 】8-2. React最適化（1時間）
- **Red**: 再レンダリング回数テスト
- **Green**: React.memo, useMemo, useCallback適用
- **Refactor**: パフォーマンス計測

#### 【 】8-3. IndexedDB最適化（1時間）
- **Red**: バッチ処理テスト
- **Green**: 複数画像一括追加実装
- **Refactor**: インデックス最適化

---

## Phase 9: エラーハンドリング・バリデーション（予定工数: 3時間）

### 目的
エラー処理、入力検証を強化。

### タスク

#### 【 】9-1. 画像アップロードバリデーション（1時間）
- **Red**: バリデーションエラーテスト
- **Green**: ファイルタイプ・サイズチェック実装
- **Refactor**: エラーメッセージ改善

#### 【 】9-2. Gemini APIエラーハンドリング（1時間）
- **Red**: APIエラー処理テスト
- **Green**: レート制限、ネットワークエラー処理
- **Refactor**: ユーザーフィードバック改善

#### 【 】9-3. IndexedDBエラーハンドリング（1時間）
- **Red**: DB容量不足テスト
- **Green**: 容量不足、データ破損処理
- **Refactor**: 復旧フロー実装

---

## Phase 10: E2Eテスト・統合テスト（予定工数: 4時間）

### 目的
Playwrightによるユーザーシナリオ全体のテスト。

### タスク

#### 【 】10-1. 画像アップロードシナリオ（1時間）
- **Red**: E2Eテスト作成（失敗）
- **Green**: テストパスまで実装調整
- **Refactor**: テストコード整理

#### 【 】10-2. タグ管理・検索シナリオ（1時間）
- **Red**: E2Eテスト作成
- **Green**: テストパス確認
- **Refactor**: アサーション強化

#### 【 】10-3. スライドショーシナリオ（1時間）
- **Red**: E2Eテスト作成
- **Green**: テストパス確認
- **Refactor**: エッジケース追加

#### 【 】10-4. AI機能統合テスト（1時間）
- **Red**: AI機能E2Eテスト作成
- **Green**: モックAPI使用テスト実装
- **Refactor**: テスト安定性向上

---

## Phase 11: デプロイ準備・最終調整（予定工数: 2時間）

### 目的
静的エクスポート、ビルド確認、ドキュメント整備。

### タスク

#### 【 】11-1. 静的エクスポート設定（30分）
- `next.config.js` に `output: 'export'` 設定
- ビルドエラー修正

#### 【 】11-2. ビルド・動作確認（1時間）
- `npm run build` 実行
- 生成された静的ファイル確認
- ローカルサーバーで動作確認

#### 【 】11-3. README・ドキュメント作成（30分）
- README.md 作成（セットアップ手順、使い方）
- CLAUDE.md準拠のフォルダ構成確認

---

## マイルストーン

### M1: テスト環境構築完了（Phase 0）
- 期限: 開始から1日目
- 完了条件: Jest, Playwright が動作する

### M2: 基本機能実装完了（Phase 1-4）
- 期限: 開始から1週間
- 完了条件: 画像アップロード、タグ管理、検索が動作

### M3: 拡張機能実装完了（Phase 5-7）
- 期限: 開始から2週間
- 完了条件: スライドショー、AI機能が動作

### M4: 品質保証・デプロイ準備完了（Phase 8-11）
- 期限: 開始から3週間
- 完了条件: 全テストパス、カバレッジ80%以上、ビルド成功

---

## 依存関係

- Phase 0 → 全Phase（テスト環境必須）
- Phase 1 → Phase 2, 3, 4, 6（データモデル依存）
- Phase 2 → Phase 5, 7（UIコンポーネント依存）
- Phase 3 → Phase 5（画像処理依存）
- Phase 6 → Phase 7（AI機能依存）
- Phase 8, 9, 10 → 全機能実装完了後

---

## リスク管理

### 高リスク項目
1. **IndexedDB容量制限**: ブラウザごとに制限が異なる
   - 対策: 画像圧縮率調整、容量警告実装
2. **Gemini APIレート制限**: 無料枠超過
   - 対策: レート制限エラー処理、ユーザーへの警告表示
3. **画像処理パフォーマンス**: 大量画像のサムネイル生成
   - 対策: Web Workers使用検討、バッチ処理実装

### 中リスク項目
1. **ブラウザ互換性**: Safari IndexedDB制約
   - 対策: Safari専用テスト実施
2. **テストカバレッジ**: 80%達成困難
   - 対策: Phase 10で集中的にテスト追加

---

## 品質チェックリスト

### コード品質
- [ ] ESLint エラー・警告ゼロ
- [ ] TypeScript型エラーゼロ
- [ ] 全コンポーネントにReact.memo適用（必要箇所）
- [ ] 全非同期処理にエラーハンドリング実装

### テスト品質
- [ ] 単体テストカバレッジ80%以上
- [ ] E2Eテスト全シナリオパス
- [ ] ブラウザ間互換性確認（Chrome, Firefox, Safari, Edge）

### UX品質
- [ ] 画像アップロードが直感的
- [ ] タグ管理が使いやすい
- [ ] スライドショーがスムーズ
- [ ] AI機能の待ち時間に適切なフィードバック

### セキュリティ
- [ ] XSS対策実装
- [ ] APIキーが平文表示されない
- [ ] ファイルタイプ検証実装
