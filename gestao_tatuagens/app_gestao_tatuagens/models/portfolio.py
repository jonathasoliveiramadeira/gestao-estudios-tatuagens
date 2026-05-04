from django.db import models
from .tatuador import Tatuador

class Portfolio(models.Model):
    tatuador = models.ForeignKey(
        Tatuador,
        on_delete=models.CASCADE,
        related_name="portfolios"
    )

    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True)

    imagem = models.ImageField(upload_to="portfolio/")

    estilo = models.CharField(max_length=100, blank=True)

    destaque = models.BooleanField(default=False)

    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo