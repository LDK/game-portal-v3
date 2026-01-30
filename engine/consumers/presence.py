# engine/consumers/presence.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
import time

CONNECTED_TTL = 45  # seconds
ACTIVE_TTL = 30     # seconds
URL_TTL = 60 * 10   # keep last url around for 10 min (optional)

def conn_key(user_id: str) -> str:
    return f"presence:conn:{user_id}"

def active_key(user_id: str) -> str:
    return f"presence:active:{user_id}"

def url_key(user_id: str) -> str:
    return f"presence:url:{user_id}"

def last_key(user_id: str) -> str:
    return f"presence:last:{user_id}"  # last heartbeat timestamp

class PresenceConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close(code=4401)
            return

        self.user_id = str(user.id)
        await self.accept()

        await self._setex(conn_key(self.user_id), CONNECTED_TTL, "1")
        await self._setex(last_key(self.user_id), URL_TTL, str(int(time.time())))

    async def disconnect(self, code):
        # I’d actually recommend NOT deleting, and letting TTL do cleanup,
        # but keeping your behavior for now:
        if hasattr(self, "user_id"):
            await self._delete(conn_key(self.user_id))
            await self._delete(active_key(self.user_id))
            await self._delete(url_key(self.user_id))
            await self._delete(last_key(self.user_id))

    async def receive_json(self, content, **kwargs):
        t = content.get("type")

        if t == "heartbeat":
            url = content.get("url")
            print("heartbeat received", url)
            await self._setex(conn_key(self.user_id), CONNECTED_TTL, "1")
            await self._setex(last_key(self.user_id), URL_TTL, str(int(time.time())))

            if isinstance(url, str) and url:
                # store last url (with TTL so it doesn't linger forever)
                await self._setex(url_key(self.user_id), URL_TTL, url[:500])

            await self.send_json({"type": "heartbeat_ack"})
            return

        if t == "active":
            url = content.get("url")
            await self._setex(conn_key(self.user_id), CONNECTED_TTL, "1")
            await self._setex(active_key(self.user_id), ACTIVE_TTL, "1")
            await self._setex(last_key(self.user_id), URL_TTL, str(int(time.time())))

            if isinstance(url, str) and url:
                await self._setex(url_key(self.user_id), URL_TTL, url[:500])

            return

    @database_sync_to_async
    def _setex(self, key: str, ttl: int, value: str):
        import redis
        r = redis.Redis(host="localhost", port=6379, db=0)
        r.setex(key, ttl, value)

    @database_sync_to_async
    def _delete(self, key: str):
        import redis
        r = redis.Redis(host="localhost", port=6379, db=0)
        r.delete(key)
