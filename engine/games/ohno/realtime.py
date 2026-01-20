# engine/realtime.py
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from engine.games.ohno.logic import get_game_state
from engine.games.ohno.serializers import GameLogSerializer
from engine.models.game import Game, GameLog, GamePlayer

def broadcast_game_state(game: Game, player: GamePlayer = None):
    channel_layer = get_channel_layer()

    log_serializer = GameLogSerializer(
        GameLog.objects.filter(game=game).order_by("id"),
        many=True
    )

    public_group_name = f"game_{game.id}"
    public_game_state = get_game_state(game, None)

    if player:
        player_game_state = get_game_state(game, player.user if player else None)
        player_group_name = f"game_{game.id}_player_{player.id}"

        print("Player group:", player_group_name)

        async_to_sync(channel_layer.group_send)(
            player_group_name,
            {
                "type": "game_update_player",
                "data": {
                    "game": player_game_state,
                    "log": log_serializer.data,
                },
            },
        )

        print("Sending to public group", public_group_name)
        
        async_to_sync(channel_layer.group_send)(
            public_group_name,
            {
                "type": "game_update_public",
                "data": {
                    "game": public_game_state,
                    "log": log_serializer.data,
                },
            },
        )
    else:
        async_to_sync(channel_layer.group_send)(
            public_group_name,
            {
                "type": "game_update_public",
                "data": {
                    "game": public_game_state,
                    "log": log_serializer.data,
                },
            },
        )

def broadcast_game_player_states(game: Game):
    for player in game.players.all():
        if player.is_human:
            broadcast_game_state(game, player)
