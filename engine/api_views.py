from rest_framework import generics

from engine.models.game import Title
from engine.models.user import UserProfile
from .models.user import UserProfile
from .serializers import UserProfileSerializer, UserProfileSerializerFull
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

class UserProfileListView(generics.ListAPIView):
    queryset = UserProfile.objects.filter(public_listing=True)
    serializer_class = UserProfileSerializer

class UserProfileView(generics.RetrieveAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class MyProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializerFull(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserProfileDetailView(generics.RetrieveAPIView):
    queryset = UserProfile.objects.select_related("user")
    serializer_class = UserProfileSerializer
    lookup_field = "user__username"  # allow lookup by username
    permission_classes = [permissions.AllowAny]  # or IsAuthenticated if private
    
class UploadProfileImageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        image_url = request.data.get("image_url")
        if not image_url:
            return Response({"error": "Missing image_url"}, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.profile_image = image_url
        profile.save()

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ClearProfileImageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.profile_image = ""
        profile.save()

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SaveAccountSettingsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        display_name = request.data.get("display_name")
        public_listing = request.data.get("public_listing")
        over_18 = request.data.get("over_18")

        if display_name is not None:
            profile.display_name = display_name

        if public_listing is not None:
            profile.public_listing = public_listing
        else:
            profile.public_listing = False

        if over_18 is not None:
            profile.over_18 = over_18
        else:
            profile.over_18 = False

        profile.save()

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SaveAccountInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        display_name = request.data.get("display_name")

        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name

        user.save()

        if display_name is not None:
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.display_name = display_name
            profile.save()

        return Response({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "display_name": profile.display_name if profile else None
        }, status=status.HTTP_200_OK)

class SystemStatsView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, *args, **kwargs):
        from .serializers import TitleSerializer

        system_stats = {}
        system_stats['total_users'] = UserProfile.objects.count()
        system_stats['most_played_titles'] = Title.objects.order_by('-games_played')[:5]
        system_stats['newest_titles'] = Title.objects.order_by('-id')[:5]

        serialized_most_played = TitleSerializer(system_stats['most_played_titles'], many=True).data
        serialized_newest = TitleSerializer(system_stats['newest_titles'], many=True).data

        return Response({
            "total_users": system_stats['total_users'],
            "most_played_titles": serialized_most_played,
            "newest_titles": serialized_newest
        }, status=status.HTTP_200_OK)
