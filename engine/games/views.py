from rest_framework.response import Response
from rest_framework import permissions, status, views
from engine.games.ohno.serializers import GameLogSerializer
from engine.models.game import Game, GamePlayer, GameLog
from engine.models.user import UserProfile

class GameChat(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, game_id, *args, **kwargs):
        # Look up the game
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response(
                {"error": "Game not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            profile = UserProfile.objects.get(user=request.user)
            print("User", request.user)
            print("profile", profile)
            player = GamePlayer.objects.get(game=game, user=profile)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except GamePlayer.DoesNotExist:
            return Response(
                {"error": "You are not a player in this game."},
                status=status.HTTP_403_FORBIDDEN,
            )

        message = request.data.get("message", "").strip()
        if not message:
            return Response(
                {"error": "Message cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        print("Message:", message)

        # Create the chat message
        GameLog.objects.create(
            game=game,
            specifics={"message": message},
            player=player,
            action="chat",
        )

        game_logs = GameLog.objects.filter(game=game).order_by("timestamp")
        serializer = GameLogSerializer(game_logs, many=True)

        return Response(serializer.data, status=status.HTTP_201_CREATED)