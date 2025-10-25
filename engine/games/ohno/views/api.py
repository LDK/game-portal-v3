from engine.models.game import Game, Title, GamePlayer, GameLog
from engine.models.user import UserProfile
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from ..serializers import GameSerializer
from django.utils import timezone

class CreateNewGame(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, *args, **kwargs):
		# Look up the game title
		title = Title.objects.filter(slug="ohno").first()

		if not title:
			return Response(
				{"error": "Game title 'ohno' not found."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		# Validate or default input fields
		max_players = int(request.data.get("max_players", 4))
		password = request.data.get("password") or None
		invite_only = bool(request.data.get('invite_only', False))

		# Ensure a matching UserProfile exists
		try:
			starter = UserProfile.objects.get(user=request.user)
		except UserProfile.DoesNotExist:
			return Response(
				{"error": "User profile not found."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		# Create the new game
		game = Game.objects.create(
			starter=starter,
			max_players=max_players,
			title=title,
			invite_only=invite_only,
			password=password
		)

		# Create the GamePlayer for the starter
		game_player = GamePlayer.objects.create(
			game=game,
			user=starter,
			starter=True,
		)

		# Log the game creation
		GameLog.objects.create(
			game=game,
			action="new_game",
			player=game_player
		)

		serializer = GameSerializer(game)
		return Response(serializer.data, status=status.HTTP_201_CREATED)

class StartGame(APIView):
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

		# Check if the requester is the starter
		if game.starter.user != request.user:
			return Response(
				{"error": "Only the game starter can start the game."},
				status=status.HTTP_403_FORBIDDEN,
			)

		# Start the game
		game.started_at = timezone.now()
		game.save()

		# Log the game start
		GameLog.objects.create(
			game=game,
			action="game_started"
		)

		serializer = GameSerializer(game)
		return Response(serializer.data, status=status.HTTP_200_OK)