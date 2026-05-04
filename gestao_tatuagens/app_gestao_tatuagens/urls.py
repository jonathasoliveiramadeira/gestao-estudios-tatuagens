from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    ServicoViewSet,
    AgendamentoViewSet,
    AvaliacaoViewSet,
    ClienteViewSet,
    TatuadorViewSet,
    UsuarioViewSet,
    atualizar_usuario,
    deletar_usuario,
    usuario_logado,
    logout_view,
    login_view,
    csrf,
    PortfolioViewSet,
)

router = DefaultRouter()
router.register(r'servicos', ServicoViewSet)
router.register(r'agendamentos', AgendamentoViewSet)
router.register(r'avaliacoes', AvaliacaoViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'tatuadores', TatuadorViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'portfolios', PortfolioViewSet)

urlpatterns = [
    # ROTAS AUTOMÁTICAS (CRUD)
    path('', include(router.urls)),

    # JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # AUTH
    path('csrf/', csrf),
    path('login/', login_view),
    path('logout/', logout_view),

    # USUÁRIO LOGADO
    path('me/', usuario_logado),

    # USUÁRIO (EDIÇÃO / DELETE)
    path('usuario/', atualizar_usuario),
    path('usuario/delete/', deletar_usuario),
]