import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// サンプル天気データ（実運用ではAPIを呼ぶ）
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

// --- Tool: 天気を取得 ---
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
          text: JSON.stringify(
            { city, ...data },
            null,
            2
          ),
        },
      ],
    };
  }
);

// --- Tool: 複数都市の比較 ---
server.registerTool(
  "compare_weather",
  {
    description: "複数都市の天気を比較します",
    inputSchema: {
      cities: z.array(z.string()).min(2).describe("比較する都市名の配列"),
    },
  },
  async ({ cities }) => {
    const results = cities.map((city) => {
      const data = weatherData[city.toLowerCase()];
      return data
        ? { city, ...data }
        : { city, error: "データなし" };
    });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

// --- Resource: 対応都市一覧 ---
server.registerResource(
  "cities",
  "weather://cities",
  { description: "対応している都市の一覧" },
  async () => ({
    contents: [
      {
        uri: "weather://cities",
        text: JSON.stringify(Object.keys(weatherData), null, 2),
        mimeType: "application/json",
      },
    ],
  })
);

// --- Prompt: 天気レポート生成 ---
server.registerPrompt(
  "weather-report",
  {
    description: "指定都市の天気レポートを生成するプロンプト",
    argsSchema: { city: z.string().optional().describe("都市名（省略可）") },
  },
  async ({ city }) => ({
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: city
            ? `${city}の天気情報をもとに、簡潔な天気レポートを作成してください。`
            : "全都市の天気情報をもとに、日本の天気概況レポートを作成してください。",
        },
      },
    ],
  })
);

// --- 起動 ---
const transport = new StdioServerTransport();
await server.connect(transport);
