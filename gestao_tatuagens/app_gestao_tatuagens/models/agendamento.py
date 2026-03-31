from django.db import models
from .cliente import Cliente
from .tatuador import Tatuador
from .servico import Servico


class Agendamento(models.Model):

    class Status(models.TextChoices):
        PENDENTE = "pendente", "Pendente"
        CONFIRMADO = "confirmado", "Confirmado"
        CANCELADO = "cancelado", "Cancelado"
        CONCLUIDO = "concluido", "Concluído"

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        related_name="agendamentos"
    )
    tatuador = models.ForeignKey(
        Tatuador,
        on_delete=models.CASCADE,
        related_name="agendamentos"
    )
    servico = models.ForeignKey(
        Servico,
        on_delete=models.CASCADE
    )

    data = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDENTE
    )

    observacoes = models.TextField(blank=True, null=True)

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Agendamento"
        verbose_name_plural = "Agendamentos"
        ordering = ["-data"]

    def __str__(self):
        return f"{self.cliente.usuario.username} - {self.data}"

    def clean(self):
        """
        Impede dois agendamentos no mesmo horário para o mesmo tatuador
        """
        if Agendamento.objects.filter(
            tatuador=self.tatuador,
            data=self.data
        ).exclude(id=self.id).exists():
            raise ValueError("Já existe um agendamento para esse horário.")