from django.db import models
from django.contrib.auth.models import User

from engine.models.game import GamePlayer, Title

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

    @property
    def most_played_titles(self) -> dict:
        gps = GamePlayer.objects.filter(user=self)
        title_count = {}
        from engine.serializers import TitleSerializer

        for gp in gps:
            title = TitleSerializer(gp.game.title).data
            title_id = gp.game.title.id
            if title_id in title_count:
                title_count[title_id] += 1
            else:
                title_count[title_id] = 1
        sorted_titles = sorted(title_count.items(), key=lambda x: x[1], reverse=True)
        return {str(title_id): { 'count': count, 'title': TitleSerializer(Title.objects.get(id=title_id)).data } for title_id, count in sorted_titles}

    def __str__(self):
        return self.display_name or self.user.username