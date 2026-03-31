from .base import BaseModel
from django.db import models
from .usuario import Usuario

class Tatuador(BaseModel):
    nome_estudio = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    descricao = models.TextField()
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Tatuador"
        verbose_name_plural = "Tatuadores"

    def __str__(self):
        return self.usuario.username