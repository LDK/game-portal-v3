# engine/consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.group_name = f"game_{self.game_id}"

        # Join group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        # For now, maybe you don't need client->server messages, just pass
        pass

    async def game_update_public(self, event):
        # Called when we send group message
        await self.send_json(event["data"])

class GamePlayerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if not user.is_authenticated:
            await self.close()
            return

        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.player_id = self.scope["url_route"]["kwargs"]["player_id"]
        self.group_name = f"game_{self.game_id}_player_{self.player_id}"
        print("group name", self.group_name)

        # Join group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def game_update_public(self, event):
        print(22)
        # Called when we send group message
        await self.send_json(event["data"])

    async def game_update_player(self, event):
        # Called when we send group message
        await self.send_json(event["data"])