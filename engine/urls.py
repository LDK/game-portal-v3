"""
URL configuration for gameportal project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib.auth import views as auth_views
from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="index"),
    path("account-login/", auth_views.LoginView.as_view(template_name="login-or-register.html"), name="login"),
    path("register/", views.register, name="register"),
    path("login/", views.login_or_register, name="login_or_register"),
    path("logout/", views.logout_view, name="logout"),
    path("components/", views.components, name="components"),
    path("accounts/profile/", views.profile, name="profile"),
    path("settings/", views.settings, name="settings"),
    path("api/", include("engine.api_urls")),
    path("", include("engine.games.urls")),
]
