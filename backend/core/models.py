from django.db import models
from django.contrib.auth.models import User

class Transacao (models.Model):
    TIPO_ESCOLHAS = [
        {"receita", "Receita"},
        {"gasto", "Gasto"},
    ]
    
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=10, choices=TIPO_ESCOLHAS)
    categoria = models.CharField(max_length=50)
    data = models.DateTimeField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} (R$ {self.valor})"