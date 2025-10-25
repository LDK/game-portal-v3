"""
URL configuration for "Oh No!" title within Rainy Days Game Portal.
"""
from django.urls import path
from .views import page as page_views, api as api_views

urlpatterns = [
	path("", page_views.index, name="index"),
    path("leaderboard/", page_views.leaderboard_view, name="leaderboard"),
    path("game/<str:game_id>/", page_views.game_view, name="game_detail"),
]
