from rest_framework import serializers
from .models.servico import Servico
from .models.tatuador import Tatuador
from .models.cliente import Cliente
from .models.agendamento import Agendamento
from .models.avaliacao import Avaliacao
from .models.usuario import Usuario


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

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['email', 'password', 'tipo_usuario']

    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        return user
