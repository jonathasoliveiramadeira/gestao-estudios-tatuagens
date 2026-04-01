from rest_framework import serializers
from .models.servico import Servico
from .models.tatuador import Tatuador
from .models.cliente import Cliente
from .models.agendamento import Agendamento
from .models.avaliacao import Avaliacao


class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = '__all__'

class AgendamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agendamento
        fields = '__all__'

class AvaliacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avaliacao
        fields = '__all__'

class TatuadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tatuador
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
