from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import redirect

from .models.servico import Servico
from .serializers import ServicoSerializer

from .models.agendamento import Agendamento
from .serializers import AgendamentoSerializer

from .models.avaliacao import Avaliacao
from .serializers import AvaliacaoSerializer

from .models.tatuador import Tatuador
from .serializers import TatuadorSerializer

from .models.cliente import Cliente
from .serializers import ClienteSerializer

from .models.usuario import Usuario
from .serializers import UsuarioSerializer

from .models.portfolio import Portfolio
from .serializers import PortfolioSerializer
from .permissions import IsTatuador

# ==========================================
# SERVIÇOS
# ==========================================
class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        tatuador_id = self.request.query_params.get('tatuador')
        if tatuador_id:
            return Servico.objects.filter(tatuador_id=tatuador_id)
        return super().get_queryset()


# ==========================================
# AGENDAMENTOS
# ==========================================
class AgendamentoViewSet(viewsets.ModelViewSet):
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        cliente_id = self.request.query_params.get('cliente')
        tatuador_id = self.request.query_params.get('tatuador')

        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)

        if tatuador_id:
            queryset = queryset.filter(tatuador_id=tatuador_id)

        return queryset


# ==========================================
# AVALIAÇÕES
# ==========================================
class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        tatuador_id = self.request.query_params.get('tatuador')
        if tatuador_id:
            return Avaliacao.objects.filter(tatuador_id=tatuador_id)
        return super().get_queryset()


# ==========================================
# CLIENTE
# ==========================================
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [permissions.IsAuthenticated]


# ==========================================
# TATUADOR
# ==========================================
class TatuadorViewSet(viewsets.ModelViewSet):
    queryset = Tatuador.objects.all()
    serializer_class = TatuadorSerializer
    permission_classes = [permissions.AllowAny]


# ==========================================
# USUÁRIO
# ==========================================
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]


# ==========================================
# USUÁRIO LOGADO (/api/me/)
# ==========================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usuario_logado(request):
    return Response({
        "id": request.user.id,
        "email": request.user.email,
        "tipo_usuario": request.user.tipo_usuario,
        "is_staff": request.user.is_staff,
        "foto": request.build_absolute_uri(request.user.foto.url) if request.user.foto else None
    })


# ==========================================
# LOGIN
# ==========================================
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(request, email=email, password=password)

    if user is not None:
        # GERAR TOKEN JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "tipo_usuario": user.tipo_usuario,
                "foto": request.build_absolute_uri(user.foto.url) if user.foto else None
            }
        })

    return Response({"error": "Credenciais inválidas"}, status=400)

# ==========================================
# LOGOUT (CORRIGIDO)
# ==========================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    # logout(request)
    return Response({"message": "Logout realizado com sucesso"})


# ==========================================
# ATUALIZAR USUÁRIO
# ==========================================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def atualizar_usuario(request):
    user = request.user

    user.tipo_usuario = request.data.get("tipo_usuario", user.tipo_usuario)

    if 'foto' in request.FILES:
        user.foto = request.FILES['foto']

    user.save()

    return Response({
        "email": user.email,
        "tipo_usuario": user.tipo_usuario,
        "foto": request.build_absolute_uri(user.foto.url) if user.foto else None
    })


# ==========================================
# DELETAR USUÁRIO
# ==========================================
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deletar_usuario(request):
    request.user.delete()
    return Response({"message": "Conta deletada"})


# ==========================================
# CSRF (ESSENCIAL PRO LOGIN)
# ==========================================
@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"message": "CSRF cookie set"})

# ==========================================
# PORTFOLIO
# ==========================================
class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all().order_by("-criado_em")
    serializer_class = PortfolioSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAuthenticated(), IsTatuador()]
        return [AllowAny()]

    def get_queryset(self):
        queryset = super().get_queryset()

        tatuador_id = self.request.query_params.get('tatuador')
        destaque = self.request.query_params.get('destaque')

        if tatuador_id:
            queryset = queryset.filter(tatuador_id=tatuador_id)

        if destaque:
            queryset = queryset.filter(destaque=True)

        return queryset
    
    def perform_create(self, serializer):
        usuario = self.request.user
        tatuador, _ = Tatuador.objects.get_or_create(usuario=usuario)

        serializer.save(tatuador=tatuador)
    
# ==========================================
# LOGIN GOOGLE
# ==========================================
def google_login_success(request):
    if not request.user.is_authenticated:
        return redirect("http://localhost:5173")

    user = request.user

    # gerar JWT
    refresh = RefreshToken.for_user(user)

    access_token = str(refresh.access_token)

    # redireciona pro frontend com token
    return redirect(
        f"http://localhost:5173/google-success?token={access_token}"
    )