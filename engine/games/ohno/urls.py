"""
URL configuration for "Oh No!" title within Rainy Days Game Portal.
"""
from django.urls import path
from .views import page as page_views, api as api_views

urlpatterns = [
	path("", page_views.index, name="index"),
    path("new/", api_views.CreateNewGame.as_view(), name="create_game"),
    path("leaderboard/", page_views.leaderboard_view, name="leaderboard"),
    path("game/<str:game_id>/", page_views.game_view, name="game_detail"),
    path("game/<str:game_id>/info/", api_views.GameInfo.as_view(), name="game_info"),
    path("game/<str:game_id>/start/", api_views.StartGame.as_view(), name="start_game"),
    path("game/<str:game_id>/add-cpu-player/", api_views.AddCpuPlayer.as_view(), name="add_cpu_player"),
    path("game/<str:game_id>/wild/", api_views.WildCard.as_view(), name="wild_card"),
    path("games/me/", api_views.UserGames.as_view(), name="user_games"),
    path("games/me/<int:limit>/", api_views.UserGames.as_view(), name="user_games"),
]
