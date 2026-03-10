"""Lifespan パターンのデモ（DB接続管理）"""

import json
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from dataclasses import dataclass

from mcp.server.fastmcp import Context, FastMCP
from mcp.server.session import ServerSession


class Database:
    """デモ用の疑似データベース。"""

    def __init__(self) -> None:
        self._data = {
            "tokyo": {"temp": 22, "condition": "晴れ", "humidity": 45},
            "osaka": {"temp": 24, "condition": "曇り", "humidity": 55},
        }

    @classmethod
    async def connect(cls) -> "Database":
        print("DB接続を確立しました")
        return cls()

    async def disconnect(self) -> None:
        print("DB接続を閉じました")

    def query(self, city: str) -> dict | None:
        return self._data.get(city.lower())


@dataclass
class AppContext:
    """アプリケーションコンテキスト。"""

    db: Database


@asynccontextmanager
async def app_lifespan(server: FastMCP) -> AsyncIterator[AppContext]:
    """サーバーの起動・終了時にDB接続を管理する。"""
    db = await Database.connect()
    try:
        yield AppContext(db=db)
    finally:
        await db.disconnect()


mcp = FastMCP("weather-db-server", lifespan=app_lifespan)


@mcp.tool()
def query_weather(
    city: str,
    ctx: Context[ServerSession, AppContext],
) -> str:
    """DBから天気情報を取得します。

    Args:
        city: 都市名（例: tokyo, osaka）
    """
    db = ctx.request_context.lifespan_context.db
    data = db.query(city)
    if not data:
        raise ValueError(f"都市「{city}」のデータがありません")
    return json.dumps({"city": city, **data}, ensure_ascii=False)


if __name__ == "__main__":
    mcp.run()
