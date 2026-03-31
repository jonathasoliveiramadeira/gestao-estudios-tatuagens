from .base import BaseModel
from django.db import models
from .usuario import Usuario

class Cliente(BaseModel):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"

    def __str__(self):
        return self.usuario.nome