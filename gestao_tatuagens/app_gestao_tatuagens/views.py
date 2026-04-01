from rest_framework import viewsets
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


class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer

    def get_queryset(self):
        tatuador_id = self.request.query_params.get('tatuador')
        
        if tatuador_id:
            return Servico.objects.filter(tatuador_id=tatuador_id)
        
        return Servico.objects.all()
    
class AgendamentoViewSet(viewsets.ModelViewSet):
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer

    def get_queryset(self):
        queryset = Agendamento.objects.all()
        cliente_id = self.request.query_params.get('cliente')
        tatuador_id = self.request.query_params.get('tatuador')

        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)

        if tatuador_id:
            queryset = queryset.filter(tatuador_id=tatuador_id)

        return queryset
    
class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer

    def get_queryset(self):
        queryset = Avaliacao.objects.all()
        tatuador_id = self.request.query_params.get('tatuador')

        if tatuador_id:
            queryset = queryset.filter(tatuador_id=tatuador_id)

        return queryset
    
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class TatuadorViewSet(viewsets.ModelViewSet):
    queryset = Tatuador.objects.all()
    serializer_class = TatuadorSerializer
