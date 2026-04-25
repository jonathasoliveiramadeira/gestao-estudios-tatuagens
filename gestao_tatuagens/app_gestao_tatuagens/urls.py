from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServicoViewSet,
    AgendamentoViewSet,
    AvaliacaoViewSet,
    ClienteViewSet,
    TatuadorViewSet,
    UsuarioViewSet,
    usuario_logado,
)

router = DefaultRouter()
router.register(r'servicos', ServicoViewSet)
router.register(r'agendamentos', AgendamentoViewSet)
router.register(r'avaliacoes', AvaliacaoViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'tatuadores', TatuadorViewSet)
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('usuario/', usuario_logado),
]
