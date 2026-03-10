# ch04-playwright — Playwright MCP 設定・活用例

## セットアップ

### 方法1: CLI（推奨）

```bash
# デフォルト（headed、Snapshotモード）
claude mcp add playwright -- npx @playwright/mcp@latest

# ヘッドレスモード（CI/サーバー環境向け）
claude mcp add playwright -- npx @playwright/mcp@latest --headless

# Visionモード（Canvas/画像メインのサイト向け）
claude mcp add playwright -- npx @playwright/mcp@latest --caps vision
```

### 方法2: settings.json（stdio）

`~/.claude/settings.json` に追加:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### ヘッドレス + Visionモード

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless",
        "--caps", "vision,pdf"
      ]
    }
  }
}
```

### プロジェクトスコープ（.mcp.json）

プロジェクトルートに `.mcp.json` を作成:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headless"]
    }
  }
}
```

## 事前準備

初回利用時はブラウザバイナリ（~300MB）のダウンロードが必要です:

```bash
npx playwright install chromium
```

## 動作確認

Claude Code を起動し、以下のプロンプトで確認:

```
https://example.com にアクセスして、ページタイトルを教えて
```

Playwright MCPが有効であれば、`browser_navigate` → `browser_snapshot` の順でページ内容を取得します。

## ツール一覧

### コアツール（22）— 常時利用可能

| ツール | 説明 |
|--------|------|
| `browser_navigate` | URLに遷移 |
| `browser_click` | 要素をクリック（ref指定） |
| `browser_type` | テキスト入力 |
| `browser_fill_form` | 複数フォームフィールドを一括入力 |
| `browser_snapshot` | アクセシビリティスナップショット取得 |
| `browser_take_screenshot` | スクリーンショット撮影 |
| `browser_evaluate` | JavaScript評価 |
| `browser_wait_for` | テキスト出現/消失/時間待ち |
| `browser_tabs` | タブ管理（一覧/作成/閉じる/選択） |

### 追加Capability

| フラグ | 追加ツール | 用途 |
|--------|-----------|------|
| `--caps vision` | `browser_mouse_click_xy` 他6ツール | 座標ベース操作 |
| `--caps pdf` | `browser_pdf_save` | PDF保存 |
| `--caps testing` | `browser_generate_locator` 他5ツール | E2Eテスト支援 |

## 活用パターン

### パターン1: Webスクレイピング

```
https://news.ycombinator.com にアクセスして、上位5記事のタイトルとURLを取得して
```

### パターン2: フォーム操作

```
https://example.com/login にアクセスして、
ユーザー名 "test@example.com"、パスワード "password123" でログインして
```

### パターン3: スクリーンショット取得

```
https://example.com を iPhone 15 のサイズで表示して、スクリーンショットを撮って
```

### パターン4: E2Eテスト生成（--caps testing）

```
このページのログインフォームに対して、Playwright E2Eテストのロケーターを生成して
```

## Snapshotモード vs Visionモード

| 観点 | Snapshotモード（デフォルト） | Visionモード |
|------|---------------------------|-------------|
| 入力形式 | アクセシビリティツリー | スクリーンショット |
| トークンコスト | ~3,800 | ~10,000+ |
| 要素指定 | ref ID（例: `ref=e3`） | 座標（x, y） |
| 推奨用途 | フォーム操作, ナビゲーション | Canvas, 画像メイン |

## 注意事項

- アクションごとにフルスナップショットが送信され、~15ステップ後にコンテキスト劣化
- v0.0.64でブラウザプロファイルがインメモリ（インコグニート）に変更
- ローカルファイル（`file://`）はデフォルトでブロック。`--allow-unrestricted-file-access` が必要
