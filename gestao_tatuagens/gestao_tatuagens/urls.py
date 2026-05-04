"""
URL configuration for gestao_tatuagens project.

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
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Views personalizadas
from app_gestao_tatuagens.views import (
    usuario_logado,
    login_view,
    logout_view,
    atualizar_usuario,
    deletar_usuario,
    google_login_success,
)

# IMPORTANTE (imagens/media)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Rotas da sua app
    path('api/', include('app_gestao_tatuagens.urls')),

    # Auth (Google / Allauth)
    path('accounts/', include('allauth.urls')),

    # Reset de senha
    path('api/password_reset/', include('django_rest_passwordreset.urls')),

    # Usuário logado
    path('api/me/', usuario_logado),

    # Login e login google
    path('api/login/', login_view),
    path("google-success/", google_login_success),

    # Logout
    path('api/logout/', logout_view),

    # Atualizar usuário (foto + tipo)
    path('api/atualizar_usuario/', atualizar_usuario),

    # Deletar conta
    path('api/deletar_usuario/', deletar_usuario),

    # JWT
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]

# SERVIR IMAGENS (ESSENCIAL PRA FOTO FUNCIONAR)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)