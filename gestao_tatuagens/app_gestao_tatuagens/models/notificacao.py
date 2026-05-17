from .base import BaseModel
from django.db import models
from .usuario import Usuario

class Notificacao(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notificacoes')
    mensagem = models.TextField()
    lida = models.BooleanField(default=False)
    criada_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Notificação"
        verbose_name_plural = "Notificações"
        ordering = ['-criada_em']

    def __str__(self):
        return f"{self.usuario.email} - {self.mensagem[:30]}"