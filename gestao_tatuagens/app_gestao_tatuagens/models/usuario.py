from django.db import models
from django.contrib.auth.models import AbstractUser
from ..enum import TipoUsuario
from django.contrib.auth.models import BaseUserManager

class UsuarioManager(BaseUserManager):
        def create_user(self, email, password=None, **extra_fields):
            if not email:
                raise ValueError("O email é obrigatório")

            email = self.normalize_email(email)
            user = self.model(email=email, **extra_fields)
            user.set_password(password)
            user.save(using=self._db)
            return user

        def create_superuser(self, email, password=None, **extra_fields):
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)
            extra_fields.setdefault('tipo_usuario', 'admin')

            return self.create_user(email, password, **extra_fields)

class Usuario(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    tipo_usuario = models.CharField(max_length=20, choices=TipoUsuario.choices, verbose_name="Tipo de Usuário", help_text="Marque se você é um tatuador ou cliente.")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UsuarioManager()

    def __str__(self):
        return f"{self.email} ({self.tipo_usuario})"

