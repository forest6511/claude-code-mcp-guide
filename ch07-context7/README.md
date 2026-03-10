# ch07-context7 — Context7 MCP 設定・活用例

## セットアップ

### 方法1: CLI（推奨）

```bash
# APIキーなし（低レート制限）
claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp

# APIキーあり（推奨）
claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp --api-key YOUR_API_KEY
```

### 方法2: settings.json（stdio）

`~/.claude/settings.json` に追加:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### 方法3: settings.json（HTTP トランスポート）

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### 方法4: プロジェクトスコープ（.mcp.json）

プロジェクトルートに `.mcp.json` を作成:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

## APIキー取得

1. https://context7.com にアクセス
2. GitHubアカウントでサインイン
3. Dashboard → API Keys → Create Key
4. `ctx7sk` で始まるキーをコピー

APIキーなしでも利用可能（低レート制限）。

## 動作確認

Claude Code を起動し、以下のプロンプトで確認:

```
Next.jsのApp Routerでmiddlewareを設定する方法を教えて use context7
```

Context7 MCPが有効であれば、`resolve-library-id` → `query-docs` の2ステップで最新ドキュメントを取得します。

## ツール一覧

| ツール名 | 説明 |
|---------|------|
| `resolve-library-id` | ライブラリ名をContext7互換IDに解決 |
| `query-docs` | 指定ライブラリの最新ドキュメント・コード例を取得 |

## 活用パターン

### パターン1: プロンプトに "use context7" を追加

```
Reactの useOptimistic hookの使い方を教えて use context7
```

### パターン2: バージョン固定

```
Next.js v15のServer Actionsの仕様を教えて use context7
```

### パターン3: CLAUDE.md に自動化ルール

```markdown
# CLAUDE.md
## ライブラリドキュメント参照ルール
- ライブラリの仕様・APIを参照する際は、必ずContext7 MCPを使用すること
- WebSearchやWebFetchより先にContext7を試すこと
```
