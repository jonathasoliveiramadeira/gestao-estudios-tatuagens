from django.db import models
from .tatuador import Tatuador


class Servico(models.Model):

    tatuador = models.ForeignKey(
        Tatuador,
        on_delete=models.CASCADE,
        related_name="servicos"
    )

    nome = models.CharField(
        max_length=100
    )

    descricao = models.TextField()

    preco = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    # ==========================================
    # DURAÇÃO EM MINUTOS
    # ==========================================
    duracao_minutos = models.PositiveIntegerField(
        default=60,
        help_text="Duração estimada do serviço em minutos"
    )

    criado_em = models.DateTimeField(
        auto_now_add=True
    )

    atualizado_em = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        verbose_name = "Serviço"
        verbose_name_plural = "Serviços"
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome} - {self.tatuador.usuario.username}"