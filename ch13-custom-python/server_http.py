"""天気情報 MCP サーバー（Streamable HTTP トランスポート版）"""

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather-server")

weather_data: dict[str, dict] = {
    "tokyo": {"temp": 22, "condition": "晴れ", "humidity": 45},
    "osaka": {"temp": 24, "condition": "曇り", "humidity": 55},
    "sapporo": {"temp": 12, "condition": "雨", "humidity": 70},
    "fukuoka": {"temp": 25, "condition": "晴れ", "humidity": 50},
    "naha": {"temp": 28, "condition": "晴れ", "humidity": 65},
}


@mcp.tool()
def get_weather(city: str) -> str:
    """指定した都市の天気情報を取得します。

    Args:
        city: 都市名（例: tokyo, osaka）
    """
    import json

    data = weather_data.get(city.lower())
    if not data:
        available = ", ".join(weather_data.keys())
        raise ValueError(
            f"都市「{city}」が見つかりません。対応都市: {available}"
        )
    return json.dumps({"city": city, **data}, ensure_ascii=False)


@mcp.tool()
def compare_weather(cities: list[str]) -> str:
    """複数都市の天気を比較します。

    Args:
        cities: 比較する都市名のリスト（2つ以上）
    """
    import json

    if len(cities) < 2:
        raise ValueError("2つ以上の都市を指定してください")
    results = []
    for city in cities:
        data = weather_data.get(city.lower())
        if data:
            results.append({"city": city, **data})
        else:
            results.append({"city": city, "error": "データなし"})
    return json.dumps(results, ensure_ascii=False, indent=2)


@mcp.resource("weather://cities")
def get_cities() -> str:
    """対応している都市の一覧を返します。"""
    import json

    return json.dumps(list(weather_data.keys()))


@mcp.prompt()
def weather_report(city: str = "") -> str:
    """天気レポートを生成するプロンプト。"""
    if city:
        return (
            f"{city}の天気情報をもとに、"
            "簡潔な天気レポートを作成してください。"
        )
    return (
        "全都市の天気情報をもとに、"
        "日本の天気概況レポートを作成してください。"
    )


if __name__ == "__main__":
    mcp.run(transport="streamable-http")
