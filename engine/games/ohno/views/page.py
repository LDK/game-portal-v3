from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.contrib.auth import logout
from engine.models.game import Title
from engine.models.user import UserProfile
from engine.views import profile

def index(request):
    user = request.user if request.user.is_authenticated else None
    profile = UserProfile.objects.get(user=user) if user else None
    title = Title.objects.filter(slug="ohno").first()

    context = {
        "username": user.username if user else None,
        "profile": profile,
        "title": title,
        "csrfToken": request.COOKIES.get('csrftoken'),
        "section": "index",
    }
    return render(request, "game.html", context)

def game_view(request, game_id):
    user = request.user if request.user.is_authenticated else None
    profile = UserProfile.objects.get(user=user) if user else None
    title = Title.objects.filter(slug="ohno").first()

    context = {
        "username": user.username if user else None,
        "profile": profile,
        "title": title,
        "csrfToken": request.COOKIES.get('csrftoken'),
        "game_id": game_id,
        "section": "game",
    }
    return render(request, "game.html", context)

def leaderboard_view(request):
    user = request.user if request.user.is_authenticated else None
    profile = UserProfile.objects.get(user=user) if user else None
    title = Title.objects.filter(slug="ohno").first()

    context = {
        "username": user.username if user else None,
        "profile": profile,
        "title": title,
        "section": "leaderboard",
        "subtitle": "Leaderboard",
    }
    return render(request, "game.html", context)
