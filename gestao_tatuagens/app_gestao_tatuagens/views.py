from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

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

    def perform_create(self, serializer):
        serializer.save()


# ==========================================
# AVALIAÇÕES
# ==========================================
class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        tatuador_id = self.request.query_params.get('tatuador')

        if tatuador_id:
            queryset = queryset.filter(tatuador_id=tatuador_id)

        return queryset


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
# USUÁRIO LOGADO (IMPORTANTE PRO REACT)
# ==========================================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def usuario_logado(request):
    if request.user.is_authenticated:
        return Response({
            "id": request.user.id,
            "email": request.user.email,
            "tipo_usuario": request.user.tipo_usuario,
            "is_staff": request.user.is_staff
        })

    return Response({"erro": "Não autenticado"}, status=401)