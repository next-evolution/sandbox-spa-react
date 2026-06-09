# sandbox-spa-react

FX トレード関連データの管理・分析を行う React SPA。AWS Cognito によるユーザー認証と独自の sandbox-api をバックエンドとして使用する。

---

## 技術スタック

| カテゴリ | ライブラリ / ツール |
|---|---|
| UI フレームワーク | React 18 |
| 言語 | TypeScript 5 |
| ビルドツール | Vite 5 |
| ルーティング | React Router v6 |
| HTTP クライアント | Axios |
| 認証 | AWS Amplify v6 (Cognito) |
| Linter | ESLint 10 + typescript-eslint + eslint-plugin-react-hooks |
| Formatter | Prettier 3 |

---

## セットアップ

```bash
# 依存関係インストール
npm install

# 環境変数ファイルを作成
cp .env.example .env
# .env を編集して Cognito 設定と API URL を記入
```

`.env` に設定が必要な変数：

```
VITE_COGNITO_USER_POOL_ID=ap-northeast-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_COGNITO_REGION=ap-northeast-1

VITE_APP_SANDBOX_API=http://localhost:8080
```

---

## 開発用コマンド

```bash
npm run dev        # 開発サーバー起動 (port 3000)
npm run build      # 型チェック + 本番ビルド
npm run preview    # ビルド成果物のプレビュー
npm run lint       # ESLint 実行
npm run format     # Prettier で src/ を整形
```

開発サーバーは `/api/` へのリクエストを `VITE_APP_SANDBOX_API` にプロキシする。

---

## ディレクトリ構成

```
src/
├── config/          # Amplify などの初期化設定
├── constants/       # 定数定義 (symbolType, barType など)
├── contexts/        # React Context (AuthContext)
├── components/      # 共通コンポーネント
├── hooks/           # カスタムフック
├── router/          # ルーティング設定・Guard コンポーネント
├── pages/           # ページコンポーネント
│   ├── home/
│   ├── login/
│   ├── user/        # ユーザー登録・プロフィール
│   ├── master/fx/   # マスタ管理 (通貨・指標・サマータイム)
│   ├── fx/          # FX データ管理・分析
│   ├── admin/       # 管理者機能
│   └── debug/       # 開発用デバッグページ
└── sandbox/         # sandbox-api との通信レイヤー
    ├── api/         # API 呼び出し関数
    └── dto/         # リクエスト・レスポンス型定義
```

---

## 認証とルートガード

認証は AWS Cognito (aws-amplify) で行い、アプリ独自の `SandboxUser` 情報は localStorage にキャッシュする。

ルートは 3 段階のアクセス制御で保護される：

- **public** — 未ログインでもアクセス可 (`/`, `/login`, `/user/registration` など)
- **GuardMember** — ログイン済みかつ承認済みユーザーが対象
- **GuardAdmin** — 管理者フラグが立っているユーザーのみ対象

---

## API 通信

`src/sandbox/api/sandboxApi.ts` で Axios インスタンスを生成し、各 API モジュール (`barDataApi.ts`, `countryApi.ts` など) がそれを使って呼び出しを行う。
Cognito の JWT トークンはリクエストヘッダーに自動付与する。

---

## Lint / Format

ESLint と Prettier は**共存設定**になっており、フォーマットルールは Prettier に一元化している (`eslint-config-prettier` で ESLint 側のフォーマットルールを無効化)。

### Prettier 主要設定 (`.prettierrc`)

| 項目 | 値 |
|---|---|
| 行幅 | 100 文字 |
| セミコロン | なし |
| クォート | シングル |
| 末尾カンマ | ES5 準拠 |
| 改行コード | LF |

### ESLint 主要ルール

- `typescript-eslint` recommended を適用
- `react-hooks/rules-of-hooks` / `react-hooks/exhaustive-deps` を適用
- `@typescript-eslint/no-unused-vars` — `_` プレフィックスは警告対象外
- `react-refresh/only-export-components` — HMR 最適化のため警告

### パスエイリアス

`@/` は `src/` に解決される。vite.config.ts と tsconfig.json の両方で設定済み。

```ts
import { sandboxApi } from '@/sandbox/api/sandboxApi'
```
