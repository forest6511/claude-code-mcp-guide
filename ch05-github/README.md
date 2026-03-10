# ch05-github — GitHub MCP 設定・活用例

## セットアップ

### 方法1: リモートサーバー（HTTP、推奨）

```bash
claude mcp add --transport http github \
  https://api.githubcopilot.com/mcp/
```

初回接続時にブラウザで GitHub OAuth 認証が実行されます。

### 方法2: リモートサーバー + PAT

```bash
claude mcp add-json github '{
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "Authorization": "Bearer YOUR_GITHUB_PAT"
  }
}'
```

### 方法3: ローカルサーバー（Docker、stdio）

```bash
claude mcp add github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_PAT \
  -- docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN \
  ghcr.io/github/github-mcp-server
```

### 方法4: settings.json（HTTP）

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

### 方法5: settings.json（Docker stdio）

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    }
  }
}
```

## 認証方式

| 方式 | トークン形式 | 特徴 |
|------|------------|------|
| OAuth（リモート） | ブラウザ認証 | 推奨。Claude Codeが自動処理 |
| Classic PAT | `ghp_*` | スコープに応じてツールを自動非表示 |
| Fine-grained PAT | `github_pat_*` | 全ツール表示。APIが実行時に権限チェック |

## 動作確認

```bash
claude mcp list
```

`github: connected` と表示されれば設定完了。

## ツールセット（20セット、80+ツール）

デフォルト有効: `context`, `repos`, `issues`, `pull_requests`, `users`

### ツールセット制御

```bash
# 環境変数で指定
GITHUB_TOOLSETS=repos,issues,pull_requests

# CLIフラグで指定（ローカルサーバー）
--toolsets repos,issues,pull_requests

# 読み取り専用モード
--read-only
```

## 活用パターン

### パターン1: コードレビュー

```
このPRの変更内容をレビューして改善点を指摘して
```

### パターン2: Issue管理

```
このリポジトリのopen issueを一覧表示して、優先度順に整理して
```

### パターン3: PR作成

```
feature/auth ブランチからmainに向けてPRを作成して
```

### パターン4: CI/CDデバッグ

```
直近の失敗したGitHub Actionsのログを確認して原因を分析して
```

## レート制限

- 認証済み: 5,000リクエスト/時間
- Search API: 30リクエスト/分
- 対策: 必要なツールセットのみ有効化
