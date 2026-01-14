from django.db import models

class Title(models.Model):
	name = models.CharField(max_length=200)
	slug = models.SlugField(unique=True)
	description = models.TextField(blank=True, null=True)
	release_date = models.DateField(blank=True, null=True)
	developer = models.CharField(max_length=200, blank=True, null=True)
	cover_image = models.URLField(blank=True, null=True)
	category = models.CharField(max_length=100, blank=True, null=True)
	games_played = models.IntegerField(default=0)

	@property
	def open_games(self):
		return Game.objects.filter(title=self, ended_at__isnull=True, cancelled_at__isnull=True, invite_only=False, password__isnull=True)

	def __str__(self):
		return self.name

class Game(models.Model):
	title = models.ForeignKey(Title, on_delete=models.CASCADE)
	starter = models.ForeignKey('UserProfile', on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	started_at = models.DateTimeField(blank=True, null=True)
	cancelled_at = models.DateTimeField(blank=True, null=True)
	ended_at = models.DateTimeField(blank=True, null=True)
	settings = models.JSONField(default=dict, blank=True)
	round = models.IntegerField(default=0)
	reverse_order = models.BooleanField(default=False)
	turn_order = models.IntegerField(default=0)
	max_players = models.IntegerField(default=4)
	invite_only = models.BooleanField(default=False)
	password = models.CharField(max_length=100, blank=True, null=True)
	specifics = models.JSONField(default=dict, blank=True)

	@property
	def players(self):
		return GamePlayer.objects.filter(game=self, is_active=True)
	
	@property
	def current_player(self):
		return GamePlayer.objects.filter(game=self, is_active=True, play_order=self.turn_order).first()
	
	@property
	def leaderboard(self):
		return GamePlayer.objects.filter(game=self).order_by('-score')

	@property
	def winners(self):
		return GamePlayer.objects.filter(game=self, win=True)
	
	@property
	def next_slot(self):
		total_players = self.players.count()
		print("Initial turn order:", self.turn_order)
		print("Reverse order:", self.reverse_order)
		print("Total players:", total_players)
		if self.reverse_order:
			if self.turn_order == 1:
				return total_players
			else:
				return self.turn_order - 1
		else:
			if self.turn_order == total_players:
				return 1
			else:
				return self.turn_order + 1

	@property
	def next_player(self):
		return GamePlayer.objects.filter(game=self, is_active=True, play_order=self.next_slot).first()

class GamePlayer(models.Model):
	game = models.ForeignKey('Game', on_delete=models.CASCADE, related_name='players')
	user = models.ForeignKey('UserProfile', on_delete=models.CASCADE, blank=True, null=True)
	is_human = models.BooleanField(default=True)
	cpu_name = models.CharField(max_length=100, blank=True, null=True)
	is_active = models.BooleanField(default=True)
	play_order = models.IntegerField(default=0)
	score = models.IntegerField(default=0)
	win = models.BooleanField(default=False)
	loss = models.BooleanField(default=False)
	joined_at = models.DateTimeField(auto_now_add=True)
	starter = models.BooleanField(default=False)
	specifics = models.JSONField(default=dict, blank=True)
	last_play = models.DateTimeField(blank=True, null=True)

	@property
	def name(self):
		if self.is_human and self.user:
			return self.user.display_name
		else:
			return self.cpu_name or "CPU"
	
	@property
	def hand(self):
		if not self.specifics:
			self.specifics = {}
		self.specifics.setdefault('cards', [])
		return self.specifics['cards']

	@hand.setter
	def hand(self, value):
		if not self.specifics:
			self.specifics = {}
		self.specifics['cards'] = value

class GameLog(models.Model):
	game = models.ForeignKey('Game', on_delete=models.CASCADE)
	player = models.ForeignKey('GamePlayer', on_delete=models.CASCADE, blank=True, null=True)
	action = models.CharField(max_length=200)
	timestamp = models.DateTimeField(auto_now_add=True)
	specifics = models.JSONField(default=dict, blank=True)

