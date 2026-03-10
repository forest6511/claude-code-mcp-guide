# ch12-custom-ts

TypeScript SDK を使ったカスタム MCP サーバー開発のサンプルコード。

## 概要

天気情報を提供する MCP サーバー。Tool・Resource・Prompt の 3 要素を実装。

## セットアップ

```bash
cd ch12-custom-ts
npm install
npm run build
```

## 実行方法

### stdio トランスポート（ローカル開発）

```bash
node dist/index.js
```

Claude Code への登録:

```bash
claude mcp add weather-server -- node /path/to/ch12-custom-ts/dist/index.js
```

### Streamable HTTP トランスポート（リモート／本番）

```bash
node dist/http.js
# → http://127.0.0.1:3000/mcp
```

Claude Code への登録:

```bash
claude mcp add --transport http weather-server http://127.0.0.1:3000/mcp
```

## 提供機能

### Tools

| ツール名 | 説明 |
|---------|------|
| `get_weather` | 指定都市の天気情報を取得 |
| `compare_weather` | 複数都市の天気を比較 |

### Resources

| リソース URI | 説明 |
|-------------|------|
| `weather://cities` | 対応都市一覧 |

### Prompts

| プロンプト名 | 説明 |
|-------------|------|
| `weather-report` | 天気レポート生成プロンプト |

## 検証

```bash
# MCP Inspector で動作確認
npx @modelcontextprotocol/inspector node dist/index.js
```

## 技術スタック

- `@modelcontextprotocol/sdk` v1.27.1
- `zod` （入力バリデーション）
- `express` （HTTP トランスポート用）
- TypeScript 5.x / Node.js 18+
