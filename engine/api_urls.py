from django.urls import path
from .api_views import UserProfileListView, UploadProfileImageView, UserProfileDetailView, UserProfileView, MyProfileView

urlpatterns = [
    path("userprofiles/", UserProfileListView.as_view(), name="userprofile-list"),
    path("upload-profile-image/", UploadProfileImageView.as_view(), name="upload-profile-image"),
    path("userprofiles/me/", MyProfileView.as_view(), name="userprofile-me"),
    path("userprofiles/<str:user__username>/", UserProfileDetailView.as_view(), name="userprofile-detail"),
]
