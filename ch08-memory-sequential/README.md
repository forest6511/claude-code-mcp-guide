# ch08-memory-sequential — Memory + Sequential Thinking MCP 設定・活用例

## セットアップ

### Memory MCP

```bash
# ローカルスコープ（プロジェクト単位で知識グラフを分離）
claude mcp add memory -s local \
  -e MEMORY_FILE_PATH=/path/to/project/memory.jsonl \
  -- npx -y @modelcontextprotocol/server-memory

# ユーザースコープ（全プロジェクト共通）
claude mcp add memory -s user \
  -e MEMORY_FILE_PATH=$HOME/.claude-memory/memory.jsonl \
  -- npx -y @modelcontextprotocol/server-memory
```

### Sequential Thinking MCP

```bash
claude mcp add sequential-thinking -s user \
  -- npx -y @modelcontextprotocol/server-sequential-thinking
```

### 同時設定（settings.json）

→ `settings-combined.json` を参照

## ツール一覧

### Memory MCP（9ツール）

| ツール | 説明 |
|--------|------|
| `create_entities` | エンティティ（ノード）作成 |
| `create_relations` | エンティティ間の有向リレーション作成 |
| `add_observations` | 既存エンティティに観察事項追加 |
| `delete_entities` | エンティティ削除（カスケード） |
| `delete_observations` | 観察事項削除 |
| `delete_relations` | リレーション削除 |
| `read_graph` | グラフ全体取得 |
| `search_nodes` | 名前/型/観察内容で検索 |
| `open_nodes` | 特定エンティティと接続取得 |

### Sequential Thinking MCP（1ツール）

| ツール | 説明 |
|--------|------|
| `sequential_thinking` | 段階的思考プロセスの実行 |

## データモデル

- **Entity**: `{name, entityType, observations[]}` — グラフのノード
- **Relation**: `{from, to, relationType}` — 有向エッジ（能動態で記述）
- **Observation**: エンティティに付与されるアトミックな事実文字列

## ストレージ形式

JSONL形式（`memory.jsonl`）:

```jsonl
{"type":"entity","name":"AuthService","entityType":"module","observations":["JWT認証を担当"]}
{"type":"relation","from":"AuthService","to":"UserRepository","relationType":"depends_on"}
```

## 活用パターン

### パターン1: プロジェクト知識の蓄積

```
このプロジェクトの主要モジュールと依存関係をMemoryに記録して
```

### パターン2: 設計判断の推論と保存

```
認証方式の選択肢を Sequential Thinking で分析して、結論をMemoryに保存して
```

### パターン3: 過去の知識を活用した推論

```
Memoryから認証関連の知識を検索して、新しいAPI設計に活かして
```

## 環境変数

| 変数 | 説明 | デフォルト |
|------|------|----------|
| `MEMORY_FILE_PATH` | JSONLファイルパス | CWDの `memory.jsonl` |
