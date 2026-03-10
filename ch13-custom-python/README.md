# ch13-custom-python

Python SDK（FastMCP）を使ったカスタム MCP サーバー開発のサンプルコード。

## セットアップ

```bash
cd ch13-custom-python
uv add "mcp[cli]"
```

## ファイル構成

| ファイル | 内容 |
|---------|------|
| `server.py` | stdio トランスポート版（基本） |
| `server_http.py` | Streamable HTTP トランスポート版 |
| `server_lifespan.py` | Lifespan パターン（DB接続管理） |

## 実行

```bash
# stdio（MCP Inspector で確認）
uv run mcp dev server.py

# Streamable HTTP
uv run python server_http.py

# Claude Code に登録（stdio）
claude mcp add weather-server -- uv run python /path/to/server.py
```
