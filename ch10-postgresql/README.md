# ch10-postgresql

PostgreSQL MCP サーバーの設定例とDocker Compose環境。

## セットアップ

```bash
cd ch10-postgresql

# PostgreSQL起動
docker compose up -d

# Claude Code に登録
claude mcp add postgres \
  -e DATABASE_URL=postgresql://demo:demo@localhost:5432/demo \
  -- uvx postgres-mcp
```

## ファイル構成

| ファイル | 内容 |
|---------|------|
| `docker-compose.yml` | PostgreSQL + サンプルデータ |
| `init.sql` | テーブル定義・初期データ |
| `settings-stdio.json` | stdio設定例（crystaldba/postgres-mcp） |
| `settings-dbhub.json` | dbhub（マルチDB）設定例 |
