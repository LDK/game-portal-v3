from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=100, blank=True, null=True)
    public_listing = models.BooleanField(default=False)
    secret_key = models.CharField(max_length=64, blank=True, null=True)
    profile_image = models.URLField(blank=True, null=True)
    over_18 = models.BooleanField(default=False)

    def __str__(self):
        return self.display_name or self.user.username