import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { type Request, type Response } from "express";
import crypto from "node:crypto";
import { z } from "zod";

const weatherData: Record<string, { temp: number; condition: string; humidity: number }> = {
  tokyo: { temp: 22, condition: "晴れ", humidity: 45 },
  osaka: { temp: 24, condition: "曇り", humidity: 55 },
  sapporo: { temp: 12, condition: "雨", humidity: 70 },
  fukuoka: { temp: 25, condition: "晴れ", humidity: 50 },
  naha: { temp: 28, condition: "晴れ", humidity: 65 },
};

const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
});

server.registerTool(
  "get_weather",
  {
    description: "指定した都市の天気情報を取得します",
    inputSchema: {
      city: z.string().describe("都市名（例: tokyo, osaka）"),
    },
  },
  async ({ city }) => {
    const data = weatherData[city.toLowerCase()];
    if (!data) {
      return {
        content: [
          {
            type: "text" as const,
            text: `都市「${city}」の天気データが見つかりません。対応都市: ${Object.keys(weatherData).join(", ")}`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ city, ...data }, null, 2),
        },
      ],
    };
  }
);

const app = express();
app.use(express.json());

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => crypto.randomUUID(),
});

// express.json() でパース済みの body を第3引数で渡す
app.all("/mcp", async (req: Request, res: Response) => {
  await transport.handleRequest(req, res, req.body);
});

await server.connect(transport);

const PORT = process.env.PORT ?? 3000;
app.listen(Number(PORT), "127.0.0.1", () => {
  console.log(`Weather MCP server (HTTP) listening on http://127.0.0.1:${PORT}/mcp`);
});
