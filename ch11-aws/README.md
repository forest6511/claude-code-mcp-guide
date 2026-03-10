# ch11-aws

AWS MCPサーバー群の設定例。

## セットアップ

```bash
# Serverless MCP Server
claude mcp add aws-serverless -- uvx awslabs-serverless-mcp-server

# CloudWatch MCP Server
claude mcp add aws-cloudwatch -- uvx awslabs-cloudwatch-mcp-server

# DynamoDB MCP Server
claude mcp add aws-dynamodb -- uvx awslabs-dynamodb-mcp-server

# プロファイル指定
claude mcp add aws-serverless \
  -e AWS_PROFILE=dev \
  -e AWS_DEFAULT_REGION=ap-northeast-1 \
  -- uvx awslabs-serverless-mcp-server
```

## ファイル構成

| ファイル | 内容 |
|---------|------|
| `settings-serverless.json` | Serverless MCP設定例 |
| `settings-multi.json` | 複数AWSサーバー統合設定例 |
