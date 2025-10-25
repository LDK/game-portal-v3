from rest_framework import serializers
from engine.models.user import UserProfile
from engine.models.game import Game, Title, GamePlayer

class GameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ['id', 'title', 'starter', 'created_at', 'updated_at', 'started_at', 'cancelled_at', 'ended_at', 'settings', 'round', 'reverse_order', 'current_slot', 'max_players', 'invite_only', 'password', 'players']
		read_only_fields = ['id', 'created_at', 'updated_at']