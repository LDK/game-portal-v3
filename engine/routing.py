# engine/routing.py
from django.urls import path
from .consumers.game import GameConsumer, GamePlayerConsumer
from .consumers.presence import PresenceConsumer

websocket_urlpatterns = [
    path("ws/game/<int:game_id>/", GameConsumer.as_asgi()),
    path("ws/game/<int:game_id>/player/<int:player_id>/", GamePlayerConsumer.as_asgi()),
    path("ws/presence/", PresenceConsumer.as_asgi()),
]
