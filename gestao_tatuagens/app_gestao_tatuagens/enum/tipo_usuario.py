from django.db import models

class TipoUsuario(models.TextChoices):
    TATUADOR = 'TATUADOR', 'Tatuador'
    CLIENTE = 'CLIENTE', 'Cliente'