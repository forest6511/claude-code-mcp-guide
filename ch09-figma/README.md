# ch09-figma

Figma MCP サーバーの設定例。

## セットアップ

```bash
# リモートサーバー（推奨）
claude mcp add --transport http figma https://mcp.figma.com/mcp

# デスクトップサーバー（Figmaアプリ起動必須）
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

認証: OAuth 2.0（ブラウザベース）。初回接続時にFigmaの認証画面が開きます。

## ファイル構成

| ファイル | 内容 |
|---------|------|
| `settings-remote.json` | リモートサーバー設定例 |
| `settings-desktop.json` | デスクトップサーバー設定例 |
