from django.db import models
from .usuario import Usuario

class Portfolio(models.Model):
    tatuador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='portfolios')
    imagem = models.ImageField(upload_to='portfolio/')
    descricao = models.TextField(blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Portfolio de {self.tatuador.nome}"