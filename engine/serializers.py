from rest_framework import serializers
from .models.user import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'display_name', 'profile_image', 'public_listing', 'over_18']
        read_only_fields = ['user']

class UserProfileSerializerFull(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'display_name', 'profile_image', 'public_listing', 'over_18', 'email', 'first_name', 'last_name']
        read_only_fields = ['user']
