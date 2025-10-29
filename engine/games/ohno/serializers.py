from rest_framework import serializers
from engine.models.user import UserProfile
from engine.models.game import Game, GameLog, Title, GamePlayer

class GameSerializer(serializers.ModelSerializer):
	title = serializers.CharField(source='title.slug', read_only=True)
	starter = serializers.CharField(source='starter.display_name', read_only=True)
	players = serializers.SerializerMethodField()

	class Meta:
		model = Game
		depth = 1
		fields = ['id', 'title', 'starter', 'created_at', 'updated_at', 'started_at', 'cancelled_at', 'ended_at', 'settings', 'round', 'reverse_order', 'current_slot', 'max_players', 'invite_only', 'password', 'players']
		read_only_fields = ['id', 'created_at', 'updated_at']
	
	def get_players(self, obj):
		players = obj.players.order_by('play_order')
		return [{
			'user_id': player.user.id if player.user else None,
			'name': player.user.display_name if player.is_human else player.cpu_name,
			'is_human': player.is_human,
			'play_order': player.play_order,
			'score': player.score,
			'win': player.win,
			'loss': player.loss,
		} for player in players]

class GameLogSerializer(serializers.ModelSerializer):
	player = serializers.CharField(source='player.user.display_name', read_only=True)
	cpu_name = serializers.CharField(source='player.cpu_name', read_only=True)

	class Meta:
		model = GameLog
		fields = ['id', 'game', 'action', 'player', 'timestamp', 'specifics', 'cpu_name']
		read_only_fields = ['id', 'game', 'action', 'player', 'timestamp', 'cpu_name']
