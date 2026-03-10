# ch06-notion — Notion MCP 設定・活用例

## セットアップ

### 方法1: ホスト版（推奨）

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

初回接続時にブラウザで Notion OAuth 認証が実行されます。

### 方法2: ローカル版（stdio）

```bash
claude mcp add notionApi \
  -e NOTION_TOKEN=ntn_xxxxxxxxxxxx \
  -- npx -y @notionhq/notion-mcp-server
```

### 方法3: settings.json（ホスト版）

```json
{
  "mcpServers": {
    "notion": {
      "url": "https://mcp.notion.com/mcp"
    }
  }
}
```

### 方法4: settings.json（ローカル版）

```json
{
  "mcpServers": {
    "notionApi": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "ntn_xxxxxxxxxxxx"
      }
    }
  }
}
```

## 動作確認

```bash
claude mcp list
```

`notion: connected` と表示されれば設定完了。

## ホスト版ツール（16ツール）

| ツール | 説明 |
|--------|------|
| `notion-search` | ワークスペース横断検索 |
| `notion-fetch` | ページ/DBのコンテンツ取得 |
| `notion-create-pages` | ページ作成 |
| `notion-update-page` | ページプロパティ/コンテンツ更新 |
| `notion-move-pages` | ページ/DBの移動 |
| `notion-duplicate-page` | ページ複製 |
| `notion-create-database` | カスタムプロパティ付きDB作成 |
| `notion-update-data-source` | データソースプロパティ更新 |
| `notion-create-comment` | コメント追加 |
| `notion-get-comments` | コメント/ディスカッション一覧 |
| `notion-get-teams` | チームスペース取得 |
| `notion-get-users` | ワークスペースユーザー一覧 |

## 活用パターン

### パターン1: チームナレッジベース

```
Notionで「認証設計」に関するドキュメントを検索して内容を取得して
```

### パターン2: プロジェクト管理

```
Notionのタスクデータベースから未完了タスクを取得して
```

### パターン3: ドキュメント自動更新

```
実装が完了したので、Notionの仕様ドキュメントのステータスを更新して
```

## レート制限

- 平均3リクエスト/秒/インテグレーション
- `notion-search`: 30リクエスト/分
- HTTP 429で `Retry-After` ヘッダー返却
