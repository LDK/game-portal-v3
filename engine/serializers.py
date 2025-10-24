from rest_framework import serializers
from .models.user import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'display_name', 'profile_image']
        read_only_fields = ['user']
