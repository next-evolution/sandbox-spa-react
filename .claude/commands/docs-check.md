# docs-check

`docs/pages.md` と `docs/api-docs.yaml` が実装と乖離していないかチェックする。

## 手順

以下を順番に実施し、差異をまとめてレポートする。

### 1. ルーター vs `docs/pages.md`

- `src/router/index.tsx` を読む
- 全ルートのパス・適用ガード（`GuardMember` / `GuardAdmin` / `GuardRegistration` / ガードなし）・インポートしているコンポーネント名を抽出する
- `docs/pages.md` の各テーブル（Public / Member / Admin）の記載と照合する
- 乖離の例: ドキュメントにあるがルーターに定義がないパス、ガード区分の違い、コンポーネント名の不一致

### 2. API クライアント vs `docs/api-docs.yaml`

- `src/sandbox/api/` 配下の全 `.ts` ファイルを読む
- 各関数が呼び出しているエンドポイント（URL・HTTP メソッド）を抽出する
- `docs/api-docs.yaml` の `paths` セクションと照合する
- 乖離の例: ドキュメントに定義されたパスがクライアントに実装されていない、URL の誤り、メソッド（GET/POST/PUT/DELETE）の違い

### 3. DTO vs `docs/api-docs.yaml`

- `src/sandbox/dto/` 配下の全 `.ts` ファイルを読む
- 各インターフェースのフィールド名・型を抽出する
- `docs/api-docs.yaml` の `components/schemas` セクションと照合する
- 乖離の例: フィールド名の違い（例: `id` vs `code`）、型の違い（`number` vs `string`）、`required` に含まれるフィールドが `?` (optional) になっている

## レポート形式

差異がある場合:

```
## 差異あり

### [チェック項目]
- **項目**: （ドキュメントの記載）
- **実装**: （実際の実装）
- **修正案**: （推奨される修正内容）
```

差異がない場合:

```
## 差異なし
docs/*.md / docs/api-docs.yaml と実装の間に乖離は見つかりませんでした。
```
