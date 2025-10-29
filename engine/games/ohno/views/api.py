from engine.games.ohno.cards import init_cards, init_deck
from engine.games.ohno.logic import deal_cards
from engine.games.util import get_cpu_name
from engine.models.game import Game, Title, GamePlayer, GameLog
from engine.games.ohno.serializers import GameSerializer
from engine.models.user import UserProfile
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
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
			turn_order = 1
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

		user_gp = GamePlayer.objects.filter(game=game, user=game.starter).first()

		# Log the game start
		GameLog.objects.create(
			game=game,
			action="game_started",
			player=user_gp
		)

		deck, discard_pile, current_card = init_cards(game, user_gp)
		players = game.players.all().order_by('play_order')
		deck, players = deal_cards(deck, players)

		game.specifics['deck'] = deck
		game.specifics['discard_pile'] = discard_pile
		game.specifics['current_card'] = current_card
		game.save()

		serializer = GameSerializer(game)
		return Response(serializer.data, status=status.HTTP_200_OK)
	
class GameInfo(APIView):
	permission_classes = [permissions.AllowAny]

	def get(self, request, game_id, *args, **kwargs):
		# Look up the game
		try:
			game = Game.objects.get(id=game_id)
			from engine.games.ohno.logic import get_game_state
			user_profile = UserProfile.objects.get(user=request.user)
			game_state = get_game_state(game, user_profile)
			return Response(game_state, status=status.HTTP_200_OK)
		except Game.DoesNotExist:
			return Response(
				{"error": "Game not found."},
				status=status.HTTP_404_NOT_FOUND,
			)

class AddCpuPlayer(APIView):
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
				{"error": "Only the game starter can add CPU players."},
				status=status.HTTP_403_FORBIDDEN,
			)

		# Determine the next play order
		next_play_order = game.players.count() + 1

		# Get a list of display names already in the game (to be excluded)
		existing_display_names = list()
		for player in game.players.all():
			if player.user is not None:
				existing_display_names.append(player.user.display_name)

		# Create the CPU player
		cpu_player = GamePlayer.objects.create(
			game=game,
			is_human=False,
			cpu_name=get_cpu_name(existing_display_names),
			play_order=next_play_order
		 )

		# Log the addition of the CPU player
		GameLog.objects.create(
			game=game,
			action="add_cpu_player",
			player=cpu_player
		)

		serializer = GameSerializer(game)
		return Response(serializer.data, status=status.HTTP_200_OK)

class UserGames(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request, limit=None, *args, **kwargs):
		# Ensure a matching UserProfile exists
		try:
			user_profile = UserProfile.objects.get(user=request.user)
		except UserProfile.DoesNotExist:
			return Response(
				{"error": "User profile not found."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		# Fetch the user's ongoing games
		gps = GamePlayer.objects.filter(user=user_profile, game__ended_at__isnull=True, is_active=True)
		games = [gp.game for gp in gps]
		game_count = len(games)

		if limit is not None:
			games = games[:limit]

		serializer = GameSerializer(games, many=True)

		return_value = {
			'count': game_count,
			'games': serializer.data
		}
		return Response(return_value, status=status.HTTP_200_OK)
