from django import forms
from ..models import UserProfile

class UserProfileForm(forms.ModelForm):
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)

    class Meta:
        model = UserProfile
        fields = ['display_name', 'first_name', 'last_name', 'public_listing', 'over_18']

class UserProfileImageForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['profile_image']