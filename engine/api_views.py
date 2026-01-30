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

from django.contrib.auth import get_user_model

User = get_user_model()

class WhosOnline(APIView):
    permission_classes = []

    def get(self, request):
        import redis
        r = redis.Redis(host="localhost", port=6379, db=0)

        # Get all connected users by scanning conn keys
        # For small dev loads, KEYS is ok. For bigger, use scan_iter.
        conn_ids = []
        for key in r.scan_iter("presence:conn:*"):
            # key is bytes like b'presence:conn:42'
            uid = key.decode().split(":")[-1]
            conn_ids.append(int(uid))

        active_ids = set()
        for key in r.scan_iter("presence:active:*"):
            uid = key.decode().split(":")[-1]
            active_ids.add(int(uid))

        users = User.objects.filter(id__in=conn_ids).values("id", "username")

        # out stores the final output
        out = []
        
        # pipe (pipeline) for fetching last URLs
        pipe = r.pipeline()

        for u in users:
            status = "active" if u["id"] in active_ids else "idle"
            profile = UserProfile.objects.filter(user_id=u["id"]).first()
            presence_key = f"presence:url:{u['id']}"
            pipe.get(presence_key)

            if profile and profile.public_listing:
                display = profile.display_name or u["username"]
                out.append({"display": display, "status": status})
            else:
                out.append({"username": "Anonymous", "display": "Anonymous", "status": status})

        urls = pipe.execute()

        if urls and out:
            for i in range(len(out)):
                out[i]["last_url"] = urls[i].decode() if urls[i] else ""

        # sort: active first, then idle; current user first within each
        def sort_key(u):
            status_rank = 0 if u["status"] == "active" else 1
            return (status_rank, u["display"].lower())

        out.sort(key=sort_key)
        return Response({"online": out})
