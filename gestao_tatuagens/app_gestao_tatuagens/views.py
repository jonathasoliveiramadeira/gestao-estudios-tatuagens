from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import redirect
from django.utils import timezone

from .models.servico import Servico
from .serializers import ServicoSerializer

from .models.agendamento import Agendamento
from .serializers import AgendamentoSerializer
from datetime import datetime, timedelta

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

    # ==========================================
    # PERMISSÕES
    # ==========================================
    def get_permissions(self):

        # LISTAR E VISUALIZAR
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        # CRIAR/EDITAR/EXCLUIR
        return [IsAuthenticated(), IsTatuador()]

    # ==========================================
    # QUERYSET
    # ==========================================
    def get_queryset(self):

        queryset = Servico.objects.all()

        tatuador_id = self.request.query_params.get("tatuador")

        # CLIENTE BUSCANDO SERVIÇOS
        if tatuador_id:

            queryset = queryset.filter(
                tatuador_id=tatuador_id
            )

        # TATUADOR LOGADO
        elif (
            self.request.user.is_authenticated and
            hasattr(self.request.user, "tatuador")
        ):

            queryset = queryset.filter(
                tatuador=self.request.user.tatuador
            )

        return queryset

    # ==========================================
    # CRIAR SERVIÇO
    # ==========================================
    def perform_create(self, serializer):

        serializer.save(
            tatuador=self.request.user.tatuador
        )

# ==========================================
# AGENDAMENTOS
# ==========================================
class AgendamentoViewSet(viewsets.ModelViewSet):
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer
    # ==========================================
    # PERMISSÕES
    # ==========================================
    def get_permissions(self):

        # HORÁRIOS DISPONÍVEIS
        if self.action == "horarios_disponiveis":
            return [AllowAny()]

        # DEMAIS AÇÕES
        return [IsAuthenticated()]

    # ==========================================
    # QUERYSET
    # ==========================================
    def get_queryset(self):

        user = self.request.user

        queryset = Agendamento.objects.all()

        if hasattr(user, "cliente"):
            queryset = queryset.filter(cliente=user.cliente)

        elif hasattr(user, "tatuador"):
            queryset = queryset.filter(tatuador=user.tatuador)

        return queryset
    
    # ==========================================
    # CRIA AGENDAMENTO COM VALIDAÇÕES
    # ==========================================
    def perform_create(self, serializer):

        cliente, _ = Cliente.objects.get_or_create(
            usuario=self.request.user
        )

        data_agendamento = serializer.validated_data["data"]
        tatuador = serializer.validated_data["tatuador"]
        servico = serializer.validated_data["servico"]

        # ==========================================
        # NÃO PERMITIR DATAS PASSADAS
        # ==========================================
        if data_agendamento < timezone.now():

            raise serializers.ValidationError(
                {"erro": "Não é possível agendar no passado."}
            )

        # ==========================================
        # CALCULA HORÁRIO FINAL
        # ==========================================
        inicio_novo = data_agendamento

        fim_novo = inicio_novo + timedelta(
            minutes=servico.duracao_minutos
        )

        # ==========================================
        # BUSCA AGENDAMENTOS DO TATUADOR
        # ==========================================
        agendamentos = Agendamento.objects.filter(
            tatuador=tatuador,
            status__in=["pendente", "confirmado"]
        )

        # ==========================================
        # VERIFICA CONFLITOS
        # ==========================================
        for agendamento in agendamentos:

            inicio_existente = agendamento.data

            fim_existente = (
                inicio_existente +
                timedelta(
                    minutes=agendamento.servico.duracao_minutos
                )
            )

            conflito = (
                inicio_novo < fim_existente and
                fim_novo > inicio_existente
            )

            if conflito:

                raise serializers.ValidationError(
                    {
                        "erro": (
                            "Já existe um agendamento "
                            "neste horário."
                        )
                    }
                )

        # ==========================================
        # SALVA
        # ==========================================
        serializer.save(cliente=cliente)

    # HORÁRIOS DISPONÍVEIS
    @action(detail=False, methods=['get'], permission_classes=[AllowAny], url_path="horarios-disponiveis")
    def horarios_disponiveis(self, request):

        tatuador_id = request.query_params.get("tatuador")
        data_str = request.query_params.get("data")

        if not tatuador_id or not data_str:
            return Response(
                {"erro": "Informe tatuador e data"},
                status=400
            )

        try:
            data = datetime.strptime(data_str, "%Y-%m-%d").date()

        except ValueError:
            return Response(
                {"erro": "Formato de data inválido"},
                status=400
            )

        # ==========================================
        # HORÁRIOS PADRÃO
        # ==========================================
        horarios = []

        hora_inicio = 9
        hora_fim = 18

        for hora in range(hora_inicio, hora_fim):
            horarios.append(f"{hora:02d}:00")

        # ==========================================
        # AGENDAMENTOS EXISTENTES
        # ==========================================
        agendamentos = Agendamento.objects.filter(
            tatuador_id=tatuador_id,
            data__date=data,
            status__in=["pendente", "confirmado"]
        )

        horarios_ocupados = []

        for agendamento in agendamentos:

            inicio = agendamento.data

            duracao = agendamento.servico.duracao_minutos

            quantidade_blocos = (duracao + 59) // 60

            for i in range(quantidade_blocos):

                horario = (
                    inicio + timedelta(hours=i)
                ).strftime("%H:%M")

                horarios_ocupados.append(horario)

        # ==========================================
        # REMOVE HORÁRIOS OCUPADOS
        # ==========================================
        horarios_disponiveis = [
            horario
            for horario in horarios
            if horario not in horarios_ocupados
        ]

        return Response(horarios_disponiveis)

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
    queryset = Tatuador.objects.all().prefetch_related("portfolios")
    serializer_class = TatuadorSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'me']:
            return [IsAuthenticated()]
        return [AllowAny()]

    # ENDPOINT: /api/tatuadores/me/
    @action(detail=False, methods=['get'])
    def me(self, request):
        tatuador, _ = Tatuador.objects.get_or_create(usuario=request.user)
        serializer = self.get_serializer(tatuador)
        return Response(serializer.data)

    # GARANTE QUE SÓ EDITA O PRÓPRIO ESTÚDIO
    def perform_update(self, serializer):
        if self.get_object().usuario != self.request.user:
            raise PermissionError("Você não pode editar este estúdio.")
        serializer.save()

    # GARANTE QUE CRIA VINCULADO AO USER
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


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
# LOGOUT
# ==========================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
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
# CSRF
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
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return redirect(
        f"http://localhost:5173/google-success?token={access_token}"
    )