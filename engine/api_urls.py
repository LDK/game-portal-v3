from django.urls import path
from .api_views import ClearProfileImageView, SaveAccountInfoView, SaveAccountSettingsView, UserProfileListView, UploadProfileImageView, UserProfileDetailView, UserProfileView, MyProfileView

urlpatterns = [
    path("userprofiles/", UserProfileListView.as_view(), name="userprofile-list"),
    path("upload-profile-image/", UploadProfileImageView.as_view(), name="upload-profile-image"),
    path("clear-profile-image/", ClearProfileImageView.as_view(), name="clear-profile-image"),
    path("userprofiles/me/", MyProfileView.as_view(), name="userprofile-me"),
    path("userprofiles/<str:user__username>/", UserProfileDetailView.as_view(), name="userprofile-detail"),
    path("account/settings/", SaveAccountSettingsView.as_view(), name="userprofile-settings"),
    path("account/info/", SaveAccountInfoView.as_view(), name="userprofile-info"),
]
