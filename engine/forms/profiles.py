from django import forms
from ..models import UserProfile

class UserProfileForm(forms.ModelForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)

    class Meta:
        model = UserProfile
        fields = ['display_name', 'email', 'first_name', 'last_name', 'password']

class UserProfileImageForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['profile_image']