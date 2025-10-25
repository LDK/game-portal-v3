"""
URL router for games within Rainy Days Game Portal.
"""
from django.urls import include, path

urlpatterns = [
	path("ohno/", include("engine.games.ohno.urls")),
]
