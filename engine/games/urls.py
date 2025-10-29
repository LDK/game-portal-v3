"""
URL router for games within Rainy Days Game Portal.
"""
from django.urls import include, path
from engine.games import views

urlpatterns = [
	path("ohno/", include("engine.games.ohno.urls")),
	path("game/<str:game_id>/chat/", views.GameChat.as_view(), name="game_chat"),
]
