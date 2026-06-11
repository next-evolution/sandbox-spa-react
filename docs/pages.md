# 画面一覧

ルーティング定義: `src/router/index.tsx`

---

## Public（認証不要）

| パス | コンポーネント | 概要 |
|---|---|---|
| `/` | `HomePage` | トップ / ランディングページ。認証済みの場合はトークン情報も表示 |
| `/login` | `LoginPage` | ログイン画面。Cognito 認証 |
| `/user/registration` | `RegistrationPage` | 初回登録画面（`GuardRegistration`: 認証済み・未登録ユーザのみ） |
| `/pending-approval` | `PendingApprovalPage` | 承認待ち案内画面 |
| `/error/blocked` | `BlockedPage` | アカウントブロック時のエラー画面 |
| `/debug` | `DebugPage` | デバッグメニュー |
| `/debug/color-sample` | `ColorSamplePage` | カラーサンプル確認画面 |
| `/debug/lot-simulator` | `LotSimilatorPage` | ロットシミュレーター（デバッグ用） |

---

## Member（`GuardMember`: 認証済み・承認済み・未ブロック）

| パス | コンポーネント | 概要 |
|---|---|---|
| `/menu` | `MenuPage` | メインメニュー。管理者には Admin カテゴリも表示 |
| `/user/profile` | `ProfilePage` | プロフィール編集（ニックネーム変更） |
| `/master/fx/country` | `CountryPage` | FX マスタ：国マスタ管理 |
| `/master/fx/symbol` | `SymbolPage` | FX マスタ：シンボルマスタ管理 |
| `/master/fx/summertime` | `SummerTimePage` | FX マスタ：サマータイムマスタ管理 |
| `/master/fx/economic-indicator` | `EconomicIndicatorPage` | FX マスタ：経済指標マスタ管理 |
| `/fx/bar-data/:symbolType/:barType` | `BarDataPage` | FX バーデータ一覧（symbolType: Trade/Analyze, barType: 1H など） |
| `/fx/bar-data/import-csv/:symbolType` | `BarDataImportPage` | FX バーデータ CSV インポート |
| `/fx/economic-indicator-data` | `EconomicIndicatorDataPage` | FX 経済指標データ一覧 |
| `/fx/economic-indicator-data/import-text` | `EconomicIndicatorDataImportPage` | FX 経済指標データ テキストインポート |
| `/fx/trade/simulator` | `SimulatorPage` | FX トレードシミュレーター |

---

## Admin（`GuardAdmin`: Member 条件 + `sandboxUser.admin === true`）

| パス | コンポーネント | 概要 |
|---|---|---|
| `/menu2` | `Menu2Page` | 管理者向けサブメニュー |
| `/fx/zigzag` | `ZigZagPage` | FX ZigZag 分析一覧 |
| `/fx/zigzag/generate` | `ZigZagGeneratePage` | FX ZigZag 生成処理 |
| `/admin/users` | `AdminUsersPage` | ユーザ管理（一覧・承認・ブロック） |
| `/admin/master-refresh` | `MasterRefreshPage` | マスタリフレッシュ（キャッシュ更新） |

---

## ルートガードのリダイレクト仕様

```
未認証            → /login
ブロック済み       → /error/blocked
承認待ち          → /pending-approval
非管理者（Admin）  → /error/forbidden
```
