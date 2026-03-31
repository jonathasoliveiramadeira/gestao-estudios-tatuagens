from django.db import models
from .cliente import Cliente
from .tatuador import Tatuador
from .agendamento import Agendamento


class Avaliacao(models.Model):
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        related_name="avaliacoes"
    )
    tatuador = models.ForeignKey(
        Tatuador,
        on_delete=models.CASCADE,
        related_name="avaliacoes"
    )
    agendamento = models.OneToOneField(
        Agendamento,
        on_delete=models.CASCADE,
        related_name="avaliacao"
    )

    nota = models.IntegerField(
        help_text="Nota de 1 a 5"
    )
    comentario = models.TextField()

    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Avaliação"
        verbose_name_plural = "Avaliações"

    def __str__(self):
        return f"{self.nota} - {self.tatuador.usuario.username}"

    def clean(self):
        """
        Garante que a avaliação só pode ser feita após conclusão do serviço
        """
        if self.agendamento.status != "concluido":
            raise ValueError("Só é possível avaliar após o serviço ser concluído.")

        if not (1 <= self.nota <= 5):
            raise ValueError("A nota deve estar entre 1 e 5.")