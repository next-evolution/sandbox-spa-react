# sandbox-spa-react

- Vite + React 18 + TypeScript で構築された SPA。
- AWS Cognito による認証と RestAPI との連携を行う。

---

## このファイルの管理方針

**CLAUDE.md は「Claudeの行動を変える指示書」** であり、ドキュメントではない。
毎回コンテキストに全文読み込まれるため、肥大化させない。

| 種類 | 置き場所 |
|---|---|
| コーディング規約・禁止事項 | **CLAUDE.md** |
| アーキテクチャの制約（依存方向など） | **CLAUDE.md** |
| ビルド・実行コマンド | **CLAUDE.md** |
| 重要な落とし穴 | **CLAUDE.md** |
| 画面一覧・ルーティング | `docs/pages.md` |
| タスク指示（step 系） | **プロンプトで渡す** |

---

## 共通仕様（横断・FE/BE共通の大枠仕様）

@../documents/architecture/auth.md
@../documents/architecture/api-design.md

---

## ドキュメント参照先

| 内容 | ファイル |
|---|---|
| 画面一覧・ルーティング・アクセス制御 | [docs/pages.md](docs/pages.md) |
| バックエンド API 仕様 | [api-docs.yaml](../documents/architecture/api-docs.yaml) |


---

## Build & Run

```bash
# 開発サーバ起動（http://localhost:5173）
npm run dev

# 型チェック + 本番ビルド
npm run build

# ビルド成果物のプレビュー
npm run preview

# Lint
npm run lint

# フォーマット
npm run format
```

### 必要な環境変数（`.env.local`）

| 変数名 | 例 |
|---|---|
| VITE_COGNITO_USER_POOL_ID | ap-northeast-1_XXXXXXXXX |
| VITE_COGNITO_CLIENT_ID | xxxxxxxxxxxxxxxxxxxx |
| VITE_COGNITO_REGION | ap-northeast-1 |
| VITE_APP_SANDBOX_API | http://localhost:8080 |

---

## アーキテクチャ

### ディレクトリ構成

```
src/
├── pages/       # 画面コンポーネント（ルート単位）
├── router/      # React Router 設定・ルートガード
├── components/  # 共通 UI コンポーネント
├── contexts/    # React Context（AuthContext）
├── hooks/       # カスタムフック
├── sandbox/     # バックエンド連携（api/dto）
├── config/      # 設定（Cognito など）
└── constants/   # 定数
```

### ルートガード

| ガード | 条件 |
|---|---|
| `GuardMember` | 認証済み・承認済み・未ブロック |
| `GuardAdmin` | GuardMember の条件 + `sandboxUser.admin === true` |
| `GuardRegistration` | 認証済みかつ `sandboxUser` が未登録（初回登録フロー） |

### 認証フロー

1. AWS Amplify（Cognito）でサインイン → JWT 取得
2. `AuthContext` が JWT をメモリ保持、`sandboxUser` を API から取得
3. ルートガードが `sandboxUser.approved / admin / blocked` を見てリダイレクト制御
4. API リクエストは `sandbox/api/sandboxApi.ts` の axios インスタンス経由。JWT は HttpOnly Cookie に格納され `withCredentials` で自動送信される（ログインAPI呼び出しのみ、Cookie未発行のため例外的に Authorization ヘッダで明示付与。[loginApi.ts](src/sandbox/api/loginApi.ts) 参照）

---

## 実装規約

### API 呼び出し

- `src/sandbox/api/` 配下のモジュールを経由する。直接 `fetch` / `axios` を呼ばない
- レスポンスの `returnCode !== 0` はビジネスエラーとして `showToast` で通知する
- CSRF トークンは `sandboxApi.ts` の axios 設定（`xsrfCookieName` / `xsrfHeaderName` / `withXSRFToken: true`）が自動でヘッダー付与する。手動で `X-XSRF-TOKEN` を付ける実装は不要（むしろ二重管理になるので避ける）

### 状態管理

- サーバー状態は各ページの `useState` + `useEffect` で管理（グローバルストアは導入しない）
- 認証情報は `AuthContext`（`useAuth()`）からのみ取得する

### コンポーネント設計

- ページ単位のファイルは `src/pages/<route>/index.tsx` に配置する
- ページ内で使うサブコンポーネントは同ディレクトリ内に置く（共通化は `src/components/` へ）
- `userId` 等の機密情報をコンポーネントの props 経由で引き回さず、`useAuth()` から取得する

### 型

- `any` は使用禁止。型が不明な場合は `unknown` を使い、型ガードで絞り込む
- DTO 型は `src/sandbox/dto/` に集約する
