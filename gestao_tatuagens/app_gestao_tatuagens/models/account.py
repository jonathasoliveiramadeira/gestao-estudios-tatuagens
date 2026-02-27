from .base import BaseModel
from django.contrib.auth.models import User
from django.db import models

class Account(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    class Meta:
        abstract = False

    def __str__(self):
        return self.name