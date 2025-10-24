from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods
from engine.forms.profiles import UserProfileForm, UserProfileImageForm
from django.contrib.auth.models import User
from django.contrib.auth import logout
from engine.models.user import UserProfile

def index(request):
	user = request.user if request.user.is_authenticated else None
	profile = UserProfile.objects.get(user=user) if user else None
	context = {
		"username": user.username if user else None,
		"profile": profile,
	}
	return render(request, "index.html", context)

def components(request):
	user = request.user if request.user.is_authenticated else None
	profile = UserProfile.objects.get(user=user) if user else None
	context = {
		"username": user.username,
		"profile": profile,
		"page": "components"
	}
	return render(request, "index.html", context)

def generate_user_secret_key(length=64):
	import secrets
	import string
	"""Generates a random, secure secret key for a user."""
	characters = string.ascii_letters + string.digits + string.punctuation
	return ''.join(secrets.choice(characters) for _ in range(length))

@require_http_methods(["POST"])
def upload_profile_image(request):
	if not request.user.is_authenticated:
		return redirect("login_or_register")

	form = UserProfileImageForm(request.POST, request.FILES)
	if form.is_valid():
		print("Form is valid:", form.cleaned_data)
		profile = UserProfile.objects.get(user=request.user)
		profile.profile_image = form.cleaned_data.get('profile_image')
		profile.save()
	else:
		print("Form errors:", form.errors)
	return redirect("settings")

@require_http_methods(["POST"])
def register(request):
	form = UserProfileForm(request.POST)
	if form.is_valid():
		email = form.cleaned_data.get('email')
		first_name = form.cleaned_data.get('first_name')
		last_name = form.cleaned_data.get('last_name')
		password = form.cleaned_data.get('password')
		display_name = form.cleaned_data.get('display_name')

		user = User.objects.create_user(
			username=display_name,
			email=email,
			first_name=first_name,
			last_name=last_name,
			password=password
		)

		user_profile = form.save(commit=False)
		user_profile.user = user
		user_profile.secret_key = generate_user_secret_key()
		user_profile.save()
		return redirect("index")
	else:
		return redirect("login_or_register")

def logout_view(request):
	logout(request)
	return redirect("index")

def profile(request):
	user = request.user if request.user.is_authenticated else None
	profile = UserProfile.objects.get(user=user) if user else None
	context = {
			"username": user.username if user else "guest",
			"profile": profile,
			"page": "profile",
	}
	return render(request, "index.html", context)

def login_or_register(request):
	csrfToken = request.META.get("CSRF_COOKIE", "")
	return render(request, "login-or-register.html", {"csrfToken": csrfToken})

def settings(request):
	user = request.user if request.user.is_authenticated else None
	profile = UserProfile.objects.get(user=user) if user else None
	csrfToken = request.META.get("CSRF_COOKIE", "")
	context = {
		"username": user.username if user else "guest",
		"profile": profile,
		"page": "settings",
		"csrfToken": csrfToken,
	}
	return render(request, "index.html", context)
