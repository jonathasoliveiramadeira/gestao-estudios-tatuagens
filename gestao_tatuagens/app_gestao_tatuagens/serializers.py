from rest_framework import serializers
from .models.servico import Servico
from .models.tatuador import Tatuador
from .models.cliente import Cliente
from .models.agendamento import Agendamento
from .models.avaliacao import Avaliacao
from .models.usuario import Usuario
from .models.portfolio import Portfolio


class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = '__all__'
        read_only_fields = ["tatuador"]

class AgendamentoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Agendamento
        fields = '__all__'
        read_only_fields = ['cliente']

    def validate(self, data):

        tatuador = data.get("tatuador")
        data_agendamento = data.get("data")

        queryset = Agendamento.objects.filter(
            tatuador=tatuador,
            data=data_agendamento
        )

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)

        if queryset.exists():
            raise serializers.ValidationError(
                "Já existe um agendamento nesse horário."
            )

        return data

class AvaliacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avaliacao
        fields = '__all__'

class PortfolioResumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ["id", "imagem", "titulo"]


class TatuadorSerializer(serializers.ModelSerializer):
    portfolios = PortfolioResumoSerializer(many=True, read_only=True)

    class Meta:
        model = Tatuador
        fields = "__all__"
        read_only_fields = ["usuario"]

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = "__all__"

    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        return user
    
class PortfolioSerializer(serializers.ModelSerializer):
    tatuador_nome = serializers.CharField(source="tatuador.usuario.first_name", read_only=True)

    class Meta:
        model = Portfolio
        fields = '__all__'
        read_only_fields = ['tatuador']
