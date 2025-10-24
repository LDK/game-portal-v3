from rest_framework import generics
from .models.user import UserProfile
from .serializers import UserProfileSerializer
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

        serializer = UserProfileSerializer(profile)
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
