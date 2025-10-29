from django.db import models
from django.contrib.auth.models import User

from engine.models.game import GamePlayer

class UserProfile(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True, related_name='profile')
    display_name = models.CharField(max_length=100, blank=True, null=True)
    public_listing = models.BooleanField(default=False)
    secret_key = models.CharField(max_length=64, blank=True, null=True)
    profile_image = models.URLField(blank=True, null=True)
    over_18 = models.BooleanField(default=False)

    @property
    def ongoing_games(self):
        gps = GamePlayer.objects.filter(user=self, game__ended_at__isnull=True, is_active=True)
        games = [gp.game for gp in gps]
        return games

    def __str__(self):
        return self.display_name or self.user.username