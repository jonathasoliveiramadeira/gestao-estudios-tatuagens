from django.contrib import admin

# Register your models here.
from .models import Tatuador, Cliente, Usuario, Servico, Agendamento, Avaliacao

admin.site.register(Tatuador)
admin.site.register(Cliente)
admin.site.register(Usuario)
admin.site.register(Servico)
admin.site.register(Agendamento)
admin.site.register(Avaliacao)
